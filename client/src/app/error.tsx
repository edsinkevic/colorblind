"use client";

export default function Error({ reset }) {
  return (
    <p>
      error...<button onClick={reset}>Try again.</button>
    </p>
  );
}
