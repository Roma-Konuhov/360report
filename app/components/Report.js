import React from 'react';
import _ from 'lodash';
import Chart from './Graph/Highcharts.react';
import Display from './Display';
import InfoBlock from './Text/InfoBlock';
import TextBlockBeforeStat from './Text/TextBlockBeforeStat';
import TextBlockAfterStat from './Text/TextBlockAfterStat';
import UserData from './UserData';
import PersonalStatistics from './Statistics/Personal';
import Statistics from './Statistics';
import Suggestions from './Suggestions';
import PersonalPlan from './PersonalPlan';

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
    let result = [];

    if (_.isEmpty(data)) {
      return result;
    }

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

  getSuggestions(items) {
    return items.map(item => {
      return {
        suggestion: item.i_suggest,
        allow_to_share: item.allow_to_share,
        responder: item.responder,
      }
    });
  }

  getAppreciations(items) {
    return items.map(item => {
      return {
        suggestion: item.i_appreciate,
        allow_to_share: item.allow_to_share,
        responder: item.responder,
      }
    });
  }

  getProfSkillsImprovements(items) {
    return items.map(item => {
      return {
        suggestion: item.prof_skills_improvement,
        allow_to_share: item.allow_to_share,
        responder: item.responder,
      }
    });
  }

  renderAfterChart(report) {
    if (report.text !== "Demonstrates strong professional skills & knowledge") {
      return null;
    }
    return (
      <div className="block-after-report">
        <Display if={_.some(this.props.suggestions, (item) => item.prof_skills_improvement && item.prof_skills_improvement.length )}>
          <Suggestions data={this.getProfSkillsImprovements(this.props.suggestions)} title="Textual comments about professional skills&knowledge" />
        </Display>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="block">
          <h1>360&deg; Feedback Report</h1>
        </div>
        <InfoBlock />
        <UserData user={this.props.user} />
        {this.props.reports.map((report, idx) => {
          return (
            <div style={{'page-break-inside': 'avoid'}} key={`chart-wrapper-${idx}`} className="chart-block">
              <Display if={this.props.statistics[idx]}>
                <PersonalStatistics data={this.props.statistics[idx]} />
              </Display>
              <table className="title"><tbody><tr><td><h4>{report.text}</h4></td></tr></tbody></table>
              <div className="chart-wrapper">
              <Chart
                container={`question-${idx}`}
                data={this.getFormattedData(report.avgAnswers)}
                xCategories={this.getXCategories(report.relationLabels, report.respondersNumber)}
                yCategories={report.answerLabels}
                avgValuesOptions={this.getFormattedAvgValues(this.props.statistics[idx])}
              />
            </div>
            {this.renderAfterChart(report)}
            </div>
          )
        })}
        <TextBlockBeforeStat />
        <Display if={this.props.statistics}>
          <Statistics data={this.addDataByField(this.props.statistics, this.props.reports, 'text')} />
        </Display>
        <TextBlockAfterStat />
        <Display if={_.some(this.props.suggestions, (item) => item.i_suggest.length )}>
          <Suggestions data={this.getSuggestions(this.props.suggestions)} title="I suggest you to..." />
        </Display>
        <Display if={_.some(this.props.suggestions, (item) => item.i_appreciate.length )}>
          <Suggestions data={this.getAppreciations(this.props.suggestions)} title="I appreciate you for..." />
        </Display>
        <PersonalPlan />
      </div>
    );
  }
}

Report.propTypes = {
  user: React.PropTypes.object.isRequired,
  reports: React.PropTypes.array.isRequired,
  statistics: React.PropTypes.array.isRequired,
  suggestions: React.PropTypes.array.isRequired,
};

export default Report;
