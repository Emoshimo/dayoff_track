using EmployeeManagement.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using EmployeeManagement.Repositories;
using Swashbuckle.AspNetCore.Filters;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Services;
using EmployeeManagement.Interfaces.ServiceInterfaces;



var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// Starting Custom Configurations 
// Database connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("WebApiDatabase") ??
    throw new InvalidOperationException("WebApiDatabase String not found.")
));

// Swagger Authenticate Check
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateAudience = false,
        ValidateIssuer = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration.GetSection("Jwt:Key").Value!))
    };
});
// Repositories
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IManagerRepository, ManagerRepository>();
builder.Services.AddScoped<IDayOffTypesRepository, DayOffTypesRepository>();
builder.Services.AddScoped<IDayOffRequestRepository, DayOffRequestRepository>();
builder.Services.AddScoped<IJobScheduleRepository, JobScheduleRepository>();
builder.Services.AddScoped<IEmailRepository, EmailRepository>();

// Services
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IManagerService, ManagerService>();
builder.Services.AddScoped<ICacheService, CacheService>();
builder.Services.AddScoped<IEmployeeCache,  EmployeeCache>();
builder.Services.AddScoped<IDayOffRequestService, DayOffRequestService>();

//Register Hosted Service
//builder.Services.AddHostedService<AnniversaryHostedService>();


// Quartz Configuration:
builder.Services.ConfigureQuartz();

// Caching
builder.Services.AddMemoryCache();


// Ending Custom Configurations


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:7237")
       .AllowAnyMethod()
       .AllowAnyHeader();
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


//Schedule jobs from the database for Quartz
using (var scope = app.Services.CreateScope())
{
    var serviceProvider = scope.ServiceProvider;
    await QuartzConfigurationService.ScheduleFromDataBase(serviceProvider);
}

app.Run();
