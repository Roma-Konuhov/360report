import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from './Table';

class RevieweesByConsultant extends Component {
  constructor(props) {
    super(props);

    this.propsDbToScreenMap = {
      'username': 'Reviewee',
      'responders_number': 'Number of responders'
    };
    this.columns = ['username', 'responders_number'];
  }

  render() {
    return (
      <div className="container">
        <Table
          data={this.props.data}
          columns={this.columns}
          propsDbToScreenMap={this.propsDbToScreenMap}
          cssClasses="table-hover main"
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.entities.revieweesByConsultants
  }
};

export default connect(
  mapStateToProps
)(RevieweesByConsultant);