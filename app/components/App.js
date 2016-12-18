import React from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import { fetchRevieweesByConsultants } from '../actions/revieweesByConstultants';
import { fetchRevieweesByManagers } from '../actions/revieweesByManagers';
import { fetchPeopleRelations } from '../actions/peopleRelations';
import { fetchUsers } from '../actions/users';
import { fetchLMs } from '../actions/lms';
import { clearAppState } from '../actions/appState';

class App extends React.Component {

  componentDidMount() {
    this.props.dispatch(fetchRevieweesByConsultants());
    this.props.dispatch(fetchRevieweesByManagers());
    this.props.dispatch(fetchPeopleRelations());
    this.props.dispatch(fetchUsers());
    this.props.dispatch(fetchLMs());
  }

  componentWillUpdate(nextProps) {
    if (nextProps.appState.refresh) {
      this.props.dispatch(clearAppState());
    }
    switch (nextProps.appState.refresh) {
      case 'all':
        this.props.dispatch(fetchPeopleRelations());
        this.props.dispatch(fetchRevieweesByManagers());
        this.props.dispatch(fetchRevieweesByConsultants());
        this.props.dispatch(fetchUsers());
        this.props.dispatch(fetchLMs());
        break;
      case 'people_relations':
        this.props.dispatch(fetchPeopleRelations());
        break;
      case 'manager_report':
        this.props.dispatch(fetchRevieweesByManagers());
        break;
      case 'consultant_report':
        this.props.dispatch(fetchRevieweesByConsultants());
        break;
      case 'users':
        this.props.dispatch(fetchUsers());
        break;
      case 'lms':
        this.props.dispatch(fetchLMs());
        break;
    }
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        {this.props.children && React.cloneElement(this.props.children, this.props)}
        <Footer/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    revieweesByConsultants: state.entities.revieweesByConsultants,
    revieweesByManagers: state.entities.revieweesByManagers,
    peopleRelations: state.entities.peopleRelations,
    users: state.entities.users,
    lms: state.entities.lms,
    appState: state.appState,
    report: state.report
  };
};


export default connect(
  mapStateToProps
)(App);
