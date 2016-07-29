var input = {
    "Item": {
        "entities": {
            "S": "[{\"type\":\"Person\",\"text\":\"Elon Musk\",\"relevance\":\"0.80222\",\"count\":\"3\",\"Relevance\":\"0.80222\"},{\"type\":\"Company\",\"text\":\"Tesla\",\"relevance\":\"0.438313\",\"count\":\"1\",\"Relevance\":\"0.438313\"},{\"type\":\"Technology\",\"text\":\"Autopilot\",\"relevance\":\"0.493184\",\"count\":\"1\",\"Relevance\":\"0.80222\"},{\"type\":\"FieldTerminology\",\"text\":\"sports car\",\"relevance\":\"0.40922\",\"count\":\"5\",\"Relevance\":\"0.80222\"},{\"type\":\"FieldTerminology\",\"text\":\"lithium ion battery\",\"relevance\":\"0.60137\",\"count\":\"2\",\"Relevance\":\"0.80222\"},{\"type\":\"Person\",\"text\":\"Nikola Tesla\",\"relevance\":\"0.3013\",\"count\":\"1\",\"Relevance\":\"0.80222\"}]"
        },
        "conference-uuid": {
            "S": "25236C0C-6ADD-437E-B128-2053C493E4A5"
        }
    }
};




var entities = JSON.parse(input.Item.entities.S);
console.log(JSON.stringify(entities, null, "\t"));

/*
var length = entities.length;

var data = [];

console.log(JSON.stringify(entities, null, "\t"));


for (var i = 0; i < length; i++) {
  var current = [parseFloat(entities[i].relevance), parseInt(entities[i].count), entities[i].text];
  //console.log( JSON.stringify(current));
  data.push(current);
}
console.log( JSON.stringify(data, null, "\t"));
*/

var w = 1100,
    h = 600,
    pad = 100,
    left_pad = 150;

//Add the empty svg element to the DOM
var svg = d3.select("#scatterplot")
    .append("svg")
    .attr("width", w)
    .attr("height", h);



var xScale = d3.scaleLinear().domain([0, d3.max(entities, function(d) {
    return parseFloat(d.relevance) + 0.2;
})]).range([left_pad, w - pad])

var yScale = d3.scaleLinear().domain([0, d3.max(entities, function(d) {
    return parseInt(d.count) + 2;
})]).range([pad, h - pad * 2]);


//var xAxis = d3.svg.axis();
var xAxis = d3.axisBottom();
xAxis.scale(xScale);
//xAxis.orient("bottom");

//var yAxis = d3.svg.axis();
var yAxis = d3.axisLeft();
yAxis.scale(yScale);
//yAxis.orient("left");





/*
var max_r = d3.max(data.map(
    function(d) {
        return d[2];
    }));

var r = d3.scale.linear()
    .domain([0, d3.max(data, function(d) {
        return d[2];
    })])
    .range([0, 12]);
*/

//Add the points to the scatter plot and size them accordingly
svg.selectAll("circle")
    .data(entities)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", function(d) {
        return xScale(d.relevance);
    })
    .attr("cy", function(d) {
        return yScale(d.count);
    })
    .attr("r", function(d) {
        return Math.sqrt(h - d.count);
        //return r(d[2]);
    })
    .transition()
    .duration(800);

//Add labels to the points to be able to see what the values are
svg.selectAll("text")
    .data(entities)
    .enter()
    .append("text")
    .text(function(d) {
        return d.text;
    })
    .attr("x", function(d) {
        return xScale(d.relevance) - 10;
    })
    .attr("y", function(d) {
        return yScale(d.count);
    })
    .attr("fill", "red")
    .attr("font-size", "11px");

/*
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (h - pad) + ")")
    .call(xAxis);
.append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Calories");
    */

var yPos = 100;

// x-axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (h - pad) + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", w - pad)
    .attr("y", -10)
    .attr("fill", "#555")
    .style("text-anchor", "end")
    .text("Relevance");

//y-axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (left_pad - pad) + ", 0)")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("x", -pad)
    .attr("dy", ".71em")
    .attr("fill", "#555")
    .style("text-anchor", "end")
    .text("Count");
