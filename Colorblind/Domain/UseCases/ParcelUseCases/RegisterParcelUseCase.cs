using System.Runtime.InteropServices.JavaScript;
using Domain.Commands.CourierCommands;
using Domain.Commands.ParcelCommands;
using Domain.Events.CourierEvents;
using Domain.Events.ParcelEvents;
using Domain.Persistence;
using Mapster;

namespace Domain.UseCases.ParcelUseCases;

public class RegisterParcelUseCase
{
    private readonly IParcelRepository _parcelRepository;
    private readonly IIdGenerator _idGenerator;
    private readonly ISaveChanges _saveChanges;

    public RegisterParcelUseCase(
        IParcelRepository parcelRepository,
        IIdGenerator idGenerator,
        ISaveChanges saveChanges
    )
    {
        _parcelRepository = parcelRepository;
        _idGenerator = idGenerator;
        _saveChanges = saveChanges;
    }

    public async Task<Guid> Execute(
        RegisterParcel command,
        CancellationToken ct = default)
    {
        var id = _idGenerator.Generate();
        var code = _idGenerator.Generate().ToString();
        var date = DateTime.Now;
        var @event = command.Adapt<ParcelRegistered>() with { Id = id, Code = code, CreatedDate = date };
        _parcelRepository.Create(@event);
        await _saveChanges.SaveChanges(ct);
        return id;
    }
}
