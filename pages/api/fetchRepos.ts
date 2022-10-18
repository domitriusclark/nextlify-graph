import type { NextApiRequest, NextApiResponse } from "next";
import { graph } from "@lib/graph";
import { fetchReposQuery } from "@lib/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netlify = require("@netlify/functions");
  const { token, error } = netlify.getNetlifyGraphToken(req);

  const data = await graph(fetchReposQuery, null, token);

  res.status(200).json(data);
}
