import echoInstance from "@/lib/echo";
import { useEffect } from "react";
import Pusher from "pusher-js";
import { useAuth } from "./useAuth";

export default function useNotificationListener(authId, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id || !authId) return;

    window.Pusher = Pusher;
    const echo = echoInstance();

    const conversationId =
      Math.min(user.id, authId) + "_" + Math.max(user.id, authId);
  
    const channel = echo
      .private(`chat.${user?.id}`)
      .listen(".message.sent", (event) => {
        // console.log("📩 Event received:", event);
        onMessage?.(event);
      });

    channel.subscribed(() => {
      // console.log("✅ Subscribed to:", `chat.${user?.id}`);
    });

    channel.error((err) => {
      // console.log("❌ Subscription error:", err);
    });

    return () => {
      echo.leave(`chat.${user?.id}`);
      echo.disconnect();
    };
  }, [user?.id, authId]);
}
