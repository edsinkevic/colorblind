using Domain.Persistence;
using Microsoft.Extensions.DependencyInjection;
using Persistence.Implementation;

namespace Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddPersistence(this IServiceCollection services)
    {
        return services.AddScoped<ITerminalRepository, TerminalRepository>().AddScoped<ISaveChanges, SaveChangesAsync>()
            .AddScoped<IIdGenerator, IdGenerator>();
    }
}
