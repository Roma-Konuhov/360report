import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { fetch } from '../helpers/ajax';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      revieweesByConsultants: [],
      revieweesByManagers: [],
      peopleRelations: []
    };
  }

  loadData() {
    this.loadRevieweesByConsultants();
    this.loadRevieweesByManagers();
    this.loadPeopleRelations();
  }

  loadRevieweesByConsultants() {
    return fetch('/reviewees-by-consultants').then(data => {
      this.setState({ revieweesByConsultants: data });
    }, reason => {
      //console.log(reason);
    });
  }

  loadRevieweesByManagers() {
    return fetch('/reviewees-by-managers').then(data => {
      this.setState({ revieweesByManagers: data });
    }, reason => {
      //console.log(reason);
    });
  }

  loadPeopleRelations() {
    return fetch('/people-relations').then(data => {
      this.setState({ peopleRelations: data });
    }, reason => {
      //console.log(reason);
    });
  }

  componentDidMount() {
    this.loadData();
    //window.addEventListener('load:data', this.loadData.bind(this), { once: true });
  }

  render() {
    var props = Object.assign({}, this.state, { loadData: this.loadData.bind(this) });

    return (
      <div>
        <Header {...this.state} />
        {this.props.children && React.cloneElement(this.props.children, props)}
        <Footer/>
      </div>
    );
  }
}

export default App;
