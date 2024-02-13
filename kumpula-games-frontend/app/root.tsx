import type { LinksFunction } from "@remix-run/node";
import styles from "./tailwind.css";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {authenticator} from "~/services/auth.server";

export const GamesAPI = `http://localhost:8080/games`;
export const PlayersAPI = `http://localhost:8080/players`;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export async function getUser(request: Request) {
  let user = await authenticator.isAuthenticated(request);
  if (user) {
    let {jwt, ...userData} = user
    return userData;
  } else {
    return null
  }
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
