import React from 'react';
import { fetch } from '../helpers/ajax';

class UserData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  loadUser() {
    var id = this.props.id;

    return fetch(`/user/${id}`).then(user => {
      this.setState({ user: user });
    }, reason => {
      //console.log(reason);
    });
  }

  componentDidMount() {
    this.loadUser();
  }

  render() {
    return (
      <div className="user-data">
        <h2>{this.state.user.name}, H2 2016</h2>
      </div>
    );
  }
}

export default UserData;