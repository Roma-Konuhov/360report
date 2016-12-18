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
      'lm_name': 'LM Name',
      'lm_email': 'LM Email',
    };
    this.columns = ['name', 'email', 'lm_name', 'lm_email'];
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
          cssClasses="main"
        />
      </div>
    );
  }
}

export default Users;