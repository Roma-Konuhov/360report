var React = require('react');
var Highcharts = require('highcharts');

module.exports = React.createClass({
  componentWillReceiveProps(nextProps) {
    if (!this.chart || !nextProps) return;

    this.chart.series[0].update({
      data: nextProps.data
    });
    this.chart.redraw();
  },

  // When the DOM is ready, create the chart.
  componentDidMount() {
    this.props.options.series[0].data = this.props.data;
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