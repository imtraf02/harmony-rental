import { env } from "../env";

/**
 * Broadcasts a message to a Supabase Realtime channel via REST RPC.
 * This is used for server-side event propagation.
 * 
 * @param topic The channel topic (e.g., 'orders', 'room:123')
 * @param event The event name (e.g., 'order_created')
 * @param payload The data to send
 * @param isPrivate Whether the channel is private (default: true)
 */
export async function broadcastTopic(
  topic: string,
  event: string,
  payload: any,
  isPrivate = true
) {
  const url = `${env.SUPABASE_URL}/rest/v1/rpc/broadcast`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        topic,
        event,
        payload,
        private: isPrivate,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[Supabase Broadcast Error] ${res.status}: ${text}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Supabase Broadcast Exception]", error);
    return false;
  }
}
