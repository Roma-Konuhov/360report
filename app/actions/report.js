
function successStatistics(items) {
  return {
    type: 'REPORT_ADD_STATISTICS',
    items
  };
}

function successAnswers(items) {
  return {
    type: 'REPORT_ADD_ANSWERS',
    items
  };
}

function successUser(item) {
  return {
    type: 'REPORT_ADD_USER',
    item
  };
}

function fail(message) {
  return {
    type: 'REQUEST_FAILURE',
    messages: Array.isArray(message) ? message : [message]
  };
}

export function fetchReportStatistics(entityType, id) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/${entityType}/statistics/${id}`, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatch({ type: 'RECEIVE_REQUEST' });
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(successStatistics(json));
        });
      } else {
        return response.json().then((json) => {
          dispatch(fail(json));
        });
      }
    });
  };
}

export function fetchReportAnswers(entityType, id) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/${entityType}/report/${id}`, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatch({ type: 'RECEIVE_REQUEST' });
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(successAnswers(json));
        });
      } else {
        return response.json().then((json) => {
          dispatch(fail(json));
        });
      }
    });
  };
}

export function fetchReportUser(id) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/user/${id}`, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => {
      dispatch({ type: 'RECEIVE_REQUEST' });
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(successUser(json));
        });
      } else {
        return response.json().then((json) => {
          dispatch(fail(json));
        });
      }
    });
  }
}
