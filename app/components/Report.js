import React from 'react';
import Chart from './Graph/Highcharts.react';
import InfoBlock from './Text/InfoBlock';
import TextBlockBeforeStat from './Text/TextBlockBeforeStat';
import TextBlockAfterStat from './Text/TextBlockAfterStat';
import UserData from './UserData';
import PersonalStatistics from './Statistics/Personal';
import Statistics from './Statistics';

class Report extends React.Component {
  getXCategories(relationLabels, respondersNumber) {
    return relationLabels.map((label, idx) => {
      return `${label} (${respondersNumber[idx]})`;
    });
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

  getFormattedAvgValues(data) {
    let result = []

    if (parseFloat(data.avg_score)) {
      result.push({
        color: '#000',
        value: data.avg_score,
        label: {
          text: data.avg_score,
        }
      });
    }
    if (parseFloat(data.avg_norm)) {
      result.push({
        color: '#00b0f0',
        value: data.avg_norm,
        label: {
          text: data.avg_norm,
        }
      });
    }

    return result;
  }

  addDataByField(dest, source, field) {
    if (!source.length) return;

    var resultArray = [];
    dest.forEach((d,i) => {
      var result = _.clone(d);
      result[field] = source[i][field];
      resultArray.push(result);
    });

    return resultArray;
  }

  render() {
    return (
      <div className="container">
        <h1>360&deg; Feedback Report</h1>
        <UserData id={this.props.userId} />
        <InfoBlock />
        {this.props.reports.map((report, idx) => {
          return (
            <div key={`chart-wrapper-${idx}`} className="chart-block">
              <PersonalStatistics data={this.props.statistics[idx]} />
              <div className="title">{report.text}</div>
              <div className="chart-wrapper">
              <Chart
                container={`question-${idx}`}
                data={this.getFormattedData(report.avgAnswers)}
                xCategories={this.getXCategories(report.relationLabels, report.respondersNumber)}
                yCategories={report.answerLabels}
                avgValuesOptions={this.getFormattedAvgValues(this.props.statistics[idx])}
              />
            </div>
            </div>
          )
        })}
        <TextBlockBeforeStat />
        <Statistics data={this.addDataByField(this.props.statistics, this.props.reports, 'text')} />
        <TextBlockAfterStat />
      </div>
    );
  }
}

Report.propTypes = {
  userId: React.PropTypes.string.isRequired,
  reports: React.PropTypes.array.isRequired,
  statistics: React.PropTypes.array.isRequired
};

export default Report;
