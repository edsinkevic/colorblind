namespace Domain.Values;

public enum ParcelStatus
{
    Registered = 1,
    Submitted = 8,
    Shipped = 16,
    Delivered = 32,
    Unregistered = 64,
    Received = 128
}
