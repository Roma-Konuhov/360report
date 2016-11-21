var Highcharts = require('highcharts');

module.exports = {
  credits: {
    enabled: false
  },
  chart: {
    type: 'bar',
    animation: true,
    borderWidth: 0,
    showAxes: true,
    marginLeft: 150,
    marginRight: 50,
    marginBottom: 0,
    spacingBottom: 0,
    spacingLeft: 0,
    spacingRight: 0,
    spacingTop: 0,
    style: {
      fontFamily: 'Trebuchet MS',
      fontSize: '14px'
    },
  },
  title: {
    text: '',
    style: { "font-family": "Trebuchet MS", "font-size": "20px", "font-weight": "bold" },
    align: 'left',
    verticalAlign: 'middle'
  },
  plotOptions: {
    series: {
      animation: true,
      dataLabels: {
//        format: '<b>{point.name}</b> ({point.y:,.0f})',
        enabled: true,
        align: 'center',
        inside: true,
        color: '#ffffff',
        verticalAlign: 'middle',
        shadow: false,
        style: { fontSize: "16px", "text-shadow": "none" }
      }
    }
  },
  legend: {
    enabled: false
  },
  xAxis: {
    min: 0,
    title: null,
    tickInterval: 1,
    categories: [],
    labels: {
      style: {
        fontSize: '14px'
      }
    }
  },
  yAxis: {
    min: 0,
    tickInterval: 1,
    title: null,
    opposite: true,
    labels: {
      style: {
        fontSize: '14px'
      }
    }
    /*plotLines: [{
      color: 'blue',
      width: 12,
      value: 3,
      label: {
        text: 'Plot line',
        verticalAlign: 'bottom',
        textAlign: 'right',
        y: -10
      }
    },
      {
        color: '#333',
        width: 12,
        value: 2.2,
        label: {
          text: '4.2',
          verticalAlign: 'bottom',
          rotation: 0,
          textAlign: 'center',
          y: 20,
          x: 0
        }
      }]*/
  },
  series: [{
    data: []
  }]
};