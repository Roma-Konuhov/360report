import React, { PropTypes, Component } from 'react';

class Suggestions extends Component {
  render() {
    return (
      <div className="suggestions">
        <h4>{this.props.title}</h4>
        <ul>
          {this.props.data.map((item, idx) => (
            !item.suggestion ? null :
            <li key={`suggest-${idx}`}>{item.suggestion}
              {item.allow_to_share ? ` (${item.responder})` : ''}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Suggestions;