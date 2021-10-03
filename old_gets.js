// app.get('/team/:team', (req, res) => {
//     res.send(`GET /team/${req.params["team"]} response`)
//     console.log("team: ", req.params["team"]);
// })

// app.get('/team/:team/stat/:stat', (req, res) => {
//     console.log("team: ", req.params["team"]);
//     let stat = req.params["stat"]
//     if ((stat == played) || (stat == upcoming)) {
//         res.send(`GET /team/${req.params["team"]}/stat/${stat} response`)
//         console.log("stat is valid");
//     }
//     else {
//         res.send("Error, unknown status.")
//         console.log("stat is invalid");
//     }
//     console.log(stat);
// })

// app.get('/tour/:tour', (req, res) => {
//     res.send(`GET /tour/${req.params["tour"]} response`)
//     console.log("tour: ", req.params["tour"]);
// })

// app.get('/tour/:tour/stat/:stat', (req, res) => {
//     console.log("tour: ", req.params["tour"]);
//     let stat = req.params["stat"]
//     if ((stat == played) || (stat == upcoming)) {
//         res.send(`GET /tour/${req.params["tour"]}/stat/${stat} response`)
//         console.log("stat is valid");
//     }
//     else {
//         res.send("Error, unknown status.")
//         console.log("stat is invalid");
//     }
//     console.log("stat: ", stat);
// })

