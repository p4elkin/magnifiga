import {Authenticator} from "remix-auth";
import {FormStrategy} from "remix-auth-form";
import {sessionStorage} from "~/services/session.server";
import invariant from "tiny-invariant";
import { jwtDecode } from "jwt-decode";
import type {JwtPayload} from "jsonwebtoken";

export type User = { id: number; name: string; email: string; jwt: string };

export let authenticator = new Authenticator<User>(sessionStorage);

async function loginUser(email: String, password: string, isRegisterAction: boolean): Promise<User> {
    let action = isRegisterAction ? "register" : "login"
    let authResponse = await fetch(`${process.env.PLAYERS_API_URL}/${action}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "email": email, "password": password })
    });

    if (!authResponse.ok) {
        return Promise.reject("Failed to authenticate");
    }

    let token = await authResponse.text();
    let jwtPayload = jwtDecode<JwtPayload>(token)

    return Promise.resolve(
        {
            id: jwtPayload["upn"] as number,
            name: jwtPayload["full_name"] as string,
            email: jwtPayload["email"] as string,
            jwt: token
        } as User);

}

authenticator.use(
    new FormStrategy(async ({ form, context }) => {
        // Here you can use `form` to access and input values from the form.
        // and also use `context` to access more things from the server
        let email = form.get("username") as string // or email... etc
        let password = form.get("password") as string
        let register = form.get("register") as string | undefined

        // You can validate the inputs however you want
        invariant(email.length > 0, "username must not be empty");
        invariant(password.length > 0, "password must not be empty");

        return await loginUser(email, password, register != undefined);
    })
);

