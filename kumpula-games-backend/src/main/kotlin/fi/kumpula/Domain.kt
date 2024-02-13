package fi.kumpula

data class Game(val id: Int, val date: String, val players: List<Player>)

data class Player(val id: Int, val name: String, val email: String)
