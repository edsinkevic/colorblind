using Domain.Values;

namespace WebApp.Responses;

public record GetShippableParcelsInTerminalResponse(List<ShippableParcelResponse> Parcels);
    
public record ShippableParcelResponse(Guid Id, ParcelSize Size, String DeliveryAddress);
