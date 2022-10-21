import * as React from "react";
import type { NextPage } from "next";

import { SubscriptionClient } from "onegraph-subscription-client";
import { Auth } from "netlify-graph-auth";
import NetlifyGraphAuth = Auth.NetlifyGraphAuth;

const SubscriptionPage: NextPage = ({ siteId }: any) => {
  const isServer = typeof window === "undefined";
  const [result, setResult] = React.useState(null);
  const [auth, setAuth] = React.useState(
    isServer
      ? null
      : new NetlifyGraphAuth({
          siteId: siteId,
        })
  );

  const needsLoginService = auth?.findMissingAuthServices(result)[0];

  React.useEffect(() => {
    const graphSubscription = new SubscriptionClient(siteId, {
      oneGraphAuth: auth,
    });

    graphSubscription
      .request({
        query: `
          subscription IssuesSubscription($name: String!, $owner: String!, ) @netlify(id: """53a0900d-90e7-44ae-85ee-eb27ec375534""", doc: """Subscribe to the issues of a repo and pull the latest 10 issues""") {
            poll(
              schedule: {every: {minutes: 1}}
              onlyTriggerWhenPayloadChanged: false
            ) {
              query {
                gitHub {
                  repository(name: $name, owner: $owner) {
                    url
                    issues(last: 10, states: OPEN) {
                      totalCount
                      nodes {
                        body
                        author {
                          ... on GitHubUser {
                            id
                            url
                            name
                          }
                        }
                        id
                        url
                        title
                        state
                        createdAt
                      }
                    }
                  }
                }
              }
            }
          }`,
        variables: {
          name: "nextlify-graph",
          owner: "domitriusclark",
        },
      })
      .subscribe({
        next: (res) => {
          setResult(res);
        },
        error: (error) => {
          console.log(error);
        },
      });

    return () => {
      graphSubscription.unsubscribeAll();
    };
  }, [siteId, auth]);

  console.log(result);

  return (
    <div>
      <h1>Subscription Page</h1>
      {needsLoginService ? (
        <button
          onClick={async () => {
            await auth.login(needsLoginService);
            const loginSuccess = await auth.isLoggedIn(needsLoginService);
            if (loginSuccess) {
              console.log("Successfully logged into " + needsLoginService);
            } else {
              console.log(
                "The user did not grant auth to " + needsLoginService
              );
            }
          }}
        >
          {`Log in to ${needsLoginService.graphQLField}`}
        </button>
      ) : (
        <p>Youre logged in 👍</p>
      )}

      {result && (
        <div>
          <h2>Issues</h2>
          <ul>
            {result.data.poll.query.gitHub.repository.issues.nodes.map(
              (issue: any) => (
                <li key={issue.id}>
                  <a href={issue.url}>{issue.title}</a>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  const siteId = process.env.SITE_ID;

  return {
    props: {
      siteId,
    },
  };
}

export default SubscriptionPage;
