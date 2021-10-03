
const MongoClient = require('mongodb').MongoClient;
//todo get the port number from the football_service.js
const url = "mongodb://localhost:8080"

var tour_dict = {}
var teams_dict = {}

//for match in played:
//  if team or tour is unknown, add it to dicts
//  create played_match .json object
//  write it to played_match db

//same for each match in upcoming