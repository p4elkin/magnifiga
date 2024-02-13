import {Form} from "@remix-run/react";

export enum AttendanceStatus {
    IN = "in",
    OUT = "out",
    MAYBE = "maybe",
}

export const StatusBadge = ({type, isActive, gameId}: { type: AttendanceStatus, isActive: boolean, gameId: number }) => {

    const colorStyling: { [key in AttendanceStatus]: string } = {
        [AttendanceStatus.IN]: 'border-green-300 text-green font-bold',
        [AttendanceStatus.OUT]: 'border-red-400 text-red font-bold',
        [AttendanceStatus.MAYBE]: 'border-grey-400 text-grey'
    };

    const caption: { [key in AttendanceStatus]: string } = {
        [AttendanceStatus.IN]: "I'm in",
        [AttendanceStatus.OUT]: "I'm out",
        [AttendanceStatus.MAYBE]: "Maybe"
    };

    const attendanceBadgeStyles = `
          h-5
          w-14
          border
          rounded-lg
          text-sm/[0.25rem] ${isActive ? colorStyling[type] : colorStyling["maybe"]}]`;

    return (<Form className="absolute grid place-items-center right-0 self-start" method="post" action="/games">
        <input type="hidden" name="gameId" value={gameId}></input>
        <button name="_action" value={type} type="submit" className={attendanceBadgeStyles}>{caption[type]}</button>
    </Form>)
}