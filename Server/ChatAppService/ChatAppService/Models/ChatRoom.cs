using System;
using System.Collections.Generic;

namespace ChatAppService.Models
{
    public partial class ChatRoom
    {
        public ChatRoom()
        {
            ChatMembers = new HashSet<ChatMember>();
            ChatMessages = new HashSet<ChatMessage>();
        }

        public int ChatId { get; set; }
        public string? Name { get; set; }

        public virtual ICollection<ChatMember> ChatMembers { get; set; }
        public virtual ICollection<ChatMessage> ChatMessages { get; set; }
    }
}
