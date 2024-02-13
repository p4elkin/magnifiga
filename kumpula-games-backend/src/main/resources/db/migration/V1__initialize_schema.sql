CREATE TABLE Players (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     email TEXT NOT NULL UNIQUE,
     name TEXT NOT NULL,
     password TEXT NOT NULL,
     avatar BLOB,
     role TEXT CHECK(role IN ('regular', 'guest')) NOT NULL,
     payment_status TEXT CHECK(payment_status IN ('paid', 'unpaid')) NOT NULL
);

CREATE TABLE Games (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   date DATE NOT NULL,
   status TEXT CHECK(status IN ('scheduled', 'cancelled')) DEFAULT 'scheduled' NOT NULL
);

CREATE TABLE Attendances (
     game_id INTEGER,
     player_id INTEGER,
     status text check(status in ('in', 'out', 'maybe')),
     FOREIGN KEY (game_id) REFERENCES Games(id),
     FOREIGN KEY (player_id) REFERENCES Players(id),
     UNIQUE (game_id, player_id)
);

CREATE TABLE GuestQueue (
    game_id INTEGER,
    player_id INTEGER,
    FOREIGN KEY (game_id) REFERENCES Games(id),
    FOREIGN KEY (player_id) REFERENCES Players(id),
    UNIQUE (game_id, player_id)
);
