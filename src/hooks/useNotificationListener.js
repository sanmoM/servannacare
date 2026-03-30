import { useEffect, useRef } from "react";
import { getEchoInstance } from "@/lib/echo";

export const useNotificationListener = (authId, onMessage) => {
  const echoRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!authId) return;

    const echo = getEchoInstance();
    if (!echo) return;

    echoRef.current = echo;

    const channelName = `App.Models.User.${authId}`;
    console.log(`Subscribing to private channel: ${channelName}`);

    // Track connection state
    echo.connector.pusher.connection.bind("connected", () => {
      console.log("Echo Connected");
    });
    echo.connector.pusher.connection.bind("disconnected", () => {
      console.log("Echo Disconnected");
    });
    echo.connector.pusher.connection.bind("error", (err) => {
      console.error("Echo Error", err);
    });
    echo.connector.pusher.connection.bind("state_change", (states) => {
      console.log(`Echo State: ${states.previous} -> ${states.current}`);
    });

    const channel = echo.private(channelName);
    channelRef.current = channel;

    channel.notification((notification) => {
      console.log("Notification received:", notification);
      if (onMessage) {
        onMessage(notification);
      }
    });

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        // Stop listening to notification events
        channelRef.current.stopListening(".Illuminate\\\\Notifications\\\\Events\\\\BroadcastNotificationCreated");
        if (echoRef.current) {
          echoRef.current.leave(channelName);
        }
      }
      if (echoRef.current) {
        echoRef.current.disconnect();
      }
      
      // Cleanup connection listeners
      if (echoRef.current?.connector?.pusher?.connection) {
        echoRef.current.connector.pusher.connection.unbind("connected");
        echoRef.current.connector.pusher.connection.unbind("disconnected");
        echoRef.current.connector.pusher.connection.unbind("error");
        echoRef.current.connector.pusher.connection.unbind("state_change");
      }
    };
  }, [authId, onMessage]);
};
