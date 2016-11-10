var Highcharts = require('highcharts');

module.exports = {
  credits: {
    enabled: false
  },
  chart: {
    type: 'column',
    marginRight: 100,
    animation: true,
    borderWidth: 0,
    plotShadow: true,
    plotBorderWidth: 1,
    style: {
      fontFamily: 'Trebuchet MS'
    }
  },
  title: {
    text: 'React example',
    style: { "font-family": "Trebuchet MS", "font-size": "16px" }
  },
  plotOptions: {
    series: {
      animation: true,
      dataLabels: {
        enabled: true,
          format: '<b>{point.name}</b> ({point.y:,.0f})',
          color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
          softConnector: true
      },
      //-- Other available options
      // height: pixels or percent
      // width: pixels or percent
    }
  },
  legend: {
    enabled: false
  },
  xAxis: {
    categories: ['a','b','c','d']
  },
  series: [{
    data: []
  }]
};