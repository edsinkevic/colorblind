namespace Domain.Errors;

public class DomainUnauthorizedError : Exception
{
    public DomainUnauthorizedError(string s) : base(s)
    {
    }
}