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
    return this.fetch('/reviewees-by-consultants').then(data => {
      this.setState({ revieweesByConsultants: data });
    }, reason => {
      //console.log(reason);
    });
  }

  loadRevieweesByManagers() {
    return this.fetch('/reviewees-by-managers').then(data => {
      this.setState({ revieweesByManagers: data });
    }, reason => {
      //console.log(reason);
    });
  }

  loadPeopleRelations() {
    return this.fetch('/people-relations').then(data => {
      this.setState({ peopleRelations: data });
    }, reason => {
      //console.log(reason);
    });
  }

  componentDidMount() {
    this.loadData();
    window.addEventListener('load:data', this.loadData.bind(this), false);
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
