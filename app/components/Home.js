import React from 'react';
import { connect } from 'react-redux'
import FileUploadContainer from './FileUploadContainer';
import Display from './Display';
import Spinner from './Spinner';

class Home extends React.Component {
  render() {
    return (
      <div className="container">
        <Display if={this.props.httpRequestCounter}>
          <Spinner />
        </Display>
        <FileUploadContainer {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    httpRequestCounter: state.http.requestCounter
  };
};

export default connect(mapStateToProps)(Home);
