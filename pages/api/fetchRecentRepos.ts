import type { NextApiRequest, NextApiResponse } from "next";
const NetlifyGraph = require("../../lib/netlifyGraph");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // By default, all API calls use no authentication
  let accessToken = null;

  //// If you want to use the client's accessToken when making API calls on the user's behalf:
  accessToken = req.headers["authorization"]?.split(" ")[1];

  //// If you want to use the API with your own access token:
  // accessToken = process.env.NETLIFY_GRAPH_TOKEN;

  const { errors, data } = await NetlifyGraph.fetchLatestRepos(
    { last: req.body.last },
    { accessToken: accessToken }
  );

  if (errors) {
    console.error(JSON.stringify(errors, null, 2));
  }

  res.setHeader("Content-Type", "application/json");

  return res.status(200).json({
    errors,
    data,
  });
}

/**
 * Client-side invocations:
 * Call your Netlify function from the browser with this helper:
 */

/**
async function fetchLastTenRepos(params) {
  const {last} = params || {};
  const resp = await fetch(`/api/LastTenRepos?last=${last}`, {
    method: "GET"
  });

  const text = await resp.text();

  return JSON.parse(text);
}
*/
