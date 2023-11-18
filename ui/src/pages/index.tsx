import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Glassdao</h1>
      <Link href={"/review"}>Add review</Link>
    </div>
  );
}
