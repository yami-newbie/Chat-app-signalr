using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ChatAppService.Models
{
    public partial class ChatServerContext : DbContext
    {
        public ChatServerContext()
        {
        }

        public ChatServerContext(DbContextOptions<ChatServerContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Account> Accounts { get; set; } = null!;
        public virtual DbSet<ChatMember> ChatMembers { get; set; } = null!;
        public virtual DbSet<ChatMessage> ChatMessages { get; set; } = null!;
        public virtual DbSet<ChatRoom> ChatRooms { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();

                optionsBuilder.UseSqlServer(configuration.GetConnectionString("ChatServer"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>(entity =>
            {
                entity.HasKey(e => e.Uid);

                entity.ToTable("Account");

                entity.Property(e => e.Uid).HasColumnName("uid");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .HasColumnName("name");

                entity.Property(e => e.Password)
                    .HasMaxLength(50)
                    .HasColumnName("password");

                entity.Property(e => e.Username)
                    .HasMaxLength(50)
                    .HasColumnName("username");
            });

            modelBuilder.Entity<ChatMember>(entity =>
            {
                entity.ToTable("ChatMember");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.ChatId).HasColumnName("chatId");

                entity.Property(e => e.Uid).HasColumnName("uid");

                entity.HasOne(d => d.Chat)
                    .WithMany(p => p.ChatMembers)
                    .HasForeignKey(d => d.ChatId)
                    .HasConstraintName("FK_ChatMember_ChatRoom");

                entity.HasOne(d => d.UidNavigation)
                    .WithMany(p => p.ChatMembers)
                    .HasForeignKey(d => d.Uid)
                    .HasConstraintName("FK_ChatMember_Account");
            });

            modelBuilder.Entity<ChatMessage>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.ChatId).HasColumnName("chatId");

                entity.Property(e => e.Time)
                    .HasColumnType("smalldatetime")
                    .HasColumnName("time");

                entity.Property(e => e.Title)
                    .HasColumnType("text")
                    .HasColumnName("title");

                entity.Property(e => e.Uid).HasColumnName("uid");

                entity.HasOne(d => d.Chat)
                    .WithMany(p => p.ChatMessages)
                    .HasForeignKey(d => d.ChatId)
                    .HasConstraintName("FK_ChatMessages_ChatRoom");

                entity.HasOne(d => d.UidNavigation)
                    .WithMany(p => p.ChatMessages)
                    .HasForeignKey(d => d.Uid)
                    .HasConstraintName("FK_ChatMessages_Account");
            });

            modelBuilder.Entity<ChatRoom>(entity =>
            {
                entity.HasKey(e => e.ChatId)
                    .HasName("PK_RoomChat");

                entity.ToTable("ChatRoom");

                entity.Property(e => e.ChatId).HasColumnName("chatId");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .HasColumnName("name");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
