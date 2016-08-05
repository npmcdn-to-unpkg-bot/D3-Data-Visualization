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

//Get date in short format
Date.prototype.shortFormat = function() {
    return (this.toLocaleDateString() + " " +
        this.toLocaleTimeString());
}


function displayTimeline(inputString) {

    if (!inputString) {
        alert("Please fill the textarea");
        console.log("Please fill the textarea");
        return;
    }

    try {
        inputString = JSON.parse(inputString);

    } catch (e) {
        console.log(e);
        alert(e);
        return;
    }

    //Hide formInput and show reset button
    document.getElementById("formInput").style.display = 'none';
    document.getElementById("reset").style.display = 'block';

    //Clear any previous barchart
    var myNode = document.getElementById("barChart");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }


    var input = JSON.parse(inputString.Item.entities.S);

    var entities = [];
    //Building an entities array to incorporate individual times in each entity
    for (var i = 0; i < input.length; i++) {
        for (var j = 0; j < input[i].timestamp.length; j++) {
            var tmpObj = {};
            tmpObj['type'] = input[i].type;
            tmpObj['text'] = input[i].text;
            tmpObj['relevance'] = parseFloat(input[i].relevance);
            tmpObj['count'] = parseInt(input[i].count);
            tmpObj['time'] = input[i].timestamp[j];

            entities.push(tmpObj);
        }
    }

    console.log("Original entities input:\n\n" + JSON.stringify(entities, null, "\t"));


    var numEntities = entities.length;

    var width = 1100,
        height = 300,
        rightPad = 20,
        leftPad = 50,
        bottomPad = 40,
        topPad = 200;



    //Finding minTime, maxTime, relevanceMax, and relevanceMax
    var minTime = parseTime(entities[0].time);
    var maxTime = parseTime(entities[0].time);


    for (var i = 0; i < entities.length; i++) {
        //Converting time strings to valid Date objects
        entities[i].time = parseTime(entities[i].time);

        //Finding maxTime and minTime
        if (maxTime < entities[i].time) maxTime = entities[i].time;
        else if (minTime > entities[i].time) minTime = entities[i].time;

    }

    console.log("Parsed time for entities:\n\n" + JSON.stringify(entities, null, "\t"));

    console.log("Max time: " + maxTime.shortFormat());
    console.log("Min time: " + minTime.shortFormat());



    //Add the empty svg element to the DOM
    var svg = d3.select("#barChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    //Adding padding to min and max times
    var paddingMinutes = 0.05 * (maxTime.getTime() - minTime.getTime());
    var domainMin = new Date(minTime - paddingMinutes);
    var domainMax = new Date(maxTime + paddingMinutes);

    var xScale = d3.scaleTime()
        .domain([domainMin, domainMax])
        .range([leftPad, width - rightPad]);

    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);
    var xLabel = "Time";

    xAxis.ticks(d3.timeMinute.every(10));
    //Display full time
    xAxis.tickFormat(d3.timeFormat("%I:%M%p"));

    // Add X-axis
    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0, " + (height - bottomPad) + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width - rightPad)
        .attr("y", 30)
        .attr("fill", "#222")
        .style("text-anchor", "end")
        .style("font-size", "19px")
        .text(xLabel);


    //Add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var radius = 5;


    //From http://www.color-hex.com/color-palette/21490 and other palettes
    var colorPalette = ["#15a071", "#b20000", "#00939f", "#ffae19", "#bbb9a9", "#993299", "#4c5678"];

    //A color is assigned to each entity type
    var colorValue = function(d) {
        return d.text;
    };
    var color = d3.scaleOrdinal(d3.schemeCategory20);



    svg.selectAll("circle")
        .data(entities)
        .enter()
        .append("circle")
        .attr("class", function(d) {

            //Replace spaces with underscores
            var rmSpaces = d.text.replace(/ /g, "_");

            return "circle-" + rmSpaces;
        })
        .attr("cx", function(d) {
            return xScale(d.time);
        })
        .attr("cy", function(d) {
            return (height - bottomPad - (1.5 * radius));
        })
        .attr("r", radius)
        .style("fill", function(d) {
            //Color the datapoints according to their type
            return color(colorValue(d));
        })
        .on("mouseover", function(d) {

            var largeRadius = Math.sqrt(3) * radius;

            //Making all classes of circles translucent
            d3.selectAll("circle")
                .style("opacity", 0.3);

            //Make the current circle have default opacity with heavier borders and larger radius
            d3.select(this)
                .style("opacity", 1)
                .style("stroke-width", 5)
                .attr("r", largeRadius);

            var timeString = "Time: " + entities[0].time.shortFormat();
            var widthTimeString = timeString.width();

            var xPos = xScale(d.time) - widthTimeString / 2 - largeRadius / 2;
            if (xPos < 0) xPos = 0;

            //Display tooltip with relevant information
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("<b>Type: " + d.type + "<br/>" +
                    "Text: " + d.text + "<br/>" +
                    "Count: " + d.count + "<br/>" +
                    "Time: " + d.time.shortFormat() + "<br/>" +
                    "Relevance: " + d.relevance + "</b>")
                .style("left", xPos + "px")
                .style("top", height - bottomPad - largeRadius - 60 + "px");

        })
        .on("mouseout", function(d) {

            //Resetting opacity of all circles
            d3.selectAll("circle")
                .style("opacity", 1);

            //Reset the current circle's border thickness and radius
            d3.select(this)
                .style("stroke-width", 1)
                .attr("r", radius);


            //Hide tooltip upon mouse-out
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

var labelFont = "11px sans-serif"
var legendTabHeight = 0;
var maxLegendHeight = 250;
var legendTabs = 0;
var currentLegendTabIndex = 0;

    function maxLabelWidth() {
        var max = 0;
        for (var i = 0; i < numEntities; i++) {
            if (entities[i].text.width(labelFont) > max) {
                max = entities[i].text.width(labelFont);
            }
        }
        return max;
    }

    var maxLabelWidth = maxLabelWidth();



    // Draw legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {

          if(legendTabHeight + 55 > maxLegendHeight)
          {
            legendTabs++;
            currentLegendTabIndex = 0
            legendTabHeight = 0;
            currentLegendTabIndex++;
            legendTabHeight += 55;
            return "translate(" + (-legendTabs * (maxLabelWidth + 85)) + "," + currentLegendTabIndex * 35 + ")";

          }
          else
            {
              currentLegendTabIndex++;
              legendTabHeight += 55;
              return "translate(" + (-legendTabs * (maxLabelWidth + 85)) + "," + currentLegendTabIndex * 35 + ")";

            }


        });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 20)
        .attr("y", rightPad)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", color)
        .on("mouseover", function(d) {

            //Replace spaces with underscores
            var rmSpaces = d.replace(/ /g, "_");

            //Making all other classes of circles translucent
            var notSelector = "circle:not(.circle-" + rmSpaces + ")";
            svg.selectAll(notSelector)
                .style("opacity", 0.3);

            //Making this class of circles have a larger radius and thicker border
            svg.selectAll(".circle-" + rmSpaces)
                .data(entities)
                .style("stroke-width", 5)
                .attr("r", function(d) {
                    return Math.sqrt(3) * radius;
                });

        })
        .on("mouseout", function(d) {

            //Replace spaces with underscores
            var rmSpaces = d.replace(/ /g, "_");

            //Resetting opacity of all other classes of circles
            var notSelector = "circle:not(.circle-" + rmSpaces + ")";
            svg.selectAll(notSelector)
                .style("opacity", 1);

            //Resetting border thickness and radius of this class of circles
            svg.selectAll(".circle-" + rmSpaces)
                .data(entities)
                .style("stroke-width", 1)
                .attr("r", radius);

        });




    // draw legend text
    legend.append("text")
        .attr("x", width - 26)
        .attr("y", rightPad + 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        })
        .attr("font-size", "14px")
        .on("mouseover", function(d) {

            //Replace spaces with underscores
            var rmSpaces = d.replace(/ /g, "_");

            //Making all other classes of circles translucent
            var notSelector = "circle:not(.circle-" + rmSpaces + ")";
            svg.selectAll(notSelector)
                .style("opacity", 0.3);

            //Making this class of circles have a larger radius and thicker border
            svg.selectAll(".circle-" + rmSpaces)
                .data(entities)
                .style("stroke-width", 5)
                .attr("r", function(d) {
                    return Math.sqrt(3) * radius;
                });

        })
        .on("mouseout", function(d) {

            //Replace spaces with underscores
            var rmSpaces = d.replace(/ /g, "_");

            //Resetting opacity of all other classes of circles
            var notSelector = "circle:not(.circle-" + rmSpaces + ")";
            svg.selectAll(notSelector)
                .style("opacity", 1);

            //Resetting border thickness and radius of this class of circles
            svg.selectAll(".circle-" + rmSpaces)
                .data(entities)
                .style("stroke-width", 1)
                .attr("r", radius);

        });

}

