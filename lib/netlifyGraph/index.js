/* eslint-disable */
// @ts-nocheck
// GENERATED VIA NETLIFY AUTOMATED DEV TOOLS, EDIT WITH CAUTION!

// Basic LRU cache implementation
const makeLRUCache = (max) => {
  return { max: max, cache: new Map() };
};

const oldestCacheKey = (lru) => {
  return lru.keys().next().value;
};

// Depend on Map keeping track of insertion order
const getFromCache = (lru, key) => {
  const item = lru.cache.get(key);
  if (item) {
    // Delete key and re-insert so key is now at the end,
    // and now the last to be gc'd.
    lru.cache.delete(key);
    lru.cache.set(key, item);
  }
  return item;
};

const setInCache = (lru, key, value) => {
  if (lru.cache.has(key)) {
    lru.cache.delete(key);
  }
  if (lru.cache.size == lru.max) {
    const cacheKey = oldestCacheKey(lru);

    if (cacheKey) {
      lru.cache.delete(cacheKey);
    }
  }

  lru.cache.set(key, value);
};

// Cache the results of the Netlify Graph API for conditional requests
const cache = makeLRUCache(100);

const calculateCacheKey = (payload) => {
  return JSON.stringify(payload);
};

const schemaId = "9c5d3307-bd4b-4909-b115-bad91195c942";

const netlifyGraphHostWithProtocol =
  process.env.NETLIFY_GRAPH_HOST_WITH_PROTOCOL || "https://graph.netlify.com";

const makeNetlifyGraphUrl = ({ operationName, siteId }) => {
  return (
    netlifyGraphHostWithProtocol +
    "/graphql?app_id=" +
    siteId +
    "&operationName=" +
    operationName +
    "&schema_id=" +
    schemaId
  );
};

const httpFetch = (operationName, options) => {
  const reqBody = options.body || null;
  const userHeaders = options.headers || {};
  const headers = {
    ...userHeaders,
    "Content-Type": "application/json",
  };

  const timeoutMs = 30_000;

  const reqOptions = {
    method: "POST",
    headers: headers,
    timeout: timeoutMs,
    body: reqBody,
  };

  const siteId = options.siteId || process.env.SITE_ID;
  const netlifyGraphUrl = makeNetlifyGraphUrl({
    operationName: operationName,
    siteId: siteId,
  });

  console.log("Netlify Graph URL: " + netlifyGraphUrl);

  return fetch(netlifyGraphUrl, reqOptions).then((body) => {
    return body.text().then((bodyString) => {
      const headers = {};
      body.headers.forEach((k, v) => (headers[k] = v));

      return {
        body: bodyString,
        headers: headers,
        status: body.status,
      };
    });
  });
};

const fetchNetlifyGraph = function fetchNetlifyGraph(input) {
  const query = input.query;
  const docId = input.doc_id;
  const operationName = input.operationName;
  const variables = input.variables;

  const options = input.options || {};
  const accessToken = options.accessToken;

  const payload = {
    query: query,
    doc_id: docId,
    variables: variables,
    operationName: operationName,
  };

  let cachedOrLiveValue = new Promise((resolve) => {
    const cacheKey = calculateCacheKey(payload);

    // Check the cache for a previous result
    const cachedResultPair = getFromCache(cache, cacheKey);

    let conditionalHeaders = {
      "If-None-Match": "",
    };
    let cachedResultValue;

    if (cachedResultPair) {
      const [etag, previousResult] = cachedResultPair;
      conditionalHeaders = {
        "If-None-Match": etag,
      };
      cachedResultValue = previousResult;
    }

    const response = httpFetch(operationName, {
      ...options,
      method: "POST",
      headers: {
        ...conditionalHeaders,
        Authorization: accessToken ? "Bearer " + accessToken : "",
      },
      body: JSON.stringify(payload),
    });

    response.then((result) => {
      // Check response headers for a 304 Not Modified
      if (result.status === 304) {
        // Return the cached result
        resolve(cachedResultValue);
      } else if (result.status === 200) {
        // Update the cache with the new etag and result
        const etag = result.headers["etag"];
        const resultJson = JSON.parse(result.body);
        if (etag) {
          // Make a note of the new etag for the given payload
          setInCache(cache, cacheKey, [etag, resultJson]);
        }
        resolve(resultJson);
      } else {
        return result.json().then((json) => {
          resolve(json);
        });
      }
    });
  });

  return cachedOrLiveValue;
};

