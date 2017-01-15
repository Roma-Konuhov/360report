import React from 'react';
import Table from './Table';

class Statistics extends React.Component {
  constructor(props) {
    super(props);

    this.propsDbToScreenMap = {
      'text': 'Indicator',
      'self_score': 'Self score',
      'avg_score': 'Avg score',
      'avg_norm': 'Avg norm',
      'self_gap': 'Self gap',
      'avg_gap': 'Avg gap'
    };
    this.columns = ['text', 'self_score', 'avg_score', 'avg_norm', 'self_gap', 'avg_gap'];
  }

  render() {
    return (
      <div style={{'page-break-inside': 'avoid'}} className="statistics">
        <Table
          data={this.props.data}
          columns={this.columns}
          propsDbToScreenMap={this.propsDbToScreenMap}
        />
      </div>
    );
  }
}

Statistics.defaultProps = {
  data: []
};

export default Statistics;