package fi.kumpula;

import jakarta.enterprise.inject.Produces
import org.jooq.DSLContext


class AppConfiguration {

    @Produces
    fun gameService(jooq: DSLContext) = GameService(jooq)
}
