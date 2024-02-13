package fi.kumpula

import fi.kumpula.domain.tables.Attendances.ATTENDANCES
import fi.kumpula.domain.tables.Games.GAMES
import fi.kumpula.domain.tables.Players.PLAYERS
import jakarta.inject.Inject
import org.jooq.DSLContext
import org.jooq.exception.IntegrityConstraintViolationException
import org.jooq.impl.DSL.multiset
import java.time.LocalDate

class GameService @Inject constructor(private val jooq: DSLContext) {

    private val gamesWithPlayers get() = run {
        jooq.select(
            GAMES.ID.`as`("id"),
            GAMES.DATE.`as`("date"),
            multiset(playersOfAGame)
                .`as`("players")
                .convertFrom { it.map { it.value1() } })
            .from(GAMES)
    }

    private val playersOfAGame get() = run { jooq.select(
        PLAYERS.convertFrom { Player(it.id, it.name, it.email) })
        .from(PLAYERS, ATTENDANCES)
        .where(
            PLAYERS.ID
                .eq(ATTENDANCES.PLAYER_ID)
                .and(ATTENDANCES.GAME_ID.eq(GAMES.ID))
        )
    }

    fun fetchGamesSince(since: LocalDate, amount: Int): List<Game> {
        val games = gamesWithPlayers
            .where(GAMES.DATE.gt(since))
            .limit(amount)
            .fetchInto(Game::class.java)

        return if (games.size < amount) {
            appendGames()
            fetchGamesSince(since, amount)
        } else games
    }

    fun getGame(gameId: Int): Game? {
        return this.gamesWithPlayers.where(GAMES.ID.eq(gameId))
            .fetchOneInto(Game::class.java)
    }

    fun getPlayerById(id: Int): Player? {
        return jooq.select(PLAYERS.ID, PLAYERS.NAME)
            .from(PLAYERS)
            .where(
                PLAYERS.ID.eq(id))
            .fetchOneInto(Player::class.java)
    }

    fun getPlayer(email: String, password: String): Player? {
       return jooq.select(PLAYERS)
           .from(PLAYERS)
           .where(
               PLAYERS.EMAIL.eq(email).and(
                   PLAYERS.PASSWORD.eq(password)))
           .fetchOneInto(Player::class.java)
    }

    fun addPlayerToGame(playerId: Int, gameId: Int) =
        try {
            jooq.insertInto(ATTENDANCES)
                .columns(ATTENDANCES.GAME_ID, ATTENDANCES.PLAYER_ID)
                .values(gameId, playerId)
                .execute()
        } catch (e: IntegrityConstraintViolationException) {
            // user's already in the game, do nothing
        }

    private fun appendGames(amount: Int = 200) {
        val lastGame: LocalDate = jooq
            .select(GAMES.DATE).from(GAMES)
            .orderBy(GAMES.ID.desc())
            .limit(1)
            .map { it.value1() }
            .firstOrNull() ?: LocalDate.now().minusDays(1)

        jooq.transaction { tx ->
            generateNextGameDates(lastGame, amount).forEach {
                tx.dsl().insertInto(GAMES).columns(GAMES.DATE).values(it).execute()
            }
        }
    }

    fun removePlayerFromGame(playerId: Int, gameId: Int) =
        jooq.deleteFrom(ATTENDANCES)
            .where(ATTENDANCES.GAME_ID.eq(gameId))
                .and(ATTENDANCES.PLAYER_ID.eq(playerId))
            .execute()

    fun markPlayerStatusUnknownForGame(playerId: Int, gameId: Int) {
        TODO("Not yet implemented")
    }

    fun getGameRoster(gameId: Int): List<Player> {
        return listOf()
    }

    fun register(userName: String, password: String): Player? {
        return jooq.transactionResult { tx ->
            val exists = tx.dsl().selectOne()
                .from(PLAYERS)
                .where(PLAYERS.EMAIL.eq(userName))
                .fetchOne(0, Int::class.java) != null

            if (!exists) {
                val id = tx.dsl().insertInto(PLAYERS)
                    .columns(PLAYERS.EMAIL, PLAYERS.PASSWORD, PLAYERS.NAME, PLAYERS.ROLE, PLAYERS.PAYMENT_STATUS)
                    .values(userName, password, "", "regular", "paid")
                    .returning(PLAYERS.ID).fetchOne(0, Int::class.java)!!

                Player(id, "", userName)
            } else null
        }
    }

    fun setPlayerName(playerId: Int, name: String): Boolean {
        return jooq.transactionResult { tx ->
            val exists = tx.dsl().selectOne()
                .from(PLAYERS)
                .where(PLAYERS.ID.eq(playerId))
                .fetchOne(0, Int::class.java) != null

            if (exists) {
                tx.dsl().update(PLAYERS)
                    .set(hashMapOf(PLAYERS.NAME to name))
                    .where(PLAYERS.ID.eq(playerId))
                    .execute()

                true
            } else false
        }
    }
}
