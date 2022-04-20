using ChatAppService.Models;
using ChatAppService.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;

namespace ChatAppService.Hubs
{
    [EnableCors("MyCors")]
    public class AccountHub : Hub
    {
        private readonly IDictionary<string, Account> _connections;
        ChatServerContext db = DataProvider.Instance.db;

        public AccountHub(IDictionary<string, Account> connections)
        {
            _connections = connections;
        }

        public async Task CreateAccount(string username, string password)
        {
            Account _account = new Account();
            _account.Username = username;
            _account.Name = username;
            _account.Password = DataProvider.Instance.Encrypt(password);

            try
            {
                if (db.Accounts.Where(x => x.Username == username).FirstOrDefault() == null)
                {
                    var result = db.Accounts.Add(_account);

                    db.SaveChanges();

                    await Clients.Clients(Context.ConnectionId).SendAsync("CreateAccount", result.ToString());
                }
                else
                {
                    await Clients.Clients(Context.ConnectionId).SendAsync("CreateAccount", "Tên đăng nhập đã tồn tại");
                }
            }
            catch (Exception ex)
            {
                await Clients.Clients(Context.ConnectionId).SendAsync("CreateAccount", ex.Message);
            }
        }

        public async Task CreateNewRoom(string name)
        {
            ChatRoom room = new ChatRoom();
            room.Name = name;
            try
            {
                if (db.ChatRooms.Where(x => x.Name == name).FirstOrDefault() == null)
                {
                    var result = db.ChatRooms.Add(room);

                    if (_connections.TryGetValue(Context.ConnectionId, out Account account))
                    {
                        db.SaveChanges();

                        ChatMember member = new ChatMember();
                        member.ChatId = room.ChatId;
                        member.Uid = account.Uid;
                        db.ChatMembers.Add(member);

                        db.SaveChanges();

                        await Clients.Clients(Context.ConnectionId).SendAsync("CreateNewRoom", room.ChatId, "Tạo phòng thành công");
                    }
                }
                else
                {
                    await Clients.Clients(Context.ConnectionId).SendAsync("CreateNewRoom", null, "Tên phòng đã tồn tại");
                }
            }
            catch (Exception ex)
            {
                await Clients.Clients(Context.ConnectionId).SendAsync("CreateNewRoom", null, ex.Message);
            }
        }

        public Task SendUsersConnected()
        {
            var users = _connections.Values
                .Select(c => c.Username);

            return Clients.All.SendAsync("UsersInServer", users);
        }

        public async Task SendRoomsInServer()
        {
            var rooms = db.ChatRooms.Select(x => x.Name).ToList();
            await Clients.All.SendAsync("ReceiveRooms", rooms);
        }

        public async Task Login(string username, string password)
        {
            var encryptPassword = DataProvider.Instance.Encrypt(password);
            var result = db.Accounts.Where(x => x.Username == username && x.Password == encryptPassword).FirstOrDefault();

            string message = "Thành công";

            if (result == null)
            {
                message = "Tên đăng nhập hoặc tài khoản không đúng";
                await Clients.Clients(Context.ConnectionId).SendAsync("ReciveLogin", null, message);
            }
            else
            {
                _connections[Context.ConnectionId] = result;
                await SendUsersConnected();
                await Clients.Clients(Context.ConnectionId).SendAsync("ReciveLogin", result.Uid, message);
            }

        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out Account userConnection))
            {
                _connections.Remove(Context.ConnectionId);
                SendUsersConnected();
            }

            return base.OnDisconnectedAsync(exception);
        }
    }
}
