import type { NextApiRequest, NextApiResponse } from "next";
const NetlifyGraph = require("../../lib/netlifyGraph");

exports.handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const reqBody = await extractBody(req);

  const payload = NetlifyGraph.parseAndVerifyIssuesSubscriptionEvent({
    headers: {
      "x-netlify-graph-signature": req.headers[
        "x-netlify-graph-signature"
      ] as string
    },
    body: reqBody,
  });

  if (!payload) {
    return res.status(422).json({
      success: false,
      error: 'Unable to verify payload signature',
    });
  }

  const { errors, data } = payload;

  if (errors) {
    console.error(errors);
  }

  console.log(data);

  res.setHeader("Content-Type", "application/json");

  /**
   * If you want to unsubscribe from this webhook
   * in order to stop receiving new events,
   * simply return status 410, e.g.:
   * 
   * return res.status(410).json({});
   */

  return res.status(200).json({
    successfullyProcessedIncomingWebhook: true,
  });
};

exports.default = exports.handler;

export const config = {
  api: {
    // We manually parse the body of the request in order to verify
    // that it's signed by Netlify before processing the event.
    bodyParser: false,
  },
};

const extractBody = (req: NextApiRequest): Promise<string> => {
  let body = [];
  const promise: Promise<string> = new Promise((resolve, reject) => {
    req
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        const fullBody = Buffer.concat(body).toString();
        resolve(fullBody);
      });
  });

  return promise;
};
