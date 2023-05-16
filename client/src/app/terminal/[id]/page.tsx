import Link from "next/link";

interface Props {
  params: {
    id: string;
  };
}

export default function TerminalHome({ params: { id } }: Props) {
  return (
    <>
      <div>
        <Link href={`/terminal/${id}/courier`}>
          <button className={"bigButton"}>Courier environment</button>
        </Link>
      </div>
      <div>
        <Link href={`/terminal/${id}/receive`}>
          <button className={"bigButton"}>Receive parcel</button>
        </Link>
      </div>
      <div>
        <Link href={`/terminal/${id}/submit`}>
          <button className={"bigButton"}>Submit parcel</button>
        </Link>
      </div>
    </>
  );
}
