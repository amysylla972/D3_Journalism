
var svgWidth = 900;
var svgHeight = 590;


var margin = {
    top: 20,
    right: 40,
    bottom: 180,
    left: 100
};


var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;


var chart = d3.select("#scatter").append("div").classed("chart", true);

var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


//append an svg group
var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial Parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";



function make_x_gridlines() {		
    return d3.axisBottom(x)
        .ticks(5)
}


function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(5)
}

function xScale(censusData, chosenXAxis) {
    //create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
            d3.max(censusData, d => d[chosenXAxis]) * 1.2])
        .range([0, width]);

    return xLinearScale;
}


function yScale(censusData, chosenYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
            d3.max(censusData, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);

    return yLinearScale;
}


function renderAxesX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}


function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}


function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", data => newXScale(data[chosenXAxis]))
        .attr("cy", data => newYScale(data[chosenYAxis]));

    return circlesGroup;
}



function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return textGroup;
}

function styleX(value, chosenXAxis) {

    //stylize based on variable chosen
    //poverty percentage
    if (chosenXAxis === 'poverty') {
        return `${value}%`;
    }
    //household income in dollars
    else if (chosenXAxis === 'income') {
        return `$${value}`;
    }
    //age (number)
    else {
        return `${value}`;
    }
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    
    if (chosenXAxis === 'poverty') {
        var xLabel = "Poverty:";
    }
    
    else if (chosenXAxis === 'income') {
        var xLabel = "Median Income:";
    }
   
    else {
        var xLabel = "Age:";
    }

    if (chosenYAxis === 'healthcare') {
        var yLabel = "No Healthcare:"
    }
    
    else if (chosenYAxis === 'obesity') {
        var yLabel = "Obesity:"
    }
  
    else {
        var yLabel = "Smokers:"
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);

    return circlesGroup;
}



d3.csv("./assets/data/data.csv").then(function(censusData) {

    console.log(censusData);

    //parse data
    censusData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    //create first linear scales
    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);

    //create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    //append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    //append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 14)
        .attr("opacity", ".8");

    //append initial text
    var textGroup = chartGroup.selectAll(".stateText")
        .data(censusData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d){return d.abbr});

    //create group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

    var povertyLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .text("Age (Median)")

    var incomeLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .text("Household Income (Median)")

    //create group for 3 y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

    var healthcareLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 0 - 20)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 40)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "smokes")
        .text("Smokes (%)");

    var obesityLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 60)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "obesity")
        .text("Obese (%)");

    //updateToolTip function with data
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    //x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            //get value of selection
            var value = d3.select(this).attr("value");

            //check if value is same as current axis
            if (value != chosenXAxis) {

                //replace chosenXAxis with value
                chosenXAxis = value;

                //update x scale for new data
                xLinearScale = xScale(censusData, chosenXAxis);

                //update x axis with transition
                xAxis = renderAxesX(xLinearScale, xAxis);

                //update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                //update text with new x values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                //update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                //change classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel.classed("active", true).classed("inactive", false);
                    ageLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", false).classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", true).classed("inactive", false);
                    incomeLabel.classed("active", false).classed("inactive", true);
                }
                else {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", true).classed("inactive", false);
                }
            }
        });

    //y axis labels event listener
    yLabelsGroup.selectAll("text")
    .on("click", function() {
        //get value of selection
        var value = d3.select(this).attr("value");

        //check if value is same as current axis
        if (value != chosenYAxis) {

            //replace chosenYAxis with value
            chosenYAxis = value;

            //update y scale for new data
            yLinearScale = yScale(censusData, chosenYAxis);

            //update x axis with transition
            yAxis = renderAxesY(yLinearScale, yAxis);

            //update circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update text with new y values
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

            //update tooltips 
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            //If Statement to change boldness of text
            if (chosenYAxis === "obesity") {
                obesityLabel.classed("active", true).classed("inactive", false);
                smokesLabel.classed("active", false).classed("inactive", true);
                healthcareLabel.classed("active", false).classed("inactive", true);
            }
            else if (chosenYAxis === "smokes") {
                obesityLabel.classed("active", false).classed("inactive", true);
                smokesLabel.classed("active", true).classed("inactive", false);
                healthcareLabel.classed("active", false).classed("inactive", true);
            }
            else {
                obesityLabel.classed("active", false).classed("inactive", true);
                smokesLabel.classed("active", false).classed("inactive", true);
                healthcareLabel.classed("active", true).classed("inactive", false);
            }
        }
    });
});
