import Moralis from "moralis";

const KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU2ZTY2MWRjLWMyNmQtNDNlNi1hMTRlLTZmMDhlYjQ5NGFhOSIsIm9yZ0lkIjoiMzY0ODk5IiwidXNlcklkIjoiMzc1MDIxIiwidHlwZUlkIjoiNWM1NTFkMDAtNzBmZC00YmQ0LWFkZDYtYjY0N2NjZjgzZWE2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDAzMjAzMTEsImV4cCI6NDg1NjA4MDMxMX0.crwfNmkPBkA0JukJqDLGrDJfD9w-ot6aczDZD-y6drQ";

Moralis.start({
  apiKey: KEY,
});

export async function updateReviews(content: Record<string, any>[]) {
  const req = await fetch(`api/ipfs`, {
    method: "post",
    body: JSON.stringify(content),
  });

  const data = await req.json();

  const newCid = data?.[0].path.replace(
    "https://ipfs.moralis.io:2053/ipfs/",
    ""
  );
  const result = newCid.replace("/content.json", "");

  // "https://ipfs.moralis.io:2053/ipfs/QmVhDVxTnyghxTzGt3qfHTCPLdoGycNKWiePPYa5UUCqUp/content.json"

  return result;
}

export async function getReviews(cid: string) {
  const req = await fetch(`api/ipfs?cid=${cid}`);
  const data = await req.json();

  return JSON.parse(data);
}
