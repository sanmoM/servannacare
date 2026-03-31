import Echo from "laravel-echo";

const echoInstance = () => {
    return new Echo({
        broadcaster: "reverb",
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
        wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
        wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
        wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
        forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === "https",
        enabledTransports: ["ws", "wss"],
        authEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                Accept: "application/json",
            },
        },
    })
};
export default echoInstance;