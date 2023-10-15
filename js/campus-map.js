
var svg = d3.select("#campus-map")
    .append("svg")
    .attr("viewBox", "0 0 887 257")

var grassGroup = svg.append("g").attr("class", "grass")
var parkingGroup = svg.append("g").attr("class", "parking")
var otherBuildingsGroup = svg.append("g").attr("class", "otherBuildings")
var classroomBuildingGroup = svg.append("g").attr("class", "classroomBuildings")


var Tooltip = d3.select("#tooltip")
    // .style("opacity", 0)
    .attr("class", "tooltip")

var myColor = d3.scaleSequential().domain([0, 250])
    .interpolator(d3.interpolateLab("blue", "red"));


function convertDay(day, time) {
    var dString = ""
    if (day == "M") {
        dString = "Monday"
    }
    else if (day == "T") {
        dString = "Tuesday"
    }
    else if (day == "W") {
        dString = "Wednsday"
    }
    else if (day == "R") {
        dString = "Thursday"
    }
    else if (day == "F") {
        dString = "Friday"
    }

    var t = "";

    if (time > 12) {
        t = time - 12 + " pm"
    }
    else if (time == 12) {
        t = time + " pm"
    }
    else {
        t = time + " am"
    }

    return dString + ", " + t
}


function updateMap(classData, Day, Time) {

    d3.json("data/svgPaths.json").then(function (svgPaths) {
        var currDay = d3.select("#selected-day").property("value")
        var currTime = d3.select("#time_range").property("value")

        currClassArr = []
        classData.forEach(function (c) {
            if (c.day == currDay && c.time == currTime) {
                currClassArr.push(c)
            }
        })

        grassGroup.selectAll("path")
            .data(svgPaths.grassPaths)
            .enter()
            .append("path")
            .attr("d", function (d) { return d.d })
            .attr("class", "grass")
            .style("fill", "#8DB47C")


        parkingGroup.selectAll("path")
            .data(svgPaths.parkingPaths)
            .enter()
            .append("path")
            .attr("d", function (d) { return d.d })
            .attr("class", "parking")
            .style("fill", "#CED6DC")
            .style("stroke", "black")
            .style("stroke-width", 0.3)



        otherBuildingsGroup.selectAll("path")
            .data(svgPaths.otherBuildingPaths)
            .enter()
            .append("path")
            .attr("d", function (d) { return d.d })
            .attr("class", "otherBuildings")
            .style("fill", "gray")
            .style("stroke", "black")


        var mousemove = function (d) {
            var currBuilding = d.target.__data__.id

            currDay = d3.select("#selected-day").property("value")
            currTime = d3.select("#time_range").property("value")
            var empty = true

            Tooltip
                .html(function (d) {
                    totalStudents = 0
                    currClassArr.forEach(function (c) {
                        if (c.building == currBuilding) {
                            totalStudents += c.num
                        }
                    })

                    var text = "<div class='buildingText'>" + currBuilding + "</div>"
                    text += "<div class='subtext'>" + convertDay(currDay, currTime) + "</div>"
                    text += "<div class='subtext'>Total est. students in building: " + totalStudents + "</div><hr>"
                    if (currClassArr.length == 0) {
                        text += "NONE"
                    }
                    else {
                        text += "<ul>";
                        currClassArr.forEach(function (c) {
                            if (c.building == currBuilding) {
                                empty = false;
                                text = text + "<li><b>" + c.class_name + "</b><br>"
                                text = text + "<ul><li><b>Professor: </b>" + c.proff + "</li>"
                                text = text + "<li><b>Enrolled: </b>" + c.num + "</li>"
                                text = text + "<li><b>Room: </b>" + c.classNum + "</li>"
                                text = text + "</ul></li>"
                            }
                        })
                        if (empty) {
                            text += "<b>NO CLASSES AT THIS TIME</b>"
                        }
                        text += "</ul>";
                    }
                    return text;
                })
                .style("left", (d.screenX + 70) + "px")
                .style("top", (d.screenY) + "px")
                .style("opacity", 1)
        }

        var paths = classroomBuildingGroup.selectAll("path")
            .data(svgPaths.classroomBuildingPaths, function (d) { return d })
        paths
            .enter()
            .append("path")
            .attr("d", function (d) { return d.d })
            .attr("class", function (d) { return d.id })
            .style("fill", function (d) {
                totalStudents = 0
                currClassArr.forEach(function (c) {
                    if (c.building == d.id) {
                        totalStudents += c.num
                    }
                })

                return myColor(totalStudents)
            })
            .style("stroke", "black")
            .on("click", mousemove)

        paths.exit().remove()
    })
}





