using Domain.Entities;

namespace Domain.DTOs;

public record ShippableParcelInTerminal(
    Parcel Parcel,
    Terminal ReceivingTerminal
);
