
function success(message) {
  return {
    type: 'PUBLISH_SUCCESS',
    messages: Array.isArray(message) ? message : [message]
  };
}

function fail(message) {
  return {
    type: 'REQUEST_FAILURE',
    messages: Array.isArray(message) ? message : [message]
  };
}

export function publishReport(revieweeId) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/publish/reviewee/${revieweeId}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatch({ type: 'RECEIVE_REQUEST' });
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(success(json.message));
        });
      } else if (response.status == 401) {
        return response.json().then((json) => {
          location.href = json.authUrl;
        });
      } else {
        return response.json().then((json) => {
          dispatch(fail(json.message));
        });
      }
    });
  };
}

export function publishReportBulk(lmId) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/publish/subordinates/${lmId}`, {
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

export function publishAllReports() {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch('/publish/all', {
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

