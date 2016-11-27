import React from 'react';
import { fetch } from '../helpers/ajax';
import Table from './Grid/Table';

class UserData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      data: []
    };

    this.propsDbToScreenMap = {
      '': '',
      'minimum': 'Minimum',
      'anticipated': 'Anticipated',
      'completed': 'Completed'
    };
    this.columns = ['', 'minimum', 'anticipated', 'completed'];
  }

  loadUser() {
    var id = this.props.id;

    return fetch(`/user/${id}`).then(user => {
      this.setState({ user: user });
    }, reason => {
      //console.log(reason);
    });
  }

  loadData() {
    this.setState({ data: [
      {'': 'Self', minimum: 1, anticipated: 1, completed: 1},
      {'': 'Manager(s)', minimum: 1, anticipated: 2, completed: 2},
      {'':'Collegues', minimum: 1, anticipated: 2, completed: 2},
      {'': 'Direct reports', minimum: 1, anticipated: 2, completed: 2},
      {'': 'Totals', minimum: 1, anticipated: 2, completed: 2},
    ]});
  }

  componentDidMount() {
    this.loadUser();
    this.loadData();
  }

  render() {
    return (
      <div className="user-data">
        <h2>{this.state.user.name}, H2 2016</h2>
        <Table
          data={this.state.data}
          columns={this.columns}
          propsDbToScreenMap={this.propsDbToScreenMap}
        />
      </div>
    );
  }
}

export default UserData;