import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

type IssueDetailData = {};

type InvalidateEvent = {
  operation: "invalidate";
  entity: Array<string>;
  id?: number;
};

type UpdateEvent = {
  operation: "update";
  entity: Array<string>;
  id: number;
  payload: Partial<IssueDetailData>;
};

type WebSocketEvent = InvalidateEvent | UpdateEvent;

const useIssuesSubscription = () => {
  const queryClient = useQueryClient();

  const websocket = React.useRef<WebSocket>();

  React.useEffect(() => {
    websocket.current = new WebSocket(
      "http://localhost:8888/api/IssuesSubscription"
    );
    websocket.current.onmessage = (event) => {
      console.log("received event", event);
      const data: WebSocketEvent = JSON.parse(event.data);
      switch (data.operation) {
        case "invalidate":
          queryClient.invalidateQueries(
            [...data.entity, data.id].filter(Boolean)
          );
          break;
        case "update":
          queryClient.setQueriesData(data.entity, (oldData) => {
            const update = (entity: Record<string, unknown>) =>
              entity.id === data.id ? { ...entity, ...data.payload } : entity;
            return Array.isArray(oldData)
              ? oldData.map(update)
              : update(oldData as Record<string, unknown>);
          });
          break;
      }
    };
    websocket.current.onopen = () => {
      console.log("connected");
    };

    return () => {
      websocket.current?.close();
    };
  }, [queryClient]);

  return (input: WebSocketEvent) => {
    websocket.current?.send(JSON.stringify(input));
  };
};

export default useIssuesSubscription;
