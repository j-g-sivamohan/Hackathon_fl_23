

function callQuery() {
    console.log("getting query of ")
    selectedDay = d3.select("#selected-day").property("value")
    selectedTime = d3.select("#time_range").property("value")
    var new_nums = new Array;
    var hold = 0;
    console.log(selectedTime)
    var statement = "select * from food_places"; //where in_class = " + day + " and time_day = " + ti;

    var ans = []

    con.query(statement, function (err, rows, fields) {
        if (err) console.log(err);
        console.log(rows);
        ans = rows;
    });

    
// console.log(ans)
//     updateMap(ans)
}