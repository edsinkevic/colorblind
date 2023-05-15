using Domain.Persistence;
using Marten.Schema.Identity;

namespace Persistence.Implementation;

public class IdGenerator : IIdGenerator
{
    public Guid Generate()
    {
        return CombGuidIdGeneration.NewGuid();
    }
}
