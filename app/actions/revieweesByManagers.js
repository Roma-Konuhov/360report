
function success(items) {
  return {
    type: 'ADD_REVIEWEES_BY_MANAGERS',
    items
  };
}

function fail(message) {
  return {
    type: 'REQUEST_FAILURE',
    messages: Array.isArray(message) ? message : [message]
  };
}

export function fetchRevieweesByManagers() {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch('/reviewees-by-managers', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatch({ type: 'RECEIVE_REQUEST' });
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(success(json));
        });
      } else {
        return response.json().then((json) => {
          dispatch(fail(json));
        });
      }
    });
  };
}

