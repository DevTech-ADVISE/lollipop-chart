var lollipopChartBasic = LollipopChart('#lollipop-basic');
var data = [
    {name: 'Afghanistan', value: 80, comparisonValue: 60},
    {name: 'Bangladesh', value: 50, comparisonValue: 50},
    {name: 'Bhutan', value: 15, comparisonValue: 15},
    {name: 'India', value: 100, comparisonValue: 100},
    {name: 'Maldives', value: 25, comparisonValue: 30},
    {name: 'Nepal', value: 37, comparisonValue: 40},
    {name: 'Pakistan', value: 53, comparisonValue: 60},
    {name: 'Sri Lanka', value: 40, comparisonValue: 65},
  ];

// Chart setup
lollipopChartBasic
  .data(data);







// Render the charts
lollipopChartBasic.render(data);