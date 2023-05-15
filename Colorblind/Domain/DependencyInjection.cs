using Domain.UseCases;
using Marten;
using Marten.Events.Daemon.Resiliency;
using Marten.Events.Projections;
using Microsoft.Extensions.DependencyInjection;

namespace Domain;

public static class DependencyInjection
{
    public static IServiceCollection AddDomain(this IServiceCollection services)
    {
        return services.AddScoped<GetTerminalUseCase>()
            .AddScoped<ListTerminalsUseCase>()
            .AddScoped<RegisterTerminalUseCase>();
    }
}
