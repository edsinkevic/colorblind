using Marten;
using Marten.Events.Daemon.Resiliency;
using Marten.Events.Projections;
using Microsoft.Extensions.DependencyInjection;
using Weasel.Core;
using Persistence.Projections;

namespace Persistence;

public static class SetupMartenExtensions
{
    public static IServiceCollection SetupMarten(this IServiceCollection services,
        string schemaName,
        string connectionString)
    {
        services
            .AddMarten(options =>
                {
                    options.Events.DatabaseSchemaName = schemaName;
                    options.DatabaseSchemaName = schemaName;

                    options.Connection(connectionString);
                    options.UseDefaultSerialization(EnumStorage.AsString,
                        nonPublicMembersStorage: NonPublicMembersStorage.All);

                    options.Projections.Add<ParcelProjection>(ProjectionLifecycle.Inline);
                    options.Projections.Add<TerminalProjection>(ProjectionLifecycle.Inline);
                    options.Projections.Add<CourierProjection>(ProjectionLifecycle.Inline);
                }
            ).AddAsyncDaemon(DaemonMode.HotCold);
        return services;
    }
}
