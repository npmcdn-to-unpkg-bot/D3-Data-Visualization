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

//Acquire the width of a string using a particular font
String.prototype.width = function(font) {
    var f = font || '12px arial';

    var o = $('<div>' + this + '</div>')
        .css({
            'position': 'absolute',
            'float': 'left',
            'white-space': 'nowrap',
            'visibility': 'hidden',
            'font': font
        })
        .appendTo($('body'));

    var divWidth = o.width();

    o.remove();

    return divWidth;
}

//Acquire the height of a string using a particular font
String.prototype.height = function(font) {
    var f = font || '12px arial';

    var o = $('<div>' + this + '</div>')
        .css({
            'position': 'absolute',
            'float': 'left',
            'white-space': 'nowrap',
            'visibility': 'hidden',
            'font': font
        })
        .appendTo($('body'));

    var divHeight = o.height();

    o.remove();

    return divHeight;
}

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
var svg = d3.select("#scatterplot")
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

//X values map from [0, relevanceMax + 0.2] to [leftPad, width - rightPad]
var xScale = d3.scaleLinear().domain([0, relevanceMax + 0.2]).range([leftPad, width - rightPad])

//Y values map from [0, countMax + 2] to
var yScale = d3.scaleLinear().domain([0, countMax + 2]).range([height - bottomPad, topPad]);

console.log("Max X (Relevance):" + relevanceMax);
console.log("Min X (Relevance):" + relevanceMin);

console.log("Max Y (Count):" + countMax);
console.log("Min Y (Count):" + countMin);


//A color is assigned to each entity type
var colorValue = function(d) {
    return d.type;
};
var color = d3.scaleOrdinal(d3.schemeCategory20);


//Add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


//Minimum radius of a datapoint
var rMin = 10;

//Maximum radius of a datapoint
var rMax = Math.sqrt(Math.sqrt(width * width + height * height)) - rMin;

//Add the points to the scatter plot and size them accordingly
svg.selectAll("circle")
    .data(entities)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", function(d) {
    //  console.log(d);
        return xScale(d.relevance);
    })
    .attr("cy", function(d) {
        return yScale(d.count);
    })
    .attr("r", function(d) {

        //Normalize the relevance and count to a [0,1] range
        var relevanceRatio = (d.relevance - relevanceMin) / (relevanceMax - relevanceMin);
        var countRatio = (d.count - countMin) / (countMax - countMin);

        //Calculate scale from root of sum of squares of relevanceRatio and countRatio
        var scale = Math.sqrt(relevanceRatio * relevanceRatio + countRatio * countRatio);

        return rMax * scale + rMin;
    })
    .style("fill", function(d) {
        //Color the datapoints according to their type
        return color(colorValue(d));
    })
    .on("mouseover", function(d) {

      //Make the circle brighter with heavier borders
      d3.select(this)
          .style("opacity", "0.5")
          .style("stroke-width", 5);

        //Normalize the relevance and count to a [0,1] range
        var relevanceRatio = (d.relevance - relevanceMin) / (relevanceMax - relevanceMin);
        var countRatio = (d.count - countMin) / (countMax - countMin);

        //Calculate scale from root of sum of squares of relevanceRatio and countRatio
        var scale = Math.sqrt(relevanceRatio * relevanceRatio + countRatio * countRatio);

        var radius = rMax * scale + rMin;

        //Display tooltip with relevant information
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

      //Reset the circle's opacity and border
      d3.select(this)
          .style("opacity", 1)
          .style("stroke-width", 1);

        //Hide tooltip upon mouse-out
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });


var labelFont = "16px sans-serif"

//Add labels to the points to be able to see what the associated text is
svg.selectAll("text")
    .data(entities)
    .enter()
    .append("text")
    .text(function(d) {
        console.log("width of " + d.text + " is: " + d.text.width('11px sans-serif'));
        console.log("height of " + d.text + " is: " + d.text.height('11px sans-serif'));

        return d.text;
    })
    .style("font", labelFont)
    .attr("x", function(d) {

        //Center the text on the datapoint's center
        return xScale(d.relevance) - d.text.width(labelFont) / 2;

    })
    .attr("y", function(d) {

        //Normalize the relevance and count to a [0,1] range
        var relevanceRatio = (d.relevance - relevanceMin) / (relevanceMax - relevanceMin);
        var countRatio = (d.count - countMin) / (countMax - countMin);

        //Calculate scale from root of sum of squares of relevanceRatio and countRatio
        var scale = Math.sqrt(relevanceRatio * relevanceRatio + countRatio * countRatio);

        var radius = rMax * scale + rMin;

        //Place the text just beneath the data-point
        return yScale(d.count) + radius + d.text.height(labelFont) + 1;
    })
    .attr("fill", function(d) {
        // Fill with a color that contrasts well with the datapoint's fill color
        return contrastingColor(color(colorValue(d)));
    });



// Draw legend
var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
        return "translate(0," + i * 35 + ")";
    });

// draw legend colored rectangles
legend.append("rect")
    .attr("x", width - 20)
    .attr("y", rightPad)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", color);

// draw legend text
legend.append("text")
    .attr("x", width - 26)
    .attr("y", rightPad + 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
        return d;
    })
    .attr("font-size", "14px");


var xAxis = d3.axisBottom();
xAxis.scale(xScale);
var xLabel = "Relevance";

var yAxis = d3.axisLeft();
yAxis.scale(yScale);
var yLabel = "Count";

// Add X-axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (height - bottomPad) + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width - rightPad)
    .attr("y", -6)
    .attr("fill", "#222")
    .style("text-anchor", "end")
    .style("font-size", "19px")
    .text(xLabel);

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


//Return a color (either black or white) that contrasts well with the argument color
function contrastingColor(color) {
    return (luma(color) >= 165) ? '000' : 'fff';
}

//Return the relative luminance of the argument color
function luma(color) {
    var rgb = (typeof color === 'string') ? hexToRgb(color) : color;
    return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
}

//Conver a hex-formatted color to an RGB-formatted color
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
