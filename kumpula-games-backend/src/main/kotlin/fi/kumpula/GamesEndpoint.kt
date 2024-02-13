package fi.kumpula

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import java.time.LocalDate

data class PlayerStatus(
    @field:JsonProperty("playerId")
    val playerId: Int? = null,

    @field:JsonProperty("status")
    val status: String? = null)

@Path("/games")
class GamesEndpoint @Inject constructor(private val gameService: GameService) {

    @Path("{/{id}/roster}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun getGameRoster(@PathParam("id") gameId: Int): List<Player> {
        return gameService.getGameRoster(gameId)
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun games(@QueryParam("since") sinceUnixTimeSeconds: Long, @QueryParam("amount") amount: Int): List<Game> {
        return gameService.fetchGamesSince(LocalDate.ofEpochDay(sinceUnixTimeSeconds / (60 * 60 * 24)), amount)
    }

    @POST
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    fun updatePlayerStatus(@PathParam("id") gameId: Int, status: PlayerStatus) {
        when (status.status) {
            "in" -> this.gameService.addPlayerToGame(status.playerId!!, gameId)
            "out" -> this.gameService.removePlayerFromGame(status.playerId!!, gameId)
            else -> this.gameService.markPlayerStatusUnknownForGame(status.playerId!!, gameId)
        }
    }
}
