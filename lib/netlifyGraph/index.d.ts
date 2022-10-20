/* eslint-disable */
    // @ts-nocheck
    // GENERATED VIA NETLIFY AUTOMATED DEV TOOLS, EDIT WITH CAUTION!
    
    export type NetlifyGraphFunctionOptions = {
      /**
       * The accessToken to use for the request
       */
      accessToken?: string;
      /**
       * The siteId to use for the request
       * @default process.env.SITE_ID
       */
      siteId?: string;
    }
    
    export type WebhookEvent = {
      body: string;
      headers: Record<string, string | null | undefined>;
    };
    
    export type GraphQLError = {
      "path": Array<string | number>;
      "message": string;
      "extensions": Record<string, unknown>;
    };
    
    
    
    /**
  * Subscribe to the issues of a repo and pull the latest 10 issues
  */
  export function subscribeToIssuesSubscription(
    /**
     * This will be available in your webhook handler as a query parameter.
     * Use this to keep track of which subscription you're receiving
     * events for.
     */
    variables: {
  /**
 * The name of the repository
 */
 "name": string;  
 /**
 * The login field of a user or organization
 */
 "owner": string
},
    options?: {
      /**
       * The accessToken to use for the lifetime of the subscription.
       */
      accessToken?: string | null | undefined;
      /**
       * A string id that will be passed to your webhook handler as a query parameter
       * along with each event.
       * This can be used to keep track of which subscription you're receiving
       */
      netlifyGraphWebhookId?: string | null | undefined;
      /**
       * The absolute URL of your webhook handler to handle events from this subscription.
       */
      webhookUrl?: string | null | undefined;
      /**
       * The secret to use when signing the webhook request. Use this to verify
       * that the webhook payload is coming from Netlify Graph. Defaults to the
       * value of the NETLIFY_GRAPH_WEBHOOK_SECRET environment variable.
       */
      webhookSecret?: string | null | undefined;
    }) : void
  
  export type IssuesSubscriptionEvent = {
  /**
  * Any data from the function will be returned here
  */
data: {
  poll: {
  query: {
  gitHub?: {
  /**
  * Lookup a given repository by the owner and repository name.
  */
repository?: {
  /**
  * The HTTP URL for this repository
  */
url: string;
  /**
  * A list of issues that have been opened in the repository.
  */
issues: {
  /**
  * Identifies the total count of items in the connection.
  */
totalCount: number;
  /**
  * A list of nodes.
  */
nodes?: Array<{
  /**
  * Identifies the body of the issue.
  */
body: string;
  /**
  * The actor who authored the comment.
  */
author?: & ({id: string;
  /**
    * The HTTP URL for this user
    */
  url: string;
  /**
    * The user's public profile name.
    */
  name?: string;
  /**
    * Used to tell what type of object was returned for the selection
    */
  __typename?: "GitHubUser";});
  id: string;
  /**
  * The HTTP URL for this issue
  */
url: string;
  /**
  * Identifies the issue title.
  */
title: string;
  /**
  * Identifies the state of the issue.
  */
state: "OPEN" | "CLOSED";
  /**
  * Identifies the date and time when the object was created.
  */
createdAt: unknown;
}>;
};
};
};
};
};
};
  /**
  * Any errors from the function will be returned here
  */
errors?: Array<GraphQLError>;
}
  
  /**
   * Verify the IssuesSubscription event body is signed securely, and then parse the result.
   */
  export function parseAndVerifyIssuesSubscriptionEvent (/** A Netlify Handler Event */ event : WebhookEvent) : null | IssuesSubscriptionEvent
  


    export type ExampleQuery = {
  /**
  * Any data from the function will be returned here
  */
data: {
  __typename: unknown;
};
  /**
  * Any errors from the function will be returned here
  */
errors?: Array<GraphQLError>;
};
    
    /**
     * 
     */
    export function fetchExampleQuery(
      /**
      * Pass `{}` as no variables are defined for this function.
      */
      variables: Record<string, never>,
      options?: NetlifyGraphFunctionOptions
    ): Promise<ExampleQuery>;

export type RepoIssuesQueryInput = {
  /**
 * The name of the repository
 */
 "name"?: string;  
 /**
 * The login field of a user or organization
 */
 "owner"?: string
};
    
    export type RepoIssuesQuery = {
  /**
  * Any data from the function will be returned here
  */
data: {
  gitHub?: {
  /**
  * Lookup a given repository by the owner and repository name.
  */
repository?: {
  /**
  * A list of issues that have been opened in the repository.
  */
issues: {
  /**
  * A list of nodes.
  */
nodes?: Array<{
  /**
  * The HTTP URL for this issue
  */
url: string;
  /**
  * Identifies the issue title.
  */
title: string;
  /**
  * Identifies the state of the issue.
  */
state: "OPEN" | "CLOSED";
  id: string;
  /**
  * Identifies the date and time when the object was created.
  */
createdAt: unknown;
  /**
  * Identifies the body of the issue.
  */
body: string;
  /**
  * The actor who authored the comment.
  */
author?: {
  /**
  * The username of the actor.
  */
login: string;
  /**
  * The HTTP URL for this actor.
  */
url: string;
};
}>;
  /**
  * Identifies the total count of items in the connection.
  */
totalCount: number;
};
};
};
};
  /**
  * Any errors from the function will be returned here
  */
errors?: Array<GraphQLError>;
};
    
    /**
     * An empty query to start from
     */
    export function fetchRepoIssuesQuery(
      variables: RepoIssuesQueryInput,
      options?: NetlifyGraphFunctionOptions
    ): Promise<RepoIssuesQuery>;
    
    export interface Functions {
      /**
    * Subscribe to the issues of a repo and pull the latest 10 issues
    */
    subscribeToIssuesSubscription:subscribeToIssuesSubscription,
    /**
     * Verify the event body is signed securely, and then parse the result.
     */
    parseAndVerifyIssuesSubscriptionEvent: typeof parseAndVerifyIssuesSubscriptionEvent,
  /**
    * 
    */
    fetchExampleQuery: typeof fetchExampleQuery,
  /**
    * An empty query to start from
    */
    fetchRepoIssuesQuery: typeof fetchRepoIssuesQuery
    }
    
    export const functions: Functions;
    
    export default functions;
    