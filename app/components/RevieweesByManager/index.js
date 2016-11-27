import React, { Component } from 'react';
import Table from './Table';

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

  render() {
    return (
      <div className="container">
        <Table
          data={this.state.data}
          columns={this.columns}
          propsDbToScreenMap={this.propsDbToScreenMap}
          hoverable
        />
      </div>
    );
  }
}

export default RevieweesByManager;