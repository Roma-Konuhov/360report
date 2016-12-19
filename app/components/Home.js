import React from 'react';
import FileUploadContainer from './FileUploadContainer';

class Home extends React.Component {
  render() {
    return (
      <div className="container">
        <FileUploadContainer {...this.props} />
      </div>
    );
  }
}

export default Home;
