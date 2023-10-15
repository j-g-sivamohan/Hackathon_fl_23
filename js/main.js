var selectedDay = "M"
var selectedTime= 9


// displayMap()
loadData()

Object.defineProperty(window, 'data', {
	get: function () { return _data; },
	set: function (value) {
		_data = value;
		updateMap(data)
	}
});

function loadData() {
	d3.csv("data/indiv_classes.txt").then(function (csv) {
        csv.forEach(function (d) {
			d.time = +d.time;
			d.enrolled = +d.enrolled;
            d.waits = +d.waits;
		});

		data = csv;
	});

}

function setValues() {
    selectedDay = d3.select("#selected-day").property("value")
    selectedTime = d3.select("#time_range").property("value")
    console.log(selectedDay + " " + selectedTime)

    var filteredData = []

    data.forEach(function(d){
        if (d.day == selectedDay && d.time == selectedTime){
            filteredData.push(d)
        }
    })

    console.log(filteredData)

    // updateMap(filteredData)
}
console.log("hello")