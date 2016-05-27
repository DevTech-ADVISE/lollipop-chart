var lollipopChart = LollipopChart('#myLollipopChart');
var data = [
    {country: 'Afghanistan', value: 80, average: 60, scale: d3.scale.linear().domain([0, 300])},
    {country: 'Bangladesh', value: 50, average: 50, scale: d3.scale.linear().domain([40, 100])},
    {country: 'Bhutan', value: 15, average: 15, scale: d3.scale.linear().domain([0, 15])},
    {country: 'India', value: 100, average: 100, scale: d3.scale.linear().domain([0, 100])},
    {country: 'Maldives', value: 25, average: 30, scale: d3.scale.linear().domain([10, 40])},
    {country: 'Nepal', value: 37, average: 40, scale: d3.scale.linear().domain([10, 60])},
    {country: 'Pakistan', value: 53, average: 60, scale: d3.scale.linear().domain([0, 100])},
    {country: 'Sri Lanka', value: 40, average: 65, scale: d3.scale.linear().domain([40, 200])},
  ];

// Chart setup
lollipopChart
  .nameAccessor(function(d) { return d.country; })
  .comparisonValueAccessor(function(d) { return d.average; });
  
// Chart render 
lollipopChart.render(data);