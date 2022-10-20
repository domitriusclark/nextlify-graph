import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import NetlifyGraph from "@lib/netlifyGraph";

const SubscriptionPage: NextPage = () => {
  return (
    <div>
      <h1>Subscription Page</h1>
    </div>
  );
};

export async function getServerSideProps(context) {
  NetlifyGraph.subscribeToIssuesSubscription({
    name: "nextlify-graph",
    owner: "domitriusclark",
  });

  return {
    props: {},
  };
}

export default SubscriptionPage;
