import React, { PropTypes, Component } from 'react';

class PersonalPlan extends Component {
  render() {
    return (
      <div id="personal-dev-plan">
        <h4>Personal Development Plan</h4>
        <table>
          <thead>
            <tr>
              <td></td>
              <td>Competency to develop</td>
              <td>Development activities</td>
              <td>Expected result</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span>Cogniance DNA</span></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><span>Leadership</span></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><span>Professional</span></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default PersonalPlan;