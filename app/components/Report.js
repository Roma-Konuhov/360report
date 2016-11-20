import React from 'react';
import _ from 'lodash';
import Chart from './Graph/Highcharts.react';
import ChartOptions from './Graph/options';

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    console.log(this.props.params.id);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/consultant-report/' + this.props.params.id);
    xhr.send();
  }

  render() {
    return (
      <Chart
        container="question-1"
        options={ChartOptions}
        data={this.state.data}
      />
    );
  }
}

export default Report;