const subscribeToIssuesSubscription = (variables, rawOptions) => {
  const options = rawOptions || {};
  const netlifyGraphWebhookId = options.netlifyGraphWebhookId;
  const netlifyGraphWebhookUrl =
    options.webhookUrl ||
    `${process.env.DEPLOY_URL}/api/IssuesSubscription?netlifyGraphWebhookId=${netlifyGraphWebhookId}`;
  const secret =
    options.webhookSecret || process.env.NETLIFY_GRAPH_WEBHOOK_SECRET;
  const fullVariables = {
    ...variables,
    netlifyGraphWebhookUrl: netlifyGraphWebhookUrl,
    netlifyGraphWebhookSecret: { hmacSha256Key: secret },
  };

  console.log(netlifyGraphWebhookUrl);

  const subscriptionOperationDoc = `subscription IssuesSubscription($name: String!, $owner: String!, $netlifyGraphWebhookUrl: String!, $netlifyGraphWebhookSecret: OneGraphSubscriptionSecretInput!) @netlify(id: """53a0900d-90e7-44ae-85ee-eb27ec375534""", doc: """Subscribe to the issues of a repo and pull the latest 10 issues""") {
  poll(
    schedule: {every: {minutes: 1}}
    onlyTriggerWhenPayloadChanged: true
    webhookUrl: $netlifyGraphWebhookUrl
    secret: $netlifyGraphWebhookSecret
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
}`;

  fetchNetlifyGraph({
    query: subscriptionOperationDoc,
    operationName: "IssuesSubscription",
    variables: fullVariables,
    options: options,
    fetchStrategy: "POST",
  });
};

const parseAndVerifyIssuesSubscriptionEvent = (event, options) => {
  if (!verifyRequestSignature({ event: event }, options)) {
    console.warn("Unable to verify signature for IssuesSubscription");
    return null;
  }

  return JSON.parse(event.body || "{}");
};

export function fetchExampleQuery(variables, options) {
  return fetchNetlifyGraph({
    query: `query ExampleQuery {
  __typename
}`,
    operationName: "ExampleQuery",
    variables: variables,
    options: options,
    fetchStrategy: "POST",
  });
}

export function fetchRepoIssuesQuery(variables, options) {
  return fetchNetlifyGraph({
    query: `query RepoIssuesQuery($name: String = "", $owner: String = "") {
  gitHub {
    repository(name: $name, owner: $owner) {
      issues(states: OPEN, last: 10) {
        nodes {
          url
          title
          state
          id
          createdAt
          body
          author {
            login
            url
          }
        }
        totalCount
      }
    }
  }
}`,
    operationName: "RepoIssuesQuery",
    variables: variables,
    options: options,
    fetchStrategy: "POST",
  });
}

/**
 * The generated NetlifyGraph library with your operations
 */
const functions = {
  /**
   * Subscribe to the issues of a repo and pull the latest 10 issues
   */
  subscribeToIssuesSubscription: subscribeToIssuesSubscription,
  /**
   * Verify the event body is signed securely, and then parse the result.
   */
  parseAndVerifyIssuesSubscriptionEvent: parseAndVerifyIssuesSubscriptionEvent,
  /**
   *
   */
  fetchExampleQuery: fetchExampleQuery,
  /**
   * An empty query to start from
   */
  fetchRepoIssuesQuery: fetchRepoIssuesQuery,
};

const _default = functions;
export { _default as default };
