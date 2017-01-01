import React from 'react';
import Table from './Grid/Table';
import Display from './Display';

class UserData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  loadData() {
    this.setState({ data: [
      {'': 'Self', minimum: 1, anticipated: 1, completed: 1},
      {'': 'Manager(s)', minimum: 1, anticipated: 2, completed: 2},
      {'': 'Collegues', minimum: 1, anticipated: 2, completed: 2},
      {'': 'Direct reports', minimum: 1, anticipated: 2, completed: 2},
      {'': 'Totals', minimum: 1, anticipated: 2, completed: 2},
    ]});
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <div className="user-data block">
        <Display if={this.props.user} nowrap="true">
          <h3>{this.props.user.name}, H2 2016</h3>
        </Display>
      </div>
    );
  }
}

export default UserData;