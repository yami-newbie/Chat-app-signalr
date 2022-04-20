using ChatAppService;
using ChatAppService.Hubs;
using ChatAppService.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ChatServerContext>();

builder.Services.AddSignalR(e => {
    e.MaximumReceiveMessageSize = 102400000;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCors", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

builder.Services.AddSingleton<IDictionary<string, UserConnection>>(options => new Dictionary<string, UserConnection>());
builder.Services.AddSingleton<IDictionary<string, Account>>(options => new Dictionary<string, Account>());

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.UseCors("MyCors");

app.MapHub<ChatHub>("/chat");
app.MapHub<AccountHub>("/account");

app.Run();
