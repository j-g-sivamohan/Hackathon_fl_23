
var svg = d3.select("#campus-map")
    .append("svg")
    .attr("viewBox", "0 0 887 257")
var grassGroup = svg.append("g").attr("class", "grass")
var parkingGroup = svg.append("g").attr("class", "parking")
var otherBuildingsGroup = svg.append("g").attr("class", "otherBuildings")
var classroomBuildingGroup = svg.append("g").attr("class", "classroomBuildings")

function tooltip_render(tooltip_data) {
    console.log("tooltiip")
    var text = "<h2 class = class-text" + tooltip_data.state + "</h2>";
    text += "Electoral Votes: " + tooltip_data.electoralVotes;
    text += "<ul>"
    tooltip_data.result.forEach(function (row) {
        text += "<li class = class-list>" + row.name + ":\t\t" + row.students + "(" + row.day + "%)" + row.time + "</li>"
    });
    text += "</ul>";
    return text;
}


function updateMap(classData) {
    d3.json("data/svgPaths.json").then(function (svgPaths) {

        console.log(svgPaths)

        grassGroup.selectAll("path")
            .data(svgPaths.grassPaths)
            .enter()
            .append("path")
            .attr("d", function (d) { return d.d })
            .attr("class", "grass")
            .style("fill", "#2B790F")


        parkingGroup.selectAll("path")
            .data(svgPaths.parkingPaths)
            .enter()
            .append("path")
            .attr("d", function (d) { return d.d })
            .attr("class", "parking")
            .style("fill", "#C9A8FF")
            .style("stroke", "black")



        otherBuildingsGroup.selectAll("path")
            .data(svgPaths.otherBuildingPaths)
            .enter()
            .append("path")
            .attr("d", function (d) { return d.d })
            .attr("class", "otherBuildings")
            .style("fill", "#FF7675")
            .style("stroke", "black")


        var Tooltip = d3.select("#tooltip")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        var mouseover = function (d) {
            Tooltip
                .style("opacity", 1)
            // d3.select(this)
            //     .style("stroke", "black")
            //     .style("opacity", 1)
        }
        var mousemove = function (d) {
            Tooltip
                .html(function (d) {
                    currClassArr = []
                    classData.forEach(function (c) {
                        if (c.building == d.building) {
                            //   text = text + "name: " + 3
                            currClassArr.push(c)
                        }
                    })


                    var text = "Building: " + d.building + "<hr>"
                    text += "Classes: <br>"
                    text += "<ul>";
                    currClassArr.forEach(function (c) {
                        if (c.building == d.building) {
                            text = text + "<li> name: " + c.name + ", Professor: " + c.professor + ", Enrolled: " + c.enrolled + "</li>"
                        }
                    })
                    text += "</ul>";
                    return text;
                })
        }
        var mouseleave = function (d) {
            Tooltip
                .style("opacity", 0)
            // d3.select(this)
            //     .style("stroke", "none")
            //     .style("opacity", 0.8)
        }


        classroomBuildingGroup.selectAll("path")
            .data(svgPaths.classroomBuildingPaths)
            .enter()
            .append("path")
            .attr("d", function (d) { return d.d })
            .attr("class", function (d) { return d.id })
            .style("fill", "#FF7675")
            .style("stroke", "black")
            .style("fillrule", function (d) { return d.fillrule })
            .on("mouseover", function (d) {
                d3.select(this)
                    .style("fill", "#CE4545")
                console.log(this)
            })
            .on("mouseout", function () {
                d3.select(this)
                    .style("fill", "#FF7675")
            })
        // .on("mousemove", mousemove)
        // .on("mouseleave", mouseleave)

    })
}

// function updateMap(data) {
//     console.log("asd")
//     console.log(data)


//     classroomBuildingGroup.selectAll("path")
//         .data(svgPaths.classroomBuildingPaths)
//         .enter()
//         .append("path")
//         .attr("d", function (d) { return d.d })
//         .attr("class", function (d) { return d.id })
//         .style("fill", "#CE4545")
//         .style("stroke", "black")
//         .style("fillrule", function (d) { return d.fillrule })

// }




