import Echo from "laravel-echo";
import Pusher from "pusher-js";

let echo;

const echoInstance = ({ anonymous = false } = {}) => {
  if (typeof window === "undefined") return null;

  if (!echo) {
    window.Pusher = Pusher;

    echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
      forceTLS: true,
      enabledTransports: ["ws", "wss"],

      authEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL}/broadcasting/auth`,

      auth: anonymous
        ? {
            headers: {
              Accept: "application/json",
            },
          }
        : {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              Accept: "application/json",
            },
          },
    });

    window.Echo = echo;
  }

  return echo;
};

export default echoInstance;