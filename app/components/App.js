import React from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import { fetchRevieweesByConsultants } from '../actions/revieweesByConstultants';
import { fetchRevieweesByManagers } from '../actions/revieweesByManagers';
import { fetchPeopleRelations } from '../actions/peopleRelations';
import { fetchUsers } from '../actions/users';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {}
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchRevieweesByConsultants());
    this.props.dispatch(fetchRevieweesByManagers());
    this.props.dispatch(fetchPeopleRelations());
    this.props.dispatch(fetchUsers());
    //window.addEventListener('load:data', this.loadData.bind(this), { once: true });
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
    users: state.entities.users
  };
};


export default connect(
  mapStateToProps
)(App);
