using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Json;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

var schemaName =
    Environment.GetEnvironmentVariable("SCHEMA_NAME") ??
    throw new ArgumentException("SCHEMA_NAME not provided!");

var connectionString =
    Environment.GetEnvironmentVariable("DB_STRING") ??
    builder.Configuration.GetConnectionString("Colorblind") ??
    throw new ArgumentException("Colorblind database connection string not provided");

builder.Services
    .AddEndpointsApiExplorer()
    .AddSwaggerGen()
    .Configure<JsonOptions>(o =>
        o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()))
    .Configure<Microsoft.AspNetCore.Mvc.JsonOptions>(o =>
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()))
    .AddControllers();

builder.Services.SetupMarten(schemaName, connectionString);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger().UseSwaggerUI();
}

app.UseCors(options => options.AllowAnyOrigin().WithExposedHeaders().AllowAnyMethod().AllowAnyHeader())
    .UseHttpsRedirection()
    .UseAuthorization();

app.MapControllers();

app.Run();
