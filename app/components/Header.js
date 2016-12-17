import React from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import Display from './Display';
import Messages from './Messages';
import {
  exportConsultantReportToPdf,
  exportConsultantReportToPng,
  exportManagerReportToPdf,
  exportManagerReportToPng,
} from '../actions/reportExport';

class Header extends React.Component {
  renderButtonExportToPdf() {
    let fnExportToPdf;

    if (this.props.location.pathname.match('consultant/report')) {
      fnExportToPdf = this.props.exportConsultantReportToPdf;
    } else if (this.props.location.pathname.match('manager/report')) {
      fnExportToPdf = this.props.exportManagerReportToPdf;
    } else if (this.props.location.pathname.match('reviewees-by-consultants')) {
      fnExportToPdf = this.props.exportConsultantReportToPdf;
    } else if (this.props.location.pathname.match('reviewees-by-managers')) {
      fnExportToPdf = this.props.exportManagerReportToPdf;
    }

    if (!fnExportToPdf) {
      return null;
    }

    return (<li><Link to="/export-pdf" onClick={fnExportToPdf}>Export PDF</Link></li>);
  }

  renderButtonExportToPng() {
    let fnExportToPng;

    if (this.props.location.pathname.match('consultant/report')) {
      fnExportToPng = this.props.exportConsultantReportToPng;
    } else if (this.props.location.pathname.match('manager/report')) {
      fnExportToPng = this.props.exportManagerReportToPng;
    } else if (this.props.location.pathname.match('reviewees-by-consultants')) {
      fnExportToPng = this.props.exportConsultantReportToPng;
    } else if (this.props.location.pathname.match('reviewees-by-managers')) {
      fnExportToPng = this.props.exportManagerReportToPng;
    }

    if (!fnExportToPng) {
      return null;
    }

    return (<li><Link to="/export-pdf" onClick={fnExportToPng}>Export PNG</Link></li>);
  }

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
              {this.renderButtonExportToPdf()}
              {this.renderButtonExportToPng()}
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
  exportConsultantReportToPdf: (e) => {
    e.preventDefault();
    dispatch(exportConsultantReportToPdf(ownProps.params.id));
  },
  exportConsultantReportToPng: (e) => {
    e.preventDefault();
    dispatch(exportConsultantReportToPng(ownProps.params.id));
  },
  exportManagerReportToPdf: (e) => {
    e.preventDefault();
    dispatch(exportManagerReportToPdf(ownProps.params.id));
  },
  exportManagerReportToPng: (e) => {
    e.preventDefault();
    dispatch(exportManagerReportToPng(ownProps.params.id));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);