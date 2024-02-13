package fi.kumpula

import java.time.DayOfWeek
import java.time.DayOfWeek.FRIDAY
import java.time.DayOfWeek.WEDNESDAY
import java.time.LocalDate

fun generateNextGameDates(lastGame: LocalDate, amount: Int) = sequence {
    var current = lastGame

    repeat(amount) {
        nextWednesdayOrFriday(current).let {
            yield(it)
            current = it
        }
    }
}

fun nextWednesdayOrFriday(since: LocalDate): LocalDate {
    val wednesdayShift = nextShiftDate(since, WEDNESDAY)
    val fridayShift = nextShiftDate(since, FRIDAY)

    return if (wednesdayShift.isBefore(fridayShift)) wednesdayShift else fridayShift
}

fun nextShiftDate(date: LocalDate, dayOfWeek: DayOfWeek): LocalDate {
    val daysUntil = (dayOfWeek.value - date.dayOfWeek.value).toLong().let {
        if (it > 0) it else 7L + it
    }
    return date.plusDays(daysUntil)
}
