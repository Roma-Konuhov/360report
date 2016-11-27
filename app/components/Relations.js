import React, { Component } from 'react';
import Table from './Grid/Table';

class Relations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.propsDbToScreenMap = {
      'responder': 'Responder',
      'reviewee': 'Reviewee',
      'relation': 'Relation',
      'responderEmail': 'Responder email',
      'revieweeEmail': 'Reviewee email',
    };
    this.columns = ['responder', 'responderEmail', 'reviewee', 'revieweeEmail', 'relation'];
  }

  componentWillMount() {
    this.setState({ data: this.props.peopleRelations });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.peopleRelations });
  }

  render() {
    return (
      <div className="container">
        <Table
          data={this.state.data}
          columns={this.columns}
          propsDbToScreenMap={this.propsDbToScreenMap} />
          hoverable="true"
      </div>
    );
  }
}

export default Relations;