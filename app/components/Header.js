import React from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import Display from './Display';
import Messages from './Messages';
import { exportPdf, exportPng } from '../actions/reportExport';

class Header extends React.Component {
  render() {
    const active = { borderBottomColor: '#3f51b5' };

    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="container">
          <Messages messages={this.props.messages}/>
          <Display if={this.props.error} nowrap="true">
            <Error error={this.props.error} />
          </Display>
          <div id="navbar" className="navbar-collapse collapse">
            <IndexLink to="/" className="logo"></IndexLink>
            <ul className="nav navbar-nav">
              <Display if={this.props.revieweesByConsultants} nowrap="true">
                <li><Link to="/reviewees-by-consultants" activeStyle={active}>By Constultans</Link></li>
              </Display>
              <Display if={this.props.revieweesByManagers} nowrap="true">
                <li><Link to="/reviewees-by-managers" activeStyle={active}>By Managers</Link></li>
              </Display>
              <Display if={this.props.peopleRelations} nowrap="true">
                <li><Link to="/people-relations" activeStyle={active}>Relations</Link></li>
              </Display>
              <Display if={this.props.users} nowrap="true">
                <li><Link to="/users" activeStyle={active}>Users</Link></li>
              </Display>
              <Display if={this.props.report.answers} nowrap="true">
                <li><Link to="/export-pdf" activeStyle={active} onClick={this.props.handleExportToPDF}>Export PDF</Link></li>
              </Display>
              <Display if={this.props.report.answers} nowrap="true">
                <li><Link to="/export-png" activeStyle={active} onClick={this.props.handleExportToPNG}>Export PNG</Link></li>
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
    messages: state.messages
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleExportToPDF: (e) => {
    e.preventDefault();
    dispatch(exportPdf(ownProps.params.id));
  },
  handleExportToPNG: (e) => {
    e.preventDefault();
    dispatch(exportPng(ownProps.params.id));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);