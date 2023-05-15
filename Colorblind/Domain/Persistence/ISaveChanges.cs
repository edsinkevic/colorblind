namespace Domain.Persistence;

public interface ISaveChanges
{
    public Task SaveChanges(CancellationToken ct);
    public Task SaveChanges();
}
