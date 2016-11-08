import React from 'react';
import Header from './Header';
import Footer from './Footer';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      revieweesByConsultants: [],
      revieweesByManagers: [],
      peopleRelations: []
    };
    this.loadRevieweesByConsultants = this.loadRevieweesByConsultants.bind(this);
    this.loadRevieweesByManagers = this.loadRevieweesByManagers.bind(this);
    this.loadPeopleRelations = this.loadPeopleRelations.bind(this);
  }

  loadData() {
    this.loadRevieweesByConsultants();
    this.loadRevieweesByManagers();
    this.loadPeopleRelations();
  }

  fetch(url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onload = xhr.onerror = function() {
        try {
          var result = JSON.parse(xhr.response);
        } catch(e) {
          return reject();
        }
        if (this.status == 200) {
          if (result.status === 'ok') {
            return resolve(result.data);
          } else {
            return reject(result.message);
          }
        } else {
          return reject(result.message);
        }
      };
      xhr.send();
    });
  }

  loadRevieweesByConsultants() {
    console.log('loadRevieweesByConsultants')
    return this.fetch('/reviewees-by-consultants').then(data => {
      console.log('results: ', data)
      this.setState({ revieweesByConsultants: data });
    }, reason => {
      //console.log(reason);
    });
  }

  loadRevieweesByManagers() {
    console.log('loadRevieweesByManagers')
    return this.fetch('/reviewees-by-managers').then(data => {
      console.log('results: ', data)
      this.setState({ revieweesByManagers: data });
    }, reason => {
      //console.log(reason);
    });
  }

  loadPeopleRelations() {
    console.log('loadPeopleRelations')
    return this.fetch('/people-relations').then(data => {
      console.log('results: ', data)
      this.setState({ peopleRelations: data });
    }, reason => {
      //console.log(reason);
    });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    var props = Object.assign({}, this.state, { loadData: this.loadData });

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
