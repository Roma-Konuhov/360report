import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from './Grid/Table';

class Relations extends Component {
  constructor(props) {
    super(props);

    this.propsDbToScreenMap = {
      'responder': 'Responder',
      'reviewee': 'Reviewee',
      'relation': 'Relation',
      'responderEmail': 'Responder email',
      'revieweeEmail': 'Reviewee email',
    };
    this.columns = ['responder', 'responderEmail', 'reviewee', 'revieweeEmail', 'relation'];
  }

  render() {
    return (
      <div className="container">
        <Table
          data={this.props.data}
          columns={this.columns}
          propsDbToScreenMap={this.propsDbToScreenMap}
          cssClasses="main"
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.entities.peopleRelations
  }
};

export default connect(
  mapStateToProps
)(Relations);