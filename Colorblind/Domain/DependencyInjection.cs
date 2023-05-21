using Domain.UseCases.CourierUseCases;
using Domain.UseCases.ParcelUseCases;
using Domain.UseCases.TerminalUseCases;
using Microsoft.Extensions.DependencyInjection;

namespace Domain;

public static class DependencyInjection
{
    public static IServiceCollection AddDomain(this IServiceCollection services)
    {
        return services.AddScoped<GetTerminalUseCase>()
            .AddScoped<ListTerminalsUseCase>()
            .AddScoped<RegisterTerminalUseCase>()
            .AddScoped<GetCourierUseCase>()
            .AddScoped<ListCouriersUseCase>()
            .AddScoped<RegisterCourierUseCase>()
            .AddScoped<GetParcelUseCase>()
            .AddScoped<GetParcelsInTerminalUseCase>()
            .AddScoped<GetParcelsByCourierForTerminalUseCase>()
            .AddScoped<GetParcelByCodeUseCase>()
            .AddScoped<ListParcelsUseCase>()
            .AddScoped<RegisterParcelUseCase>()
            .AddScoped<UnregisterParcelUseCase>()
            .AddScoped<SubmitParcelToTerminalUseCase>()
            .AddScoped<ShipParcelFromTerminalUseCase>()
            .AddScoped<DeliverParcelToTerminalUseCase>()
            .AddScoped<ReceiveParcelFromTerminalUseCase>();
    }
}
