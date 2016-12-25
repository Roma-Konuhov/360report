
function success(message) {
  return {
    type: 'EMAIL_SUCCESS',
    messages: Array.isArray(message) ? message : [message]
  };
}

function fail(message) {
  return {
    type: 'REQUEST_FAILURE',
    messages: Array.isArray(message) ? message : [message]
  };
}

export function emailReport(revieweeId) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/email-to-lm/reviewee/${revieweeId}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatch({ type: 'RECEIVE_REQUEST' });
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(success(json.message));
        });
      } else {
        return response.json().then((json) => {
          dispatch(fail(json.message));
        });
      }
    });
  };
}

export function emailReportBulk(lmId) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/email-to-lm/subordinates/${lmId}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatch({ type: 'RECEIVE_REQUEST' });
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(success(json.message));
        });
      } else {
        return response.json().then((json) => {
          dispatch(fail(json.message));
        });
      }
    });
  };
}

