import type {ActionFunctionArgs} from "@remix-run/node";
import type {User} from "~/services/auth.server";
import {redirect} from "@remix-run/node";
import {commitSession, getSession} from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
    const data = await request.formData()

    const result = await fetch(`${process.env.PLAYERS_API_URL}/update`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                name: data.get("name"),
                playerId: data.get("playerId")
            }
        )
    })

    let session = await getSession(request.headers.get("cookie"))

    let user: User = session.get("user")
    user.name = data.get("name") as string;

    session.set("user", user)

    let headers = new Headers({ "Set-Cookie": await commitSession(session) });

    return redirect("/games", {headers});
}
