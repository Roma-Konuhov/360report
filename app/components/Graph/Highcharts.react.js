var React = require('react');
var Highcharts = require('highcharts');

module.exports = React.createClass({
  componentWillReceiveProps(nextProps) {
    if (!this.chart || !nextProps) return;

    // this.chart.series[0].update({
    //   data: nextProps.data
    // });
    // this.chart.redraw();
    this.chart.series[0].setData(nextProps.data, true);
  },

  // When the DOM is ready, create the chart.
  componentDidMount() {
    var self = this;

    if (this.props.title) {
      this.props.options.title.text = this.props.title;
    }
    if (this.props.xCategories) {
      this.props.options.xAxis.categories = this.props.xCategories;
      this.props.options.xAxis.max = this.props.xCategories.length - 1;
    }
    if (this.props.yCategories) {
      //this.props.options.yAxis.categories = this.props.yCategories;
      this.props.options.yAxis.max = this.props.yCategories.length - 1;
      this.props.options.yAxis.labels.formatter = function() {
        return this.value && `${self.props.yCategories[this.value]}<br>(${this.value})` || '';
      };
    }
    //this.props.options.series[0] = this.props.data;
    // Extend Highcharts with modules
    if (this.props.modules) {
      this.props.modules.forEach(function (module) {
        module(Highcharts);
      });
    }
    // Set container which the chart should render to.
    this.chart = new Highcharts[this.props.type || "Chart"](
      this.props.container,
      this.props.options
    );
    this.chart.series[0].setData(this.props.data, true);
  },

  //Destroy chart before unmount.
  componentWillUnmount() {
    this.chart.destroy();
  },

  //Create the div which the chart will be rendered to.
  render() {
    return React.createElement('div', { id: this.props.container });
  }
});