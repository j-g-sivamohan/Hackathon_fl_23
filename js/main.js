var selectedDay = "M"
var selectedTime= 9

function setValues() {
    selectedDay = d3.select("#selected-day").property("value")
    selectedTime = d3.select("#time_range").property("value")
    console.log(selectedDay + " " + selectedTime)

    callQuery(selectedDay, selectedTime)
}
