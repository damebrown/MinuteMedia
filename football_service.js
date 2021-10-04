const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const express = require('express');
const app = express();
const port = 8080
const upcoming = "upcoming"
const played = "played"
// const valid_stats = [upcoming, played]

function get_handler(q, res, find_query) {
    console.log(q);
    if (!q) { res.send("No data received") }
    let state = q["s"]
    client.connect(() => {
        console.log("Connected")
        const db = client.db("footballMatches");
        if (state) {
            if ((!(state === upcoming)) && (!(state === played))) {
                console.log("state is invalid");
                res.send("Error, unknown state.");
            }
            console.log("state is valid");
            col = (state === played) ? db.collection('played') : db.collection('upcoming');
            col.find(find_query).toArray(function (err, result) {
                console.log("result.length is ", result.length);
                res.send(result);
            })
        }
        else {
            var query_results = []
            db.collection('played').find(find_query).toArray(function (err, result) {
                for (const r of result) {
                    query_results.push(r);
                }
            })
            db.collection('upcoming').find(find_query).toArray(function (err, result) {
                for (const r of result) {
                    query_results.push(r);
                }
                console.log("query_results.length is ", query_results.length);
                res.send(query_results)
            })
        }
    })
}

app.get('/', (req, res) => {
    res.send("football service express server is up")
})

app.get('/get_matches/team', (req, res) => {
    const q = req.query;
    // console.log(q);
    if (!q) { res.send("No data received") }
    // let state = q["s"]
    // client.connect(() => {
    // console.log("team call Connected")
    // const db = client.db("footballMatches");
    let team = q["t"];
    let find_query = { $or: [{ "home team.team": team }, { "away team.team": team }] }
    get_handler(q, res, find_query)
    // if (state) {
    //     if ((!(state === upcoming)) && (!(state === played))) {
    //         console.log("state is invalid");
    //         res.send("Error, unknown state.");
    //     }
    //     console.log("state is valid");
    //     col = (state === played) ? db.collection('played') : db.collection('upcoming');
    //     col.find(find_query).toArray(function (err, result) {
    //         console.log("result.length is ", result.length);
    //         res.send(result);
    //     })
    // }
    // else {
    //     var query_results = []
    //     db.collection('played').find(find_query).toArray(function (err, result) {
    //         for (const r of result) {
    //             query_results.push(r);
    //         }
    //     })
    //     db.collection('upcoming').find(find_query).toArray(function (err, result) {
    //         for (const r of result) {
    //             query_results.push(r);
    //         }
    //         console.log("query_results.length is ", query_results.length);
    //         res.send(query_results)
    //     })
    // }

    // })
})


app.get('/get_matches/tour', (req, res) => {
    const q = req.query;
    // console.log(q);
    if (!q) { res.send("No data received") }
    // let state = q["s"]
    // client.connect(() => {
    // console.log("tour call Connected")
    // const db = client.db("footballMatches");
    // let tour = q["t"];
    let find_query = { "tournament.tournament": q["t"] }
    get_handler(q, res, find_query)
    // if (state) {
    //     if ((!(state === upcoming)) && (!(state === played))) {
    //         console.log("state is invalid");
    //         res.send("Error, unknown state.");
    //     }
    //     console.log("state is valid");
    //     col = (state === played) ? db.collection('played') : db.collection('upcoming');
    //     col.find(find_query).toArray(function (err, result) {
    //         console.log("result.length is ", result.length);
    //         res.send(result);
    //     })
    // }
    // else {
    //     var query_results = []
    //     db.collection('played').find(find_query).toArray(function (err, result) {
    //         for (const r of result) {
    //             query_results.push(r);
    //         }
    //     })
    //     db.collection('upcoming').find(find_query).toArray(function (err, result) {
    //         for (const r of result) {
    //             query_results.push(r);
    //         }
    //         console.log("query_results.length is ", query_results.length);
    //         res.send(query_results)
    //     })
    // }
    // })
})


app.get('*', (req, res) => {
    res.send("Error, unknown path.")
})

app.listen(port, () => {
    console.log("ON PORT ", port);
})

