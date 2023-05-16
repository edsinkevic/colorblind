namespace Domain.Persistence;

public interface IIdGenerator
{
    public Guid Generate();
}
