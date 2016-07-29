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


var numEntities = entities.length;

var width = 1100,
    height = 700,
    rightPad = 20,
    leftPad = 150,
    bottomPad = 20,
    topPad = 20;

//Add the empty svg element to the DOM
var svg = d3.select("#barChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


var relevanceMax = d3.max(entities, function(d) {
    return parseFloat(d.relevance);
});

var relevanceMin = d3.min(entities, function(d) {
    return parseFloat(d.relevance);
});

var countMax = d3.max(entities, function(d) {
    return parseInt(d.count);
});

var countMin = d3.min(entities, function(d) {
    return parseInt(d.count);
});

/*
    var xScale = d3.scale.ordinal()
        .rangeBand([0, width], .1);
*/


//A color is assigned to each entity type
var colorValue = function(d) {
    return d.type;
};
var color = d3.scaleOrdinal(d3.schemeCategory20);


//Y values map from [0, countMax + 2] to
var yScale = d3.scaleLinear().domain([0, countMax + 2]).range([height - bottomPad, topPad]);

/*
    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);
*/


var yAxis = d3.axisLeft();
yAxis.scale(yScale);
var yLabel = "Count";

//Add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


//Add Y-axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + leftPad + ", 0)")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("x", -topPad)
    .attr("dy", ".71em")
    .attr("fill", "#333")
    .style("text-anchor", "end")
    .style("font-size", "19px")
    .text(yLabel);



var barWidth = 35;
var offset = 20;
var spacing = 20;


//Add labels to the points to be able to see what the associated text is
svg.selectAll("text")
    .data(entities)
    .enter()
    .append("text")
    .text(function(d) {
      console("here first");
return "sdf";
        //return d.text;
    })
    .style("font", "16px sans-serif")
    .attr("x", function(d, i) {

console.log("here!");
        //Center the text on the datapoint's center
        return i * (barWidth + spacing) + leftPad + offset;

    })
    .attr("y", function(d) {

      return height;
    });

svg.selectAll(".bar")
    .data(entities)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("width", barWidth + "px")
    .attr("x", function(d, i) {
        return i * (barWidth + spacing) + leftPad + offset;
    })
    .attr("y", function(d) {
        return yScale(d.count);
    })
    .attr("height", function(d) {
        return height - yScale(d.count);
    })
    .style("fill", function(d) {
        //Color the datapoints according to their type
        return color(colorValue(d));
    })
    .on("mouseover", function(d, i) {

        //Display tooltip with relevant information
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html("<b>Type: " + d.type + "<br/>" +
                "Text: " + d.text + "<br/>" +
                "Count: " + d.count + "<br/>" +
                "Relevance: " + d.relevance + "</b>")
            .style("left", i * (barWidth + spacing) + leftPad + offset + "px")
            .style("top", (yScale(d.count) - 20) + "px");
    })
    .on("mouseout", function(d) {

        //Hide tooltip upon mouse-out
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });;

    var labelFont = "16px sans-serif"

    console.log("12here!");
