using ChatAppService.Models;
using ChatAppService.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;

namespace ChatAppService.Hubs
{
    [EnableCors("MyCors")]
    public class ChatHub : Hub
    {
        ChatServerContext db = DataProvider.Instance.db;

        private readonly string _channelName;
        private readonly IDictionary<string, UserConnection> _connections;
        public ChatHub(IDictionary<string, UserConnection> connections)
        {
            _connections = connections;
            _channelName = "My channel";
        }
        public async Task JoinRoom(UserConnection user)
        {
            if(user != null)
            {
                try
                {
                    int uid = -1;

                    if (int.TryParse(user.User, out uid))
                    {
                        var result = db.ChatMembers.Where(x => x.Chat.Name == user.Room && x.Uid == uid).Select(x => x.ChatId).ToList();

                        if (result.Count == 0)
                        {
                            ChatRoom chatRoom = db.ChatRooms.Where(x => x.Name == user.Room).FirstOrDefault();

                            if(chatRoom != null)
                            {
                                ChatMember chatMember = new ChatMember();
                                chatMember.ChatId = chatRoom.ChatId;
                                chatMember.Uid = uid;

                                db.ChatMembers.Add(chatMember);

                                db.SaveChanges();
                            }
                        }

                        await Groups.AddToGroupAsync(Context.ConnectionId, user.Room);

                        var res = db.Accounts.Where(x => x.Uid == uid).FirstOrDefault();

                        _connections[Context.ConnectionId] = user;

                        if (GetMessages(user.Room).IsCompletedSuccessfully)
                        {
                            await Clients.Group(user.Room).SendAsync("ReceiveMessage", _channelName, "server", $"{res.Name} vào phòng");
                            await SendUsersConnected(user.Room);
                        }


                    }
                }
                catch(Exception ex)
                {
                    await Clients.Group(user.Room).SendAsync("ReceiveMessage", _channelName, "server", ex.Message);
                }

            }
        }

        public async Task GetConnectionId()
        {
            await Clients.Clients(Context.ConnectionId).SendAsync("ReceiveConnectionId", Context.ConnectionId);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                _connections.Remove(Context.ConnectionId);
                var res = db.Accounts.Where(x => x.Uid == int.Parse(userConnection.User)).FirstOrDefault();
                Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _channelName, "server", $"{res.Name} rời phòng");
                SendUsersConnected(userConnection.Room);
            }

            return base.OnDisconnectedAsync(exception);
        }

        public Task SendUsersConnected(string room)
        {
            var users = _connections.Values
                .Where(c => c.Room == room)
                .Select(c => c.User).ToList();
            List<string> accounts = new List<string>();
            
            users.ForEach(c => accounts.Add(db.Accounts.Where(x => x.Uid == int.Parse(c)).Select(c => c.Name).FirstOrDefault()));

            return Clients.Group(room).SendAsync("UsersInRoom", accounts);
        }

        struct Messages
        {
            public string User { get; set; }
            public int Uid { get; set; }
            public string Title { get; set; }
        }

        public async Task GetMessages(string room)
        {
            try
            {
                ChatRoom chatRoom = db.ChatRooms.Where(x => x.Name == room).FirstOrDefault();

                if (chatRoom != null)
                {
                    var messages = db.ChatMessages.Where(x => x.ChatId == chatRoom.ChatId).ToList();

                    List<Messages> res = new List<Messages>();

                    if(messages != null)
                    {
                        messages.ForEach(x => res.Add(new Messages() { User = db.Accounts.Where(x => x.Uid == (int)x.Uid).First().Username, Title = x.Title, Uid = (int)x.Uid }));
                    }

                    await Clients.Client(Context.ConnectionId).SendAsync("ReceiveGroupMessage", true, res);
                }
            }
            catch (Exception ex)
            {
                await Clients.Group(room).SendAsync("ReceiveGroupMessage", false, ex.Message);
            }
        }

        public async Task SendMessage(string message)
        {
            try
            {
                if (_connections.TryGetValue(Context.ConnectionId, out UserConnection user))
                {

                    ChatMessage chatMessage = new ChatMessage();

                    ChatRoom chatRoom = db.ChatRooms.Where(x => x.Name == user.Room).FirstOrDefault();

                    Account account = db.Accounts.Where(x => x.Uid == int.Parse(user.User)).FirstOrDefault();

                    if (chatRoom != null)
                    {
                        chatMessage.ChatId = chatRoom.ChatId;
                        chatMessage.Title = message;
                        chatMessage.Uid = int.Parse(user.User);
                        chatMessage.Time = DateTime.Now;

                        db.ChatMessages.Add(chatMessage);

                        db.SaveChanges();
                    }

                    await Clients.Group(user.Room).SendAsync("ReceiveMessage", account.Name, account.Uid, message);
                }
            }
            catch (Exception ex)
            {

            }
            
        }
    }
}
