using Domain.Persistence;
using Marten;

namespace Persistence.Implementation;

public class SaveChangesAsync : ISaveChanges
{
    private readonly IDocumentSession _documentSession;

    public SaveChangesAsync(IDocumentSession documentSession)
    {
        _documentSession = documentSession;
    }

    public async Task SaveChanges(CancellationToken ct)
    {
        await _documentSession.SaveChangesAsync(ct);
    }

    public async Task SaveChanges()
    {
        await _documentSession.SaveChangesAsync();
    }
}
