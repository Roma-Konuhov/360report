import React from'react';
import Highcharts from 'highcharts';
import options from './options';
import _ from 'lodash';

export default React.createClass({
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
      options.title.text = this.props.title;
    }
    if (this.props.xCategories) {
      options.xAxis.categories = this.props.xCategories;
      options.xAxis.max = this.props.xCategories.length - 1;
    }
    if (this.props.yCategories) {
      //options.yAxis.categories = this.props.yCategories;
      options.yAxis.max = this.props.yCategories.length - 1;
      options.yAxis.labels.formatter = function() {
        return this.value && `${self.props.yCategories[this.value]}<br>(${this.value})` || '';
      };
    }
    if (!_.isEmpty(this.props.avgValuesOptions)) {
      this.setPlotLinesOptions(this.props.avgValuesOptions);
    }
    //options.series[0] = this.props.data;
    // Extend Highcharts with modules
    if (this.props.modules) {
      this.props.modules.forEach(function (module) {
        module(Highcharts);
      });
    }
    // Set container which the chart should render to.
    this.chart = new Highcharts[this.props.type || "Chart"](
      this.props.container,
      options
    );
    this.chart.series[0].setData(this.props.data, true);
  },

  setPlotLinesOptions(opts) {
    let result = [];
    let commonOptions = {
      width: 10,
      label: {
        verticalAlign: 'bottom',
        rotation: 0,
        textAlign: 'center',
        y: 20,
        x: 0
      }
    };
    opts.forEach(opt => {
      result.push(_.defaultsDeep({}, commonOptions, opt));
    });
    options.yAxis.plotLines = result;
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