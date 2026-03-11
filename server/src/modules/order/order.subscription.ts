import { builder } from "../../builder";
import { pubsub } from "../../utils/pubsub";

builder.subscriptionFields((t) => ({
  orderUpdated: t.field({
    type: "String",
    args: {
      id: t.arg.string({ required: false }),
    },
    subscribe: async function* (_root, args) {
      console.log(`[Subscription] Client subscribed to orderUpdated (id: ${args.id || "all"})`);
      for await (const payload of pubsub.subscribe("orderUpdated")) {
        console.log(`[Subscription] Event received from PubSub:`, payload);
        if (!args.id || payload.id === args.id) {
          console.log(`[Subscription] Yielding payload to client for ID: ${payload.id}`);
          yield payload;
        } else {
          console.log(`[Subscription] Skipping payload for ID: ${payload.id} (Client wants: ${args.id})`);
        }
      }
    },
    resolve: (payload) => {
      console.log(`[Subscription] Resolving payload for client:`, payload);
      return payload.id;
    },
  }),
}));
