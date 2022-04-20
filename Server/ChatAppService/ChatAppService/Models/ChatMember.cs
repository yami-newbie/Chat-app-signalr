using System;
using System.Collections.Generic;

namespace ChatAppService.Models
{
    public partial class ChatMember
    {
        public int? ChatId { get; set; }
        public int? Uid { get; set; }
        public int Id { get; set; }

        public virtual ChatRoom? Chat { get; set; }
        public virtual Account? UidNavigation { get; set; }
    }
}