function reset() {

    //Clear any previous barchart
    var myNode = document.getElementById("barChart");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    //Show formInput and hide reset button
    document.getElementById("formInput").style.display = 'block';
    document.getElementById("reset").style.display = 'none';
}

//Insert sample JSON input
function sampleInput() {

    var input = {
        "Item": {
            "entities": {
                "S": "[{\"type\":\"Person\",\"text\":\"Elon Musk\",\"relevance\":\"0.80222\", \"timestamp\":[\"09:32\", \"09:49\", \"09:58\", \"09:59\", \"10:56\", \"10:57\", \"10:58\"], \"count\":\"3\",\"Relevance\":\"0.80222\"},{\"type\":\"Company\",\"text\":\"Tesla\",\"relevance\":\"0.438313\", \"timestamp\":[\"09:21\", \"09:56\", \"09:22\", \"09:29\", \"09:34\", \"09:40\", \"09:22\"], \"count\":\"1\",\"Relevance\":\"0.438313\"},{\"type\":\"Technology\",\"text\":\"Autopilot\",\"relevance\":\"0.493184\",\"count\":\"1\",\"timestamp\":[\"09:11\", \"09:12\", \"09:14\", \"09:15\", \"09:32\", \"09:09\", \"09:23\", \"09:20\"], \"Relevance\":\"0.80222\"},{\"type\":\"FieldTerminology\",\"text\":\"sports car\",\"timestamp\":[\"09:41\", \"09:44\", \"09:45\", \"09:32\",\"09:47\", \"09:48\", \"09:49\", \"09:59\"], \"relevance\":\"0.40922\",\"count\":\"5\",\"Relevance\":\"0.80222\"},{\"type\":\"FieldTerminology\",\"text\":\"lithium ion battery\", \"timestamp\":[\"10:02\", \"10:03\", \"10:09\", \"10:05\", \"10:06\", \"10:07\", \"10:19\"], \"relevance\":\"0.60137\",\"count\":\"2\",\"Relevance\":\"0.80222\"},{\"type\":\"Person\",\"text\":\"Nikola Tesla\",\"relevance\":\"0.3013\",\"count\":\"1\", \"timestamp\":[\"09:25\", \"09:28\", \"09:49\", \"09:51\", \"10:35\", \"10:36\", \"10:48\", \"10:52\"], \"Relevance\":\"0.80222\"}, {\"type\":\"Company\",\"text\":\"Gigafactory\",\"relevance\":\"0.7152\", \"timestamp\":[\"10:30\", \"10:35\", \"10:36\", \"10:48\", \"10:49\", \"10:59\", \"09:09\"], \"count\":\"2\",\"Relevance\":\"0.7152\"}]"
            },
            "conference-uuid": {
                "S": "25236C0C-6ADD-437E-B128-2053C493E4A5"
            }
        }
    };

    if (document.getElementById("sampleInput").checked == true) {

        document.getElementById('input').value = JSON.stringify(input, null, "\t");
    } else {
        document.getElementById('input').value = "";
    }
}


//Extract a Date Object out of a time string
function parseTime(timeStr, dt) {
    if (!dt) {
        dt = new Date();
    }

    var time = timeStr.match(/(\d+)(?::(\d\d))?\s*(p?)/i);
    if (!time) {
        return NaN;
    }
    var hours = parseInt(time[1], 10);
    if (hours == 12 && !time[3]) {
        hours = 0;
    } else {
        hours += (hours < 12 && time[3]) ? 12 : 0;
    }

    dt.setHours(hours);
    dt.setMinutes(parseInt(time[2], 10) || 0);
    dt.setSeconds(0, 0);

    return dt;
}
