import { createPubSub } from "graphql-yoga";

export type PubSubEvents = {
  orderUpdated: [{ id: string; event: string }];
};

export const pubsub = createPubSub<PubSubEvents>();
