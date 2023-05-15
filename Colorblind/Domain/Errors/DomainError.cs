namespace Domain.Errors;

public class DomainError : Exception
{
    public DomainError()
    {
    }

    public DomainError(string message) : base(message)
    {
    }
}
