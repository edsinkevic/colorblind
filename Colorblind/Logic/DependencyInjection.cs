using Microsoft.Extensions.DependencyInjection;

namespace Logic;

public static class DependencyInjection
{
        public static IServiceCollection AddLogic(this IServiceCollection services)
        {
                services.AddMediatR(configuration =>
                        configuration.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));
                return services;
        }
}
