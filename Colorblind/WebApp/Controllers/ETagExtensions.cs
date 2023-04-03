using Microsoft.Net.Http.Headers;

namespace WebApp.Controllers;

public static class ETagExtensions
{
    public static int ToExpectedVersion(this string? eTag)
    {
        if (eTag is null)
            throw new ArgumentNullException(nameof(eTag));

        var value = EntityTagHeaderValue.Parse(eTag).Tag.Value;
        if (value is null)
            throw new ArgumentException(nameof(value));

        return int.Parse(value.Substring(1, value.Length - 2));
    }
}
