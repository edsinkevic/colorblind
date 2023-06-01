namespace Domain.Persistence;

public interface IPasswordHasher
{
    public string HashPassword(string password, out byte[] salt);

    public bool VerifyPassword(string password, string hash, byte[] salt);
}
