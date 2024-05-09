/*
	Functions to assist using the D3 library.
*/

var g3 = {}

/*
	The wide screen aspect ratio - see http://en.wikipedia.org/wiki/Aspect_ratio_(image)
*/
g3.ASPECT = 2.39;


/*
	Return the dimensions for the chart and plot area that fits the given HTML element id
	and D3 conventional margins.
	The dimensions are returned as an object.
*/
g3.dimensions = function(id, margins) {
	var x = { chart: { width: 0, height: 0 }, plot: { width: 0, height: 0 } };
	x.chart.width = document.getElementById(id).offsetWidth;
	x.plot.width = x.chart.width - margins.left - margins.right;
	x.plot.height = x.plot.width / g3.ASPECT;
	x.chart.height = x.plot.height + margins.top + margins.bottom;
	return x;
}

/*
	Make the SVG element.
*/
g3.makesvg = function(selection, dimensions, margins) {
	return selection
		.append("svg")
			.attr("width", dimensions.chart.width)
			.attr("height", dimensions.chart.height)
		.append("g")
			.attr("transform", "translate(" + margins.left + "," + margins.top + ")");
}


