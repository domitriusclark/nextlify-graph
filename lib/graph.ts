export const graphEndpoint =
  "https://graph.netlify.com/graphql?app_id=24b8d33d-e30e-497b-8d6a-ca8251ad9f4a&schema_id=9c5d3307-bd4b-4909-b115-bad91195c942";

export const graph = async (query: string, variables: any, token: string) => {
  const response = await fetch(graphEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const result = await response.json();
  return result;
};
