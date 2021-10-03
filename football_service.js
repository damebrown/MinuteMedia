const express = require('express');
const app = express();
const port = 8080
const upcoming = "upcoming"
const played = "played"

// app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send("football service express server is up")
})

app.get('/team', (req, res) => {
    const { q } = req.query;
    if (!q) { res.send("No data received") }
    console.log("team: ", q["t"]);
    let stat = q["s"]
    if (stat) {
        if ((stat == played) || (stat == upcoming)) {
            res.send(`GET /team/?t=${q["t"]}&s=${q["s"]} response`)
            console.log("stat is valid");
        }
        else {
            res.send("Error, unknown status.")
            console.log("stat is invalid");
        }
    }
    else {
        res.send(`GET /team/${q["t"]} response`)
    }
})


app.get('/tour', (req, res) => {
    const { q } = req.query;
    if (!q) { res.send("No data received") }
    console.log("tournament: ", q["t"]);
    let stat = q["s"]
    if (stat) {
        if ((stat == played) || (stat == upcoming)) {
            res.send(`GET /tour/?t=${q["t"]}&s=${q["s"]} response`)
            console.log("stat is valid");
        }
        else {
            res.send("Error, unknown status.")
            console.log("stat is invalid");
        }
    }
    else {
        res.send(`GET /tour/${q["t"]} response`)
    }
})


app.get('*', (req, res) => {
    res.send("Error, unknown path.")
})

app.listen(port, () => {
    console.log("ON PORT ", port);
})

