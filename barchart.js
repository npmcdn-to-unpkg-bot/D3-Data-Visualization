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

function displayGraph()
{
var entities = JSON.parse(input.Item.entities.S);
console.log("Original entities input:\n\n" + JSON.stringify(entities, null, "\t"));

//Sort entities array by count in descending order
entities.sort(function(a, b) {
    return parseInt(b.count) - parseInt(a.count);
});
console.log("\n\nSorted entities input:\n\n" + JSON.stringify(entities, null, "\t"));

var numEntities = entities.length;

//Use only the top five entities with the highest count
if (numEntities > 5) {
    entities = entities.slice(0, 5);
}

numEntities = entities.length;

var width = 1100,
    height = 700,
    rightPad = 20,
    leftPad = 150,
    bottomPad = 40,
    topPad = 20;

var barWidth = 35;
var offset = 20;
var spacing = 20;


//Change barWidth if necessary to accomodate longer than usual labels
for (var i = 0; i < numEntities; i++) {
    var textWidth = entities[i].text.width(labelFont);
    if (textWidth > barWidth + (1.5 * spacing)) {
        barWidth = textWidth - (0.5 * spacing);

        if (barWidth * numEntities >= width - leftPad - rightPad) {
            console.log("barWidth too large!");
            break;
        }
    }
}


var labelFont = "14px sans-serif bold";


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



//From http://www.color-hex.com/color-palette/21490
var colorPalette = ["#15a071", "#b20000", "#00939f", "#ffae19", "#993299"];

//A color is assigned to each entity type
var colorValue = function(d) {
    return d.type;
};
var color = d3.scaleOrdinal(colorPalette);


//Y values map from [0, countMax + 2] to
var yScale = d3.scaleLinear().domain([0, countMax + 1.5]).range([height - bottomPad, topPad]);


var yAxis = d3.axisLeft();
yAxis.scale(yScale);
var yLabel = "Count";

//Add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


//Add bars
var bar = svg.selectAll(".bar")
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
        return height - yScale(d.count) - bottomPad;
    })
    .attr("rx", 5)
    .attr("ry", 5)
    .style("fill", function(d) {
        //Color the datapoints according to their type
        return color(colorValue(d));
    })
    .style("stroke", "black")
    .style("stroke-width", 1)
    .on("mouseover", function(d, i) {

        //Make the bar brighter with heavier borders
        d3.select(this)
            .style("opacity", "0.5")
            .style("stroke-width", 5);

        //Display tooltip with relevant information
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html("<b>Type: " + d.type + "<br/>" +
                "Text: " + d.text + "<br/>" +
                "Count: " + d.count + "<br/>" +
                "Relevance: " + d.relevance + "</b>")
            .style("left", i * (barWidth + spacing) + leftPad + offset + "px")
            .style("top", (yScale(d.count) - 30) + "px");

    })
    .on("mouseout", function(d) {

        //Reset the bar's opacity and border
        d3.select(this)
            .style("opacity", 1)
            .style("stroke-width", 1);

        //Hide tooltip upon mouse-out
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });;


//Add labels to the points to be able to see what the associated text is
svg.selectAll("text")
    .data(entities)
    .enter()
    .append("text")
    .text(function(d) {

        if (d.text.width(labelFont) < barWidth + spacing) return d.text;
        else {
            var temp = d.text;
            temp.split(" ").join("\n");
            return temp;
        }
    })
    .style("font", labelFont)
    .attr("x", function(d, i) {

        var text = d.text;

        if (d.text.width(labelFont) >= barWidth + spacing) {
            text.replace(/\s/g, "\n");
        }

        //Center the text on the datapoint's center
        return i * (barWidth + spacing) + leftPad + offset +
            (barWidth - text.width(labelFont)) / 2;

    })
    .attr("y", function(d) {

        return height - bottomPad + d.text.height(labelFont);
    })
    .style("font-weight", "bold");


function maxLabelWidth() {
    var max = 0;
    for (var i = 0; i < numEntities; i++) {
        if (entities[i].text.width(labelFont) > max) {
            max = entities[i].text.width(labelFont);
        }
    }
    return max;
}

function updateWidth() {
    return numEntities * (barWidth + spacing) + offset + maxLabelWidth() +
        leftPad + rightPad;
}

width = updateWidth();

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
}
