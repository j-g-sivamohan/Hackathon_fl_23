
var svg = d3.select("#campus-map")
    .append("svg")
    .attr("viewBox", "0 0 887 257")
var grassGroup = svg.append("g").attr("class", "grass")
var parkingGroup = svg.append("g").attr("class", "parking")
var otherBuildingsGroup = svg.append("g").attr("class", "otherBuildings")
var classroomBuildingGroup = svg.append("g").attr("class", "classroomBuildings")


var Tooltip = d3.select("#tooltip")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

var myColor = d3.scaleSequential().domain([0, 250])
    .interpolator(d3.interpolateLab("blue", "red"));


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




        var mouseover = function (d) {
            Tooltip
                .style("opacity", 1)
        }

        var mousemove = function (d) {
            var currBuilding = d.target.__data__.id

            currDay = d3.select("#selected-day").property("value")
            currTime = d3.select("#time_range").property("value")

            Tooltip
                .html(function (d) {
                    var text = "Building: " + currBuilding + " " + currDay + ", " + currTime + "<hr>"
                    text += "Classes: <br>"
                    if (currClassArr.length == 0) {
                        text += "NONE"
                    }
                    else {
                        text += "<ul>";
                        currClassArr.forEach(function (c) {
                            if (c.building == currBuilding) {
                                text = text + "<li> name: " + c.class_name + ", Professor:" + c.proff + ", Enrolled:" + c.num + "</li>"
                            }
                        })
                        text += "</ul>";
                    }

                    return text;
                })
                .style("left", (d.screenX + 70) + "px")
                .style("top", (d.screenY) + "px")

            d3.select(this)
                .style("fill", "#CE4545")
        }


        var mouseleave = function (d) {
            Tooltip
                .style("opacity", 0)

            d3.select(this)
                .style("fill", function (d) {
                    totalStudents = 0
                    currClassArr.forEach(function (c) {

                        if (c.building == d.id) {
                            totalStudents += c.num
                        }
                    })


                    return myColor(totalStudents)
                })
        }


        classroomBuildingGroup.selectAll("path")
            .data(svgPaths.classroomBuildingPaths)
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
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

    })
}





