import {Form, useLoaderData} from "@remix-run/react";
import type {Game} from "~/game";
import type {LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {getUnixTime} from "date-fns";
import {GamesAPI, getUser} from "~/root";
import {GameCard} from "~/routes/gameCard";
import {ActionFunctionArgs} from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
    let userData = await getUser(request);

    const fetchGames = async () => {
        const now = new Date()
        const fetchGameAmount = 8
        return fetch(`${GamesAPI}?since=${getUnixTime(now)}&amount=${fetchGameAmount}`);
    }

    const gamesResponse = await fetchGames();
    const gameList: Game[] = await gamesResponse.json();

    return {
        user: userData,
        games: gameList
    };
}

export const meta: MetaFunction = () => {
    return [
        { title: "Kumpula Futsal fun games" },
        { name: "description", content: "Game schedule in Kumpula" },
    ];
};

export async function action({request}: ActionFunctionArgs) {
    let currentPlayer = await getUser(request);
    let args = await request.formData()

    let {_action, gameId} = Object.fromEntries(args)

    await fetch(`${GamesAPI}/${gameId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                status: _action,
                playerId: currentPlayer?.id
            }
        )
    })

    return null;
}

const GameBoard = () => {
    const data = useLoaderData<typeof loader>();

    const isUserAttendingGame = (game: Game) => {
        return game.players.find(player => player.name === data.user?.name) != undefined
    }

    return (
        <div className="text-center p-1">
            <div className="flex flex-wrap">
                {data.games.map(game =>
                    <GameCard key={game.id}
                              game={game}
                              userName={data.user?.name}
                              isCurrentUserAttending={isUserAttendingGame(game)} />)}
            </div>
        </div>
    );
}

function LoginForm() {
    return (
        <Form method="post">
            <label className="text-sm mr-1" htmlFor="username">Login:</label>
            <input id="username" className="border p-1 text-sm" type="username" name="username" required />
            <label className="text-sm ml-1 mr-1" htmlFor="username">Password:</label>
            <input
                className="border p-1 text-sm caret-black"
                type="password"
                name="password"
                autoComplete="current-password"
                required
            />
            <input type="submit" name="signin" value="&lt;sign in&gt;" formAction="/login" className="text-sm m-1"/>
            <input type="submit" name="register" value="&lt;register&gt;" formAction="/register" className="text-sm m-1"/>

        </Form>
    );
}

function PlayerInfo({user}: { user: any }) {
    return <>
        {user.name && <div className="row-start-1 col-start-1 text-left"><b>⚽&nbsp;{user.name}</b></div>}
        {!user.name && <Form className="row-start-1 col-start-1 text-left" action="/update-player" method="post">
            <label className="text-sm ml-1 mr-1" htmlFor="firstName">⚽&nbsp;Please enter your name:</label>
            <input id="name" className="border p-1 text-sm mr-1" type="text" name="name" required />
            <input id="playerId" className="border p-1 text-sm mr-1" type="hidden" name="playerId" value={user.id} />
            <button type="submit" className="button text-sm">
                &lt;update&gt;
            </button>
        </Form>}
    </>;
}

export default function Board() {
    const {user} = useLoaderData<typeof loader>();
    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
            <div className="grid grid-rows-1 grid-cols-2  p-1.5">
                {user && <form className="row-start-1 col-start-2 text-right text-sm" action="/logout" method="post">
                    <button type="submit" className="button">
                        &lt;logout&gt;
                    </button>
                </form>}
                {user ? <PlayerInfo user={user}/> : <LoginForm/>}
            </div>
            <GameBoard/>
        </div>
    );
}
