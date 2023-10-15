
var svg = d3.select("#campus-map")
    .append("svg")
    .attr("viewBox", "0 0 887 257")


d3.json("data/svgPaths.json").then(function (svgPaths) {
    console.log(svgPaths)

    var grassGroup = svg.append("g").attr("class", "grass")
    grassGroup.selectAll("path")
        .data(svgPaths.grassPaths)
        .enter()
        .append("path")
        .attr("d", function (d) { return d.d })
        .attr("class", "grass")
        .style("fill", "#2B790F")

    var parkingGroup = svg.append("g").attr("class", "parking")
    parkingGroup.selectAll("path")
        .data(svgPaths.parkingPaths)
        .enter()
        .append("path")
        .attr("d", function (d) { return d.d })
        .attr("class", "parking")
        .style("fill", "#C9A8FF")
        .style("stroke", "black")


    var otherBuildingsGroup = svg.append("g").attr("class", "otherBuildings")
    otherBuildingsGroup.selectAll("path")
        .data(svgPaths.otherBuildingPaths)
        .enter()
        .append("path")
        .attr("d", function (d) { return d.d })
        .attr("class", "otherBuildings")
        .style("fill", "#CE4545")
        .style("stroke", "black")

    var classroomBuildingGroup = svg.append("g").attr("class", "classroomBuildings")
    classroomBuildingGroup.selectAll("path")
        .data(svgPaths.classroomBuildingPaths)
        .enter()
        .append("path")
        .attr("d", function (d) { return d.d })
        .attr("class", function (d) { return d.id })
        .style("fill", "#CE4545")
        .style("stroke", "black")
        .style("fillrule", function(d) {return d.fillrule})
})


function updateMap(data){
    console.log("update map")
    console.log(data)
}




