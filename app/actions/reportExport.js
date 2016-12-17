
function success(message) {
  return {
    type: 'EXPORT_SUCCESS',
    messages: Array.isArray(message) ? message : [message]
  };
}

function fail(message) {
  return {
    type: 'REQUEST_FAILURE',
    messages: Array.isArray(message) ? message : [message]
  };
}

export function exportConsultantReportToPdf(id) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/consultant/export/pdf/${id}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatch({ type: 'RECEIVE_REQUEST' });
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(success(json.message));
          window.location = '/export/' + json.filename;
        });
      } else {
        return response.json().then((json) => {
          dispatch(fail(json.message));
        });
      }
    });
  };
}

export function exportConsultantReportToPng(id) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/consultant/export/png/${id}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatch({ type: 'RECEIVE_REQUEST' });
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(success(json.message));
          window.location = '/export/' + json.filename;
        });
      } else {
        return response.json().then((json) => {
          dispatch(fail(json.message));
        });
      }
    });
  };
}

export function exportManagerReportToPdf(id) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/manager/export/pdf/${id}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatch({ type: 'RECEIVE_REQUEST' });
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(success(json.message));
          window.location = '/export/' + json.filename;
        });
      } else {
        return response.json().then((json) => {
          dispatch(fail(json.message));
        });
      }
    });
  };
}

export function exportManagerReportToPng(id) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/manager/export/png/${id}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatch({ type: 'RECEIVE_REQUEST' });
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(success(json.message));
          window.location = '/export/' + json.filename;
        });
      } else {
        return response.json().then((json) => {
          dispatch(fail(json.message));
        });
      }
    });
  };
}

