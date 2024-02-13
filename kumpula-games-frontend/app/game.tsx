import type {Player} from "~/player";

export interface Game {
    id: number;
    date: string;
    dayOfWeek: string;
    players: Player[];
}