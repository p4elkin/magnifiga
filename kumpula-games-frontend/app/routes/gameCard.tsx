import {formatGameDate} from "~/dates";
import {toDate} from "date-fns";
import type {Game} from "~/game";
import {AttendanceStatus, StatusBadge} from "~/routes/statusBadge";


export interface GameCardProps {
    game: Game,
    userName: string | undefined,
    isCurrentUserAttending: boolean,
}

export const GameCard = ({game, userName, isCurrentUserAttending}: GameCardProps) => {
    return (
        <div className="shrink grow p-1 basis-8-card-layout ">
            <div
                className="bg-slate-100 font-bold row-start-1 col-start-1 justify-self-start text-sm text-left pl-2 pr-2">
                {formatGameDate(toDate(game.date))}
            </div>

            <div className="grid grid-rows-card grid-cols-card odd:bg-neutral-50/[0.3] border border-gray-300  min-w-fit h-[400px]">

                {userName && <div className="status-control-container row-start-1 col-start-3 relative m-1">
                    <StatusBadge type={AttendanceStatus.IN} isActive={isCurrentUserAttending} gameId={game.id}/>
                    <StatusBadge type={AttendanceStatus.OUT} isActive={!isCurrentUserAttending} gameId={game.id}/>
                    <StatusBadge type={AttendanceStatus.MAYBE} isActive={false} gameId={game.id}/>
                </div>}

                <ul className="list-none row-start-1 col-start-1 m-4 text-left text-sm">
                    {game.players.map(player =>
                        <li key={player.id}>
                            {userName && userName === player.name ? <b>{player.name}</b> : player.name}
                        </li>
                    )}
                </ul>

                <div className="row-start-2 col-start-1 col-end-3 flex justify-items-start gap-1 mt-2 text-sm m-1">
                    <span className="px-2 py-1 border rounded-lg">In: {game.players.length}</span>
                    <span className="px-2 py-1 border rounded-lg">Out: 10</span>
                </div>
            </div>

        </div>
    );
}