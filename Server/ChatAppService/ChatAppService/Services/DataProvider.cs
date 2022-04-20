using ChatAppService.Models;
using System.Text;
using XSystem.Security.Cryptography;

namespace ChatAppService.Services
{
    public class DataProvider
    {
        private static DataProvider instance;
        public ChatServerContext db;
        public static DataProvider Instance { get { if (instance == null) instance = new DataProvider(); return instance; } set => instance = value; }
        DataProvider()
        {
            if (db == null)
            {
                db = new ChatServerContext();
            }
        }

        public string Encrypt(string text)
        {
            using (MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider())
            {
                UTF8Encoding utf8 = new UTF8Encoding();
                byte[] data = md5.ComputeHash(utf8.GetBytes(text));
                return Convert.ToBase64String(data);
            }
        }
    }
}
