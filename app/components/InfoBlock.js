import React from 'react';

class InfoBlock extends React.Component {
  render() {
    return (
      <div className="info-block">
        <p>
          This confidential 360° feedback report has been generated using information gathered both from yourself and from the cremates who have provided feedback. It summarizes how you have been rated by your various (groups of) raters on each of the relevant competencies.
        </p>
        <p>
          In using this report it is important to remember that the information it contains is a reflection of different peoples’ perceptions of you at a particular point in time. It does not represent some absolute, unchanging, all consuming truth. Nevertheless, the detailed analysis it permits can enable you to achieve new insights into your own strengths, and also alert you to aspects of your behavior which could be proving a hindrance to your success in both the short and longer term.
        </p>
        <p>
          If the number of responses that were completed are less than the minimum number, then the validity of this report is reduced and we would recommend further feedback.
        </p>
        <p>
          It is recommended that you read through your report with a Line manager.
        </p>
      </div>
    );
  }
}

export default InfoBlock;