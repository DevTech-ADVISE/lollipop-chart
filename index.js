var lollipopChartBasic = LollipopChart('#lollipop-chart-basic');
var lollipopChartScale = LollipopChart('#lollipop-chart-scale');
var lollipopChartIndividualScales = LollipopChart('#lollipop-chart-individual');

var gradesPerName = [
    {name: 'Bobby', value: 80, comparisonValue: 80},
    {name: 'Jane', value: 79, comparisonValue: 68},
    {name: 'Fred', value: 70, comparisonValue: 78},
    {name: 'Alan', value: 75, comparisonValue: 64},
    {name: 'Jeeves', value: 75, comparisonValue: 85},
    {name: 'Mary', value: 67, comparisonValue: 70},
    {name: 'Marsha', value: 60, comparisonValue: 68},
    {name: 'Andy', value: 100, comparisonValue: 100},
  ];

var dataIndividualScales = [
  {name: 'Afghanistan', value: 80, comparisonValue: 60, scale: d3.scale.linear().domain([40, 100])},
  {name: 'Bangladesh', value: 50, comparisonValue: 50, scale: d3.scale.linear().domain([40, 60])},
  {name: 'Bhutan', value: 5, comparisonValue: 35, scale: d3.scale.linear().domain([0, 50])},
  {name: 'India', value: 100, comparisonValue: 55, scale: d3.scale.linear().domain([40, 100])},
  {name: 'Maldives', value: 25, comparisonValue: 30, scale: d3.scale.linear().domain([0, 50])},
  {name: 'Nepal', value: 35, comparisonValue: 40, scale: d3.scale.linear().domain([35, 60])},
  {name: 'Pakistan', value: 50, comparisonValue: 60, scale: d3.scale.linear().domain([40, 100])},
  {name: 'Sri Lanka', value: 65, comparisonValue: 50, scale: d3.scale.linear().domain([40, 100])},
];

// Chart setup
lollipopChartBasic
  .data(gradesPerName);

lollipopChartScale.yScale(d3.scale.linear().domain([50, 100]))
  .data(gradesPerName);

lollipopChartIndividualScales
  .data(dataIndividualScales);

// Render the charts
lollipopChartBasic.render();
lollipopChartScale.render();
lollipopChartIndividualScales.render();