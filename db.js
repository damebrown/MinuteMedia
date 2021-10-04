
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const csv = require('csv-parser');
const fs = require('fs');
const played_path = 'result_played.csv'
const upcoming_path = 'result_upcoming.csv'
const data_paths = [played_path, upcoming_path]

var tour_dict = {};
var teams_dict = {};
var tour_count = 0;
var teams_count = 0;

function get_tour_id(tour) {
    if (!(tour in tour_dict)) {
        tour_count += 1;
        tour_dict[tour] = tour_count;
    }
    return tour_dict[tour];
}

function get_team_id(team) {
    if (!(team in teams_dict)) {
        teams_count++;
        teams_dict[team] = teams_count;
    }
    if (teams_count > 103) {
        console.log(teams_dict);
    }
    return teams_dict[team]
}

function prase_row(row, path) {
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
                    // console.log("there are ", teams_count, " teams");
                    // console.log("there are ", tour_count, " tournaments");
                });
        }
    }
    else {
        console.log("an error occured")
    }
})
