import type { NextApiRequest, NextApiResponse } from "next";
import NetlifyGraph from "../../lib/netlifyGraph";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // By default, all API calls use no authentication
  let accessToken = null;

  //// If you want to use the client's accessToken when making API calls on the user's behalf:
  // accessToken = req.headers["authorization"]?.split(" ")[1];

  //// If you want to use the API with your own access token:
  // accessToken = process.env.NETLIFY_GRAPH_TOKEN;
      
  const eventBodyJson = req.body || {};

  const name = typeof req.query?.name === 'string' ? req.query?.name : req.query?.name[0];
  const owner = typeof req.query?.owner === 'string' ? req.query?.owner : req.query?.owner[0];

  const { errors, data } = await NetlifyGraph.fetchRepoIssuesQuery({ name: name, owner: owner }, {accessToken: accessToken}); 

  if (errors) {
    console.error(JSON.stringify(errors, null, 2));
  }

  console.log(JSON.stringify(data, null, 2));

  res.setHeader("Content-Type", "application/json");

  return res.status(200).json({
    errors, data
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