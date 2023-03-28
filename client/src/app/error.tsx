"use client";

export default function Error({
  reset,
  error,
}: {
  reset: () => void;
  error: Error;
}) {
  return (
    <p>
      {error.message}
      <button onClick={reset}>Try again.</button>
    </p>
  );
}
