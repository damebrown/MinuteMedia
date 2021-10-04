/**** Requires ****/

const MongoClient = require('mongodb').MongoClient;
const express = require('express');

/**** Global Variables ****/

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const app = express();
const port = 8080
const upcoming = "upcoming"
const played = "played"

/**** Functions ****/

function get_handler(q, res, find_query) {
    /**
     * This function handles all the GETters logic. 
     * It recieves q, which equals to req.query, 
     * res (the response object of the call) 
     * and find_query, a pattern used in the db.collections.find() function.
     * It sends back the data in json format as the response body (res.send).
     */
    if (!q) { res.send("No data received") }
    let state = q["s"]
    client.connect(() => {
        console.log("Connected")
        const db = client.db("footballMatches");
        if (state) {
            if ((!(state === upcoming)) && (!(state === played))) {
                console.log("state is invalid");
                res.send("Error, unknown state.");
                return;
            }
            console.log("state is valid");
            col = (state === played) ? db.collection(played) : db.collection(upcoming);
            col.find(find_query).toArray(function (err, result) {
                // console.log("state: ", state, "'s result are ", result.length);
                res.send(result);
                return;
            })
        }
        else {
            var query_results = []
            db.collection(upcoming).find(find_query).toArray(function (err, result) {
                for (const r of result) {
                    query_results.push(r);
                }
            })
            db.collection(played).find(find_query).toArray(function (err, result) {
                for (const r of result) {
                    query_results.push(r);
                }
                // console.log("no state: ", query_results.length);
                res.send(query_results)
            })
        }
    })
}

app.get('/', (req, res) => {
    /**
     * This function functions as a sanity check.
     * If someone connected to the server, it will send a message saying all is alright.
     */
    res.send("football service express server is up")
})

app.get('/get_matches/team', (req, res) => {
    /**
     * The getter for the get matches by team (w/o state).
     */
    const q = req.query;
    let find_query = { $or: [{ "home team.team": q["t"] }, { "away team.team": q["t"] }] }
    get_handler(q, res, find_query)
})


app.get('/get_matches/tournament', (req, res) => {
    /**
     * The getter for the get matches by tournament (w/o state).
     */
    const q = req.query;
    let find_query = { "tournament.tournament": q["t"] }
    get_handler(q, res, find_query)
})


app.get('*', (req, res) => {
    /**
     * Default getter. 
     * If any other path other than the known ones has been typed, it will send an error message.
     */
    res.send("Error, unknown path.")
})

app.listen(port, () => {
    console.log("ON PORT ", port);
})

