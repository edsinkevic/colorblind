using ErrorOr;

namespace Logic.Errors;

public static class Errors
{
        public static class Parcel
        {
                public static Error NotFound { get; } = Error.NotFound(code: "Parcel.NotFound");
        }

}
