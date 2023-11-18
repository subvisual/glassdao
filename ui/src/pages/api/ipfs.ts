import Moralis from "moralis";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: any) {
  if (req.method === "GET") {
    if (!req.query.cid) {
      return;
    }

    const raw = await fetch(
      `https://ipfs.moralis.io:2053/ipfs/${req.query.cid}/content.json`
    );

    const reviews = JSON.parse(
      decodeURIComponent((await raw.text()).toString())
    );

    res.status(200).json(reviews);

    return;
  }

  if (req.method === "POST") {
    const payload = btoa(encodeURIComponent(JSON.stringify(req.body)));

    const op = await Moralis.EvmApi.ipfs.uploadFolder({
      abi: [
        {
          path: "content.json",
          content: payload,
        },
      ],
    });

    res.status(200).json(op);

    return;
  }
}
