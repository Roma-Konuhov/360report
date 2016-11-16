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

// select * from users u
// join consultant_reports cr on u.name=cr.reviewee
// join relation r on u.name=r.reviewee
// where u.id=<id>
// group by r.relation

//

//db.consultant_reports.aggregate({$lookup: {from:'users',localField:'reviewee',foreignField:'name',as:'joined_reviewee'}}, {$match:{'joined_reviewee.name':'Olga Lakiza'}}, {$lookup: {from:'users',localField:'responder',foreignField:'email',as:'joined_responder'}},{$lookup: {from:'relations',localField:'joined_responder.name',foreignField:'joined_relation.responder',as:'joined_relation'}})


