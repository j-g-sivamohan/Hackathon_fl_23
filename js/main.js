var selectedDay = "M"
var selectedTime= 9


// displayMap()
loadData()

Object.defineProperty(window, 'data', {
	get: function () { return _data; },
	set: function (value) {
		_data = value;
		updateMap(data, selectedDay, selectedTime)
	}
});

function loadData() {
	d3.csv("data/classesFilled.csv").then(function (csv) {
        csv.forEach(function (d) {
			d.time = +d.time;
			d.num = +d.num;
            d.waits = +d.waits
            d.friends = +d.friends
		});

		data = csv;
        console.log(data)
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

    // console.log(filteredData)

    updateMap(filteredData, selectedDay, selectedTime)
}