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
    //Y values map from [0, countMax + 2] to
    var yScale = d3.scaleLinear().domain([0, countMax + 2]).range([height - bottomPad, topPad]);

/*
    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);
*/
    var yAxis = d3.axisLeft();
    yAxis.scale(yScale);

    svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Frequency");


          svg.selectAll(".bar")
      .data(entities)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("width", "20px")
      .attr("x", function(d) {
        console.log("Index: " + entities.indexOf(d));
         return  entities.indexOf(d) * 30;
        })
      .attr("y", function(d) { return yScale(d.count); })
      .attr("height", function(d) { return height - yScale(d.count); });
