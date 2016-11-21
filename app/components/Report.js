import React from 'react';
import _ from 'lodash';
import { fetch } from '../helpers/ajax';
import Chart from './Graph/Highcharts.react';
import ChartOptions from './Graph/options';
import InfoBlock from './InfoBlock';
import UserData from './UserData';

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
    };
  }

  loadReports() {
    var id = this.props.params.id;

    return fetch(`/consultant-report/${id}`).then(reports => {
      this.setState({ reports: reports });
    }, reason => {
      //console.log(reason);
    });
  }

  componentDidMount() {
    this.loadReports();
  }

  getFormattedData(data) {
    return data.map((value, idx) => {
      return {
        dataLabels: {
          enabled: !!value,
          color: idx ? '#fff' : '#000',
        },
        color: idx ? '#888' : '#ddd',
        y: value
      }
    });
  }

  render() {
    console.log('rerender')
    return (
      <div className="container">
        <h1>360&deg; Feedback Report</h1>
        <UserData id={this.props.params.id} />
        <InfoBlock />
        {this.state.reports.map((report, idx) => {
          return (
            <div key={"chart-wrapper-" + idx} className="chart-block">
              <div className="title">{report.text}</div>
              <div className="chart-wrapper">
              <Chart
                container={"question-" + idx}
                options={ChartOptions}
                data={this.getFormattedData(report.avgAnswers)}
                xCategories={report.relationLabels}
                yCategories={report.answerLabels}
              />
            </div>
            </div>
          )
        })}
      </div>
    );
  }
}

export default Report;


