var lollipopChart = LollipopChart('#myLollipopChart');
var data = {
  min: 15,
  max: 100,
  members: [
    {country: 'Afghanistan', value: '80', average: '60'},
    {country: 'Bangladesh', value: '50', average: '50'},
    {country: 'Bhutan', value: '15', average: '35'},
    {country: 'India', value: '100', average: '55'},
    {country: 'Maldives', value: '25', average: '30'},
    {country: 'Nepal', value: '35', average: '40'},
    {country: 'Pakistan', value: '50', average: '60'},
    {country: 'Sri Lanka', value: '65', average: '50'},
  ]};

lollipopChart
  .width(200)
  .height(100)
  .barGap(5)
  .render(data);