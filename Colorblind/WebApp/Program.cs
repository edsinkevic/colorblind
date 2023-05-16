using System.Text.Json.Serialization;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using WebApp;

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
    .Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(o =>
        o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()))
    .Configure<JsonOptions>(o =>
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()))
    .AddControllers();

builder.Services.SetupMarten(schemaName, connectionString).AddDomain().AddPersistence();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger().UseSwaggerUI();
}

app.UseMiddleware<DomainErrorMiddleware>().UseMiddleware<ConcurrencyExceptionMiddleware>();

app.UseCors(options => options.AllowAnyOrigin().WithExposedHeaders("*").AllowAnyMethod().AllowAnyHeader())
    .UseHttpsRedirection()
    .UseAuthorization();

app.MapControllers();

app.Run();
