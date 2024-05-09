function plot(sym, margins, timeformat) {
	var dim = g3.dimensions('chart-' + sym + '-div', margins);
	
	var x = {};
	x.scale = d3.time.scale().range([0, dim.plot.width]);
	x.axis = d3.svg.axis().scale(x.scale).orient('bottom');
	x.axis.tickFormat(timeformat);
	
	var y = {};
	y.scale = d3.scale.linear().range([dim.plot.height, 0]);
	y.axis = d3.svg.axis().scale(y.scale).orient('left');
	
	var series = {};
	series.x = function(d) { return d.minute; };
	series.y = function(d) { return 100 * d.rv; };
	series.xs = function(d) { return x.scale(series.x(d)); };
	series.ys = function(d) { return y.scale(series.y(d)); };
	
	var svg = g3.makesvg(d3.select('#chart-' + sym + '-div'), dim, margins);
	
	d3.csv(sym + 'b.csv',
		function(error, data) {
			data.forEach(
				function(d) {
					d.minute = timeformat.parse(d.minute);
					d.rv = +d.rv;
				}
			);
			x.scale.domain(d3.extent(data, series.x)).nice();
			y.scale.domain(d3.extent(data, series.y)).nice();
			svg.append('g')
				.attr('class', 'x axis')
				.attr('transform', 'translate(0,' + dim.plot.height + ')')
				.call(x.axis);
			svg.append('g')
				.attr('class', 'y axis')
				.call(y.axis);
			svg.append('text')
				.attr('transform','rotate(-90)')
				.attr('y', -(margins.left + 5))
				.attr('x', -(dim.plot.height / 2))
				.attr('dy','1.2em')
				.style('text-anchor', 'middle')
				.text('% of day\'s volume');
			svg.selectAll(".dot")
				.data(data)
				.enter().append("circle")
				.attr("class", "dot")
				.attr("r", 3.5)
				.attr("cx", series.xs)
				.attr("cy", series.ys);
		}
	);
	
	var medline = d3.svg.line()
		.x(series.xs)
		.y(function(d) { return y.scale(100 * d.median); });
	var devline = d3.svg.line()
		.x(series.xs)
		.y(function(d) { return y.scale(100 * (d.median + 2 * d.stdev)); });
	d3.csv(sym + 'c.csv',
		function(error, data) {
			data.forEach(
				function(d) {
					d.minute = timeformat.parse(d.minute);
					d.median = +d.median;
					d.stdev = +d.stdev;
				}
			);
			svg.append('path')
				.datum(data)
				.attr('class', 'medline')
				.attr('d', medline);
			svg.append('path')
				.datum(data)
				.attr('class', 'devline')
				.attr('d', devline);
		}
	);
}
