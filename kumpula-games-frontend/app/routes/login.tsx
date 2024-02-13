// app/routes/login.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
    return await authenticator.authenticate("form", request, {
        failureRedirect: "/games",
        successRedirect: "/games"
    });
}