package fi.kumpula

import com.fasterxml.jackson.annotation.JsonProperty
import io.smallrye.jwt.build.Jwt
import jakarta.annotation.security.RolesAllowed
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.jwt.Claims
import org.eclipse.microprofile.jwt.JsonWebToken

data class LoginParams(

    @field:JsonProperty("email")
    val email: String? = null,

    @field:JsonProperty("password")
    val password: String? = null)

data class PlayerInfoUpdatePayload(
    @field:JsonProperty("playerId")
    val playerId: Int? = null,

    @field:JsonProperty("name")
    val name: String? = null)

@Path("/players")
class PlayersEndpoint @Inject constructor(private val gameService: GameService) {

    @Inject
    lateinit var jwt: JsonWebToken

    @GET
    @Path("/{id}")
    @RolesAllowed("regular", "guest")
    @Produces(MediaType.APPLICATION_JSON)
    fun player(@PathParam("id") id: Int): Player? =
        gameService.getPlayerById(id)


    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    fun authenticatePlayer(loginParams: LoginParams): Response {
        return gameService.getPlayer(loginParams.email!!, loginParams.password!!)?.let {
            Response
                .ok(issueJWT(it))
                .build()
        } ?: Response
            .status(401)
            .build()
    }

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    fun registerPlayer(loginParams: LoginParams): Response {
        return gameService.register(loginParams.email!!, loginParams.password!!)?.let {
            Response
                .ok(issueJWT(it))
                .build()
        } ?: Response
            .status(400)
            .build()
    }

    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    fun updatePlayer(form: PlayerInfoUpdatePayload): Response {
        return if (gameService.setPlayerName(form.playerId!!, form.name!!)) {
            Response
                .ok()
                .build()
        } else Response
            .status(400)
            .build()
    }

    private fun issueJWT(player: Player): String {
        return Jwt.issuer("https://example.com/issuer")
            .upn(player.id.toString())
            .claim(Claims.full_name, player.name)
            .claim(Claims.email.name, player.email)
            .sign();
    }
}
