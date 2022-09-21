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
    
    
    
    export type LastTenReposInput = {
  /**
 * Returns the last _n_ elements from the list.
 */
 "last"?: number
};
    
    export type LastTenRepos = {
  /**
  * Any data from the function will be returned here
  */
data: {
  gitHub?: {
  /**
  * The currently authenticated user.
  */
viewer: {
  /**
  * A list of repositories that the user owns.
  */
repositories: {
  /**
  * Identifies the total count of items in the connection.
  */
totalCount: number;
  /**
  * A list of nodes.
  */
nodes?: Array<{
  /**
  * The image used to represent this repository in Open Graph data.
  */
openGraphImageUrl: string;
  /**
  * The name of the repository.
  */
name: string;
  /**
  * The repository's name with owner.
  */
nameWithOwner: string;
}>;
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
     * Fetch the last ten repos from a User on Github
     */
    export function fetchLastTenRepos(
      variables: LastTenReposInput,
      options?: NetlifyGraphFunctionOptions
    ): Promise<LastTenRepos>;
    
    export interface Functions {
      /**
    * Fetch the last ten repos from a User on Github
    */
    fetchLastTenRepos: typeof fetchLastTenRepos
    }
    
    export const functions: Functions;
    
    export default functions;
    