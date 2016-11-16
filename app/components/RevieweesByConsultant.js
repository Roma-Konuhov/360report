import React, { Component } from 'react';
import Table from './Grid/Table';

class RevieweesByConsultant extends Component {
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
    this.setState({ data: this.props.revieweesByConsultants });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.revieweesByConsultants });
  }

  onRowClick(row, e) {

    console.log(row, e)
  }

  render() {
    return (
      <div className="container">
        <Table
          data={this.state.data}
          columns={this.columns}
          propsDbToScreenMap={this.propsDbToScreenMap}
          onRowClick={this.onRowClick.bind(this)}
        />
      </div>
    );
  }
}

export default RevieweesByConsultant;