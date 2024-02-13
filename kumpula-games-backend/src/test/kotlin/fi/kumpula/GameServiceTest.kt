package fi.kumpula

import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.junit.jupiter.api.Test

@QuarkusTest
class GameServiceTest {

    @Inject
    lateinit var games: GameService

    @Test
    fun getGame() {
        val game: Game? = games.getGame(1)
    }


    @Test
    fun getPlayer() {
        val player: Player? = games.getPlayer("John Doe", "hashed_password_1")
    }
}