var selectedDay = "M"
var selectedTime= 9

const { time } = require("console");
const http = require("http"),
    fs = require("fs");
const port = 8000;
const file = "heat_map.html";
//CHANGE THIS BACK LATER!!!!

var mysql = require('mysql');

console.log("hello")
var con = mysql.createConnection({ 
    host: "localhost",
    user: "root",
    password: "root123",
    database: "heat_map"
  });

con.connect();

function setValues() {
    selectedDay = d3.select("#selected-day").property("value")
    selectedTime = d3.select("#time_range").property("value")
    console.log(selectedDay + " " + selectedTime)

    callQuery(selectedDay, selectedTime)
}
console.log("hello")