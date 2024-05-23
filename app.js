const express = require("express");
const app = express();
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const { open } = sqlite;
const dbPath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server is running at http://localhost:3000/`);
    });
  } catch (err) {
    console.log(`DB Error: ${err.message}`);
  }
};

initializeDBAndServer();

//GET players api

app.get("/players/", async (request, response) => {
  let getPlayersQuery = `select * from cricket_team;`;
  let playerList = await db.all(getPlayersQuery);
  response.send(playerList);
  //   console.log(playerList);
});

// Post Api

app.post("/players", async (request, response) => {
  let { playerName, jerseyNumber, role } = request.body;
  let createPlayerQuery = `insert into cricket_team (player_name,jersey_number,role) values('${playerName}',${jerseyNumber},'${role}')`;
  const res = await db.run(createPlayerQuery);
  response.send("Player Added to Team");
  console.log(res.lastID);
});

// GET Player API

app.get("/player/:playerId", async (request, response) => {
  let { playerId } = request.params;
  const getPlayerQuery = `select * from cricket_team where player_id=${playerId}`;
  const res = await db.get(getPlayerQuery);
  response.send(res);
});
