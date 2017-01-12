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
              <td>
                <table className="subtable">
                  <tbody>
                    <tr><td>On-the-job activities, development work tasks:</td></tr>
                    <tr><td>Learning from others (coaching, mentoring):</td></tr>
                    <tr><td>Training, seminars, readings:</td></tr>
                  </tbody>
                </table>
              </td>
              <td>
                <table className="subtable">
                  <tbody>
                  <tr><td>S.M.A.R.T.:</td></tr>
                  <tr><td></td></tr>
                  <tr><td></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td><span>Leadership</span></td>
              <td></td>
              <td>
                <table className="subtable">
                  <tbody>
                    <tr><td>On-the-job activities, development work tasks:</td></tr>
                    <tr><td>Learning from others (coaching, mentoring):</td></tr>
                    <tr><td>Training, seminars, readings:</td></tr>
                  </tbody>
                </table>
              </td>
              <td>
                <table className="subtable">
                  <tbody>
                  <tr><td>S.M.A.R.T.:</td></tr>
                  <tr><td></td></tr>
                  <tr><td></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td><span>Professional</span></td>
              <td></td>
              <td>
                <table className="subtable">
                  <tbody>
                    <tr><td>On-the-job activities, development work tasks:</td></tr>
                    <tr><td>Learning from others (coaching, mentoring):</td></tr>
                    <tr><td>Training, seminars, readings:</td></tr>
                  </tbody>
                </table>
              </td>
              <td>
                <table className="subtable">
                  <tbody>
                  <tr><td>S.M.A.R.T.:</td></tr>
                  <tr><td></td></tr>
                  <tr><td></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default PersonalPlan;