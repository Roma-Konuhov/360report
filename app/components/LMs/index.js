import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import Table from './Table';

class LMs extends Component {
  constructor(props) {
    super(props);

    this.propsDbToScreenMap = {
      'name': 'Name',
      'email': 'Email',
      'subordinate_number': 'Subordinates number',
    };
    this.columns = ['name', 'email', 'subordinate_number'];
  }

  getDataWithSelectedItems() {
    const { selectedIds } = this.props;
    let result = [], detailsData, origData;

    _.each(this.props.data, ((data) => {
      if (selectedIds.indexOf(data.data._id) > -1) {
        origData = _.clone(data);
        origData.active = true;
        result.push(origData);
        detailsData = _.clone(data);
        // push marked duplicate to show as details
        detailsData.selected = true;
        result.push(detailsData);
      } else {
        result.push(data);
      }
    }));

    return result;
  }

  render() {
    return (
      <div className="container">
        <Table
          data={this.getDataWithSelectedItems()}
          columns={this.columns}
          propsDbToScreenMap={this.propsDbToScreenMap}
          cssClasses="table-hover main lms"
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedIds: state.appState.pages.lms.selectedIds,
    data: state.entities.lms
  }
};

export default connect(
  mapStateToProps
)(LMs);