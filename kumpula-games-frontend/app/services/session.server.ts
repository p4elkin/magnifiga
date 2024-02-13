import { createCookieSessionStorage } from "@remix-run/node";

export let sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "_session", // use any name
        sameSite: "lax", // helps with CSRF
        path: "/",
        httpOnly: true,
        secrets: ["s3cr3t"],
        secure: process.env.NODE_ENV === "production",
    },
});

// you can also export the methods individually for your own usage
export let { getSession, commitSession, destroySession } = sessionStorage;