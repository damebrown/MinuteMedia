/**** Requires ****/

const csv = require('csv-parser');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

/**** Global Variables ****/

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const played_path = 'result_played.csv'
const upcoming_path = 'result_upcoming.csv'
const data_paths = [played_path, upcoming_path]
var tour_dict = {};
var teams_dict = {};
var tour_count = 0;
var teams_count = 0;

/**** Functions ****/

function get_tour_id(tour) {
    /**
     * This function checks if the received tournament, tour, exists. 
     * If it does it returns it's id, else it creates an id for it, saves it and returns it.
     */
    if (!(tour in tour_dict)) {
        tour_count += 1;
        tour_dict[tour] = tour_count;
    }
    return tour_dict[tour];
}

function get_team_id(team) {
    /**
     * This function checks if the received team, team, exists.
     * If it does it returns it's id, else it creates an id for it, saves it and returns it.
     */
    if (!(team in teams_dict)) {
        teams_count++;
        teams_dict[team] = teams_count;
    }
    return teams_dict[team]
}

function prase_row(row, path) {
    /**
     * This function creates the suitable Match object according to the state of the match- upcoming or played.
     * It returns the Match object in json format.
     */
    let home_team = { "team": row["home_team"], "id": get_team_id(row["home_team"]) }
    let away_team = { "team": row["away_team"], "id": get_team_id(row["away_team"]) }
    let tour = { "tournament": row["tournament"], "id": get_tour_id(row["tournament"]) }
    let match = {
        "home team": home_team,
        "away team": away_team,
        "start date": row["start_time"],
        "tournament": tour
    }
    if (path === played_path) {
        match["score"] = { "home_score": row["home_score"], "away_score": row["away_score"] }
    }
    else if (path === upcoming_path) {
        match["kickoff time"] = row["kickoff"]
    }
    return match
}

client.connect((err) => {
    /**
     * This function parses the recieved .csv files and creates a db of the respective Match objects.
     */
    console.log("Connected")
    if (!err) {
        const db = client.db("footballMatches");
        db.createCollection("played").catch(err => console.log(err["codeName"]))
        db.createCollection("upcoming").catch(err => console.log(err["codeName"]))
        for (const path of data_paths) {
            fs.createReadStream(path)
                .pipe(csv())
                .on('data', (row) => {
                    let match_obj = prase_row(row, path);
                    if (path === played_path) {
                        db.collection('played').insertOne(match_obj)
                    }
                    else if (path === upcoming_path) {
                        db.collection('upcoming').insertOne(match_obj)
                    }
                })
                .on('end', () => {
                    console.log(path + ' file successfully processed');
                });
        }
    }
    else {
        console.log("an error occured")
    }
})
