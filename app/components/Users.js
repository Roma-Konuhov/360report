import React, { Component } from 'react';
import Table from './Grid/Table';

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.propsDbToScreenMap = {
      'name': 'Name',
      'email': 'Email',
    };
    this.columns = ['name', 'email'];
  }

  componentWillMount() {
    this.setState({ data: this.props.users });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.users });
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

export default Users;