//some global variables (not the best style, but will work for us)
var data;

// define the size of the svg
var margin = {top: 50, right: 50, bottom: 50, left: 50},
	width = 700;// - margin.left - margin.right,
	height = 700;// - margin.top - margin.bottom;

//define some colors (https://github.com/d3/d3-scale-chromatic)
var colorMap = d3.scaleOrdinal(d3.schemeCategory10);

function init(inputData){

	data = inputData;

	//preprocess data

	var categories = ['Half Heusler','Phase Separating',"'Other' Prototoype","'Common' non-HH Prototype"];

	var processed_data = [];

	for (i in categories) {
		console.log(categories[i])
		console.log(data.filter(function(d) {return d.Label == categories[i]}))
		filtered_d = data.filter(function(d) {return d.Label == categories[i]})

		processed_data.push({
			key: categories[i],
			value: filtered_d});
	}
	console.log(processed_data)

	// now create the svg element
	var svg = d3.select("#container").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr('id','scatterSVG')
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//define the scales: these will convert from pixels to data units
	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	//nice does what it sounds like : gives you nice round values 
	x.domain(d3.extent(data, function(d) { return +d['Synth. Probability']; })).nice();
	y.domain(d3.extent(data, function(d) { return +d['Half Heusler (F-43m)']; })).nice();

	//define the axes
	var xAxis = d3.axisBottom(x);
	var yAxis = d3.axisLeft(y);

	// add the axes to the SVG element
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
	.append("text")
		.attr("class", "label")
		.attr("x", width -20)
		.attr("y", 30)
		.style("text-anchor", "end")
		.text("Predicted Synthesizability Probability");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("x", -20)
		.attr("y", -40)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Decomposition Energy (eV/atom)")


	//add the data and the legend to the scatter plot
	populateScatter(x, y)


}

function populateScatter(x, y){

	var svg = d3.select('#scatterSVG');

	var colors = []; //for the legend

	//add all the dots
	svg.selectAll(".dot")
		.data(data).enter()
		.append("circle")
			.attr("class", "dot") // need to link class to category name
			.attr("r", 2)
			.attr("cx", function(d) { return x(+d['Synth. Probability']); })
			.attr("cy", function(d) { return y(+d['Half Heusler (F-43m)']); })
			.style("stroke", "gray")
			.style("fill", function(d) { 
				//for the legend

				// convert strings to int

				if (d.Label == 'Half Heusler') {label = 1}
				else if (d.Label == 'Phase Separating') { label = 2}
				else if (d.Label == "'Common' non-HH Prototype") {label = 3}
				else if (d.Label == "'Other' Prototoype") {label = 4}

				if(!colors.includes(label)) {
					colors.push(label);
				}
				return colorMap(label);
			})
			.style("opacity",0.7);



	//add a legend, using the colors array defined above
	var legend = svg.selectAll(".legend")
		.data(colors).enter()
		.append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate("+margin.right+"," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", function (d) {return colorMap(d)});

	legend.append("text")
		.attr('class','legend_text')
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) {

			var label_text = 'None'

			if (d == 1) {label_text = 'Half Heusler'}
			else if (d == 2) {label_text = 'Phase Separating'}
			else if (d == 3) {label_text = "'Common' non-HH Prototype"}
			else if (d == 4) {label_text = "'Other' Prototype"}
			
			return label_text})

		.on("click", function(d){

			var label_text = 'None'

			if (d == 1) {label_text = 'Half Heusler'}
			else if (d == 2) {label_text = 'Phase Separating'}
			else if (d == 3) {label_text = "'Common' non-HH Prototype"}
			else if (d == 4) {label_text = "'Other' Prototype"}


			// is the element currently visible ?
			currentOpacity = d3.selectAll("." + d).style("opacity")
			// Change the opacity: from 0 to 1 or from 1 to 0
			d3.selectAll("." + d).transition().style("opacity", currentOpacity == 1 ? 0:1)})

}


//runs on load


d3.csv('data/original_training_ASM_plus_rest_icsd_springerdecomp.csv')
	.then(function(d) {
		init(d)
	})
	.catch(function(error){
		console.log('ERROR:', error)	
	})
