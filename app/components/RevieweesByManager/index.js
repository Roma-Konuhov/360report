import React, { Component } from 'react';
import Table from '../Grid/Table';

class RevieweesByManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.propsDbToScreenMap = {
      'username': 'Reviewee',
      'responders_number': 'Number of responders'
    };
    this.columns = ['username', 'responders_number'];
  }

  componentWillMount() {
    this.setState({ data: this.props.revieweesByManagers });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.revieweesByManagers });
  }

  onRowClick(row, idx, e) {
    console.log(row, idx, e)
  }

  render() {
    return (
      <div className="container">
        <Table
          data={this.state.data}
          columns={this.columns}
          propsDbToScreenMap={this.propsDbToScreenMap}
          hoverable="true"
        />
      </div>
    );
  }
}

export default RevieweesByManager;