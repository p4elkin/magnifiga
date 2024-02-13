package fi.kumpula

import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured
import org.hamcrest.Matchers
import org.junit.jupiter.api.Test

@QuarkusTest
class GamesEndpointTest {

    @Test
    fun testHelloEndpoint() {
        RestAssured.given()
            .auth().basic("John@Doe.com", "hashed_password_1")
            .`when`()["/players/1"]
            .then()
            .statusCode(200)
            .body(Matchers.`is`("Hello from RESTEasy Reactive"))
    }
}