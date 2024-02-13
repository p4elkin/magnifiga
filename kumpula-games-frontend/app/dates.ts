import {format, isThisWeek, subWeeks} from 'date-fns';

export function formatGameDate(date: Date) {

    if (isThisWeek(date, { weekStartsOn: 1 })) {
        return format(date, `'This' EEEE`);
    } else if (isNextWeek(date)) {
        return format(date, "'Next' EEEE");
    }

    return format(date, 'E, MMMM d');
}

function isNextWeek(date: Date): boolean {
    return isThisWeek(subWeeks(date, 1));
}
