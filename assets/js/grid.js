function gData() {
	var data = new Array();
	var x1 = 1; 
	var y1 = 1;
	var width = 50;
	var height = 50;
	var click = 0;
	
	for (var row = 0; row < 10; row++) {
		data.push( new Array() );
		
		for (var column = 0; column < 10; column++) {
			data[row].push({
				x2: x1,
				y2: y1,
				width: width,
				height: height,
				click: click
			})
			
			xpos += width;
		}
	
		x1 = 1;

		y1 += height;	
	}
	return data;
}

var gData = gData();	

//Debug 
console.log(gdData);

var grid = d3.select("#grid")
	.append("svg")
	.attr("width","510px")
	.attr("height","510px");
	
var row = grid.selectAll(".row")
	.data(gridData)
	.enter().append("g")
	.attr("class", "row");
	
var column = row.selectAll(".square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x2; })
	.attr("y", function(d) { return d.y2; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
	.style("fill", "#fff")
	.style("stroke", "#222")
	.on('click', function(d) {
		d.click ++;
		if ((d.click)%4 == 0 ) { d3.select(this).style("fill","#fff"); }
		if ((d.click)%4 == 1 ) { d3.select(this).style("fill","#e9a449"); }
		if ((d.click)%4 == 2 ) { d3.select(this).style("fill","#f7ddbb"); }
		if ((d.click)%4 == 3 ) { d3.select(this).style("fill","#838690"); }
		});