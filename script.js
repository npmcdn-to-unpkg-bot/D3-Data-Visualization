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


var length = entities.length;

var width = 1100,
    height = 700,
    pad = 20,
    left_pad = 150;

//Add the empty svg element to the DOM
var svg = d3.select("#scatterplot")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var xMax = d3.max(entities, function(d) {
    return parseFloat(d.relevance);
});

var xMin = d3.min(entities, function(d) {
    return parseFloat(d.relevance);
});

var yMax = d3.max(entities, function(d) {
    return parseFloat(d.count);
});

var yMin = d3.min(entities, function(d) {
    return parseFloat(d.count);
});

var rMin = 10;

var rMax = Math.sqrt(Math.sqrt(width * width + height * height)) - rMin;


var xScale = d3.scaleLinear().domain([0, xMax + 0.2]).range([left_pad, width - pad])

var yScale = d3.scaleLinear().domain([0, yMax + 2]).range([height - pad * 2, pad]);

console.log("Max X:" + xMax);
console.log("Min X:" + xMin);

console.log("Max Y:" + yMax);
console.log("Min y:" + yMin);

//var xAxis = d3.svg.axis();
var xAxis = d3.axisBottom();
xAxis.scale(xScale);
//xAxis.orient("bottom");

//var yAxis = d3.svg.axis();
var yAxis = d3.axisLeft();
yAxis.scale(yScale);
//yAxis.orient("left");

// setup fill color
var cValue = function(d) {
        return d.type;
    };

  var color = d3.scaleOrdinal(d3.schemeCategory20);

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


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
        var relevanceRatio = (d.relevance - xMin) / (xMax - xMin);
        var countRatio = (d.count - yMin) / (yMax - yMin);

        var scale = Math.sqrt(relevanceRatio * relevanceRatio + countRatio * countRatio)

        return rMax * scale + rMin;
    })
    .style("fill", function(d) {
        return color(cValue(d));
    })
    .on("mouseover", function(d) {

      var relevanceRatio = (d.relevance - xMin) / (xMax - xMin);
      var countRatio = (d.count - yMin) / (yMax - yMin);

      var scale = Math.sqrt(relevanceRatio * relevanceRatio + countRatio * countRatio)

      var radius =  rMax * scale + rMin;

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html("<b>Type: " + d.type + "<br/>" +
            "Text: " + d.text + "<br/>" +
          "Count: " + d.count + "<br/>" +
        "Relevance: " + d.relevance + "</b>")
            .style("left", (xScale(d.relevance) - 30) + "px")
            .style("top", (yScale(d.count) - radius - 20) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });


    function contrastingColor(color)
    {
        return (luma(color) >= 165) ? '000' : 'fff';
    }
    function luma(color) // color can be a hx string or an array of RGB values 0-255
    {
        var rgb = (typeof color === 'string') ? hexToRgb(color) : color;
        return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }



//Add labels to the points to be able to see what the values are
svg.selectAll("text")
    .data(entities)
    .enter()
    .append("text")
    .text(function(d) {

        return d.text;
    })
    .attr("x", function(d) {

      var relevanceRatio = (d.relevance - xMin) / (xMax - xMin);
      var countRatio = (d.count - yMin) / (yMax - yMin);

      var scale = Math.sqrt(relevanceRatio * relevanceRatio + countRatio * countRatio)

      var radius =  rMax * scale + rMin;

        return xScale(d.relevance) - radius/2;
    })
    .attr("y", function(d) {
        return yScale(d.count);
    })
    .attr("fill", function(d) {
    //  return "#000";
        return contrastingColor(color(cValue(d)));
    })
    .attr("font-size", "11px");


// draw legend
var legend = svg.selectAll(".legend")
    .data(color.domain())
  .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
legend.append("rect")
.attr("x", width - 18)
.attr("y", pad)
.attr("width", 18)
.attr("height", 18)
.style("fill", color);

// draw legend text
legend.append("text")
.attr("x", width - 24)
.attr("y", pad + 9)
.attr("dy", ".35em")
.style("text-anchor", "end")
.text(function(d) { return d;})
    .attr("font-size", "14px");

// x-axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (height - pad) + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width - pad)
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
