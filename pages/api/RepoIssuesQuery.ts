import type { NextApiRequest, NextApiResponse } from "next";
const NetlifyGraph = require("../../lib/netlifyGraph");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let accessToken = null;
  accessToken = process.env.NETLIFY_GRAPH_TOKEN;

  const { name, owner } = JSON.parse(req.body) || {};

  const { errors, data } = await NetlifyGraph.fetchRepoIssuesQuery(
    { name, owner },
    { accessToken: accessToken }
  );

  if (errors) {
    console.error(JSON.stringify(errors, null, 2));
  }

  console.log(JSON.stringify(data, null, 2));

  res.setHeader("Content-Type", "application/json");

  return res.status(200).json({
    errors,
    data,
  });
};

export default handler;

/**
 * Client-side invocations:
 * Call your Netlify function from the browser with this helper:
 */

/**
async function fetchRepoIssuesQuery(params) {
  const {name, owner} = params || {};
  const resp = await fetch(`/api/RepoIssuesQuery?name=${name}&owner=${owner}`, {
    method: "GET"
  });

  const text = await resp.text();

  return JSON.parse(text);
}
*/
