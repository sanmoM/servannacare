import echoInstance from "@/lib/echo";
import { useEffect } from "react";
import Pusher from "pusher-js";

export default function useNotificationListener(authId, onMessage) {
  useEffect(() => {
    window.Pusher = Pusher;
    const echo = echoInstance();

    const channel = echo
      .private(`App.Models.User.${authId}`)
      .notification((notification) => {
        console.log("Notification:", notification);
        onMessage?.(notification);
      });

    echo.connector.pusher.connection.bind("connected", () => {
      console.log("✅ Connected to Reverb");
    });

    echo.connector.pusher.connection.bind("disconnected", () => {
      console.log("❌ Disconnected from Reverb");
    });

    echo.connector.pusher.connection.bind("error", (err) => {
      console.log("⚠️ Connection error:", err);
    });
    echo.connector.pusher.connection.bind("state_change", (states) => {
      // console.log("🔄 State change:", states);
    });

    echo.connector.pusher.connection.bind("connecting", () => {
      // console.log("⏳ Connecting...");
    });

    echo.connector.pusher.connection.bind("unavailable", () => {
      // console.log("🚫 Connection unavailable");
    });

    echo.connector.pusher.connection.bind("failed", () => {
      // console.log("❌ Connection failed");
    });

    channel
      .subscribed(() => {
        console.log(
          "✅ Subscribed successfully to:",
          `App.Models.User.${authId}`,
        );
      })
      .error((err) => {
        // console.log("❌ Subscription error:", err);
      });

    return () => {
      echo.leave(`App.Models.User.${authId}`);
      echo.disconnect();
    };
  }, []);
}
