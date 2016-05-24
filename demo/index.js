var lollipopChart = LollipopChart('#lollipop-example');
var data = [
  {country: 'Afghanistan', value: '444', average: '122'},
  {country: 'Bangladesh', value: '206', average: '122'},
  {country: 'Bhutan', value: '4', average: '122'},
  {country: 'India', value: '193', average: '122'},
  {country: 'Maldives', value: '11', average: '122'},
  {country: 'Nepal', value: '155', average: '122'},
  {country: 'Pakistan', value: '310', average: '122'},
  {country: 'Sri Lanka', value: '113', average: '122'},
];

lollipopChart
  .width(200)
  .height(100)
  .barSpacing(5)
  .render(data);