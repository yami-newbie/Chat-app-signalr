using System;
using System.Collections.Generic;

namespace ChatAppService.Models
{
    public partial class Account
    {
        public Account()
        {
            ChatMembers = new HashSet<ChatMember>();
            ChatMessages = new HashSet<ChatMessage>();
        }

        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public int Uid { get; set; }
        public string? Name { get; set; }

        public virtual ICollection<ChatMember> ChatMembers { get; set; }
        public virtual ICollection<ChatMessage> ChatMessages { get; set; }
    }
}
