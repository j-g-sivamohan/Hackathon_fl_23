// Require the packages we will use:
const { time } = require("console");
const http = require("http"),
    fs = require("fs");
const port = 3456;
const file = "heat_map.html";
//CHANGE THIS BACK LATER!!!!

var mysql = require('mysql');


var con = mysql.createConnection({ 
    host: "localhost",
    user: "root",
    password: "root123",
    database: "heat_map"
  });

con.connect();





// Listen for HTTP connections.  This is essentially a miniature static file server that only serves our one file, client.html, on port 3456:
const server = http.createServer(function (req, res) {
    // This callback runs when a new connection is made to our HTTP server.

    fs.readFile(file, function (err, data) {
        // This callback runs when the client.html file has been read from the filesystem.

        if (err) return res.writeHead(500);
        res.writeHead(200);
        res.end(data);
        
    });
});
server.listen(port);

// Import Socket.IO and pass our HTTP server object to it.
const socketio = require("socket.io")(http, {
    wsEngine: 'ws'
});

// Attach our Socket.IO server to our HTTP server to listen
const io = socketio.listen(server);



io.sockets.on("connection", function (socket) {
    console.log(socket.id);

    // This callback runs when a new Socket.IO connection is established.


    socket.on('clicked', function (data) {
        // This callback runs when the server receives a new message from the client.
        console.log(data["xVal"] + ", " + data["yVal"]); // log it to the Node.JS output
    });

    socket.on('update_server', function (data) {
        // This callback runs when the server receives a new message from the client.

        var new_test = new Array;
        var new_nums = new Array;
        var hold = 0;
        var times = data["time"];
        var day = "\'" + data["day"] + "\'";
        var statement = "select num_students, Building from in_class where day_week = " + day + " and time_day = " + times;
        var statement2 = "select * from in_class";

        con.query(statement2, function(err, rows, fields) {
            if(err) console.log(err);
            console.log(rows);
        });

        con.query(statement, function(err, rows, fields) {
            if(err) console.log(err);
            for(var i = 0; i < 53; ++i){
                hold = rows[i].num_students;
                new_nums.push(hold + 1);
            }
            //console.log(new_nums);
            socket.emit('map_update', {nums:new_nums});
        });
    });

    socket.on('update_server_food', function (data) {
        // This callback runs when the server receives a new message from the client.

        var new_nums = new Array;
        var hold = 0;
        var times = data["time"];
        var day = "\'" + data["day"] + "\'";
        var statement = "select * from food_places where day_week = " + day + " and time_day = " + times;
        

        con.query(statement, function(err, rows, fields) {
            if(err) console.log(err);
            //console.log(rows);
            for(var i = 0; i < 8; ++i){
                hold = rows[i].popularity;
                new_nums.push(hold + 1);
            }
            //console.log(new_nums);
            socket.emit('food_map_update', {nums:new_nums});

        });
        
    });




    socket.on("disconnect", function() {
        console.log("DISCONNECTED: " + socket.id);

    })
});