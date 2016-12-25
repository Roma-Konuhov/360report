import React from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import Display from './Display';
import Messages from './Messages';
import Spinner from './Spinner';

class Header extends React.Component {
  render() {
    const active = { borderBottomColor: '#3f51b5' };

    return (
      <nav className="navbar navbar-default navbar-static-top">
        <Display if={this.props.httpRequestCounter}>
          <Spinner />
        </Display>
        <div className="container">
          <Messages messages={this.props.messages}/>
          <Display if={this.props.error} nowrap="true">
            <Error error={this.props.error} />
          </Display>
          <div id="navbar" className="navbar-collapse collapse">
            <IndexLink to="/" className="logo"></IndexLink>
            <ul className="nav navbar-nav">
              <Display if={this.props.revieweesByConsultants} nowrap="true">
                <li><Link to="/reviewees-by-consultants" activeStyle={active}>For Constultans</Link></li>
              </Display>
              <Display if={this.props.revieweesByManagers} nowrap="true">
                <li><Link to="/reviewees-by-managers" activeStyle={active}>For Managers</Link></li>
              </Display>
              <Display if={this.props.peopleRelations} nowrap="true">
                <li><Link to="/people-relations" activeStyle={active}>Relations</Link></li>
              </Display>
              <Display if={this.props.users} nowrap="true">
                <li><Link to="/users" activeStyle={active}>Users</Link></li>
              </Display>
              <Display if={this.props.lms} nowrap="true">
                <li><Link to="/lms" activeStyle={active}>LMs</Link></li>
              </Display>
            </ul>
            <div className="review-reports-title"><div className="review-subtitle">360 review</div><div className="reports-subtitle">reports</div></div>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user,
    messages: state.messages,
    httpRequestCounter: state.http.requestCounter,
  };
};

export default connect(
  mapStateToProps,
)(Header);