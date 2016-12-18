
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

export function exportReportToPdf(entityType, id) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/${entityType}/export/pdf/${id}`, {
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

export function exportReportToPng(entityType, id) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/${entityType}/export/png/${id}`, {
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

/**
 * Downloader based on generators.
 * FIles are downloaded by interval
 * (by default 1 file/sec)
 *
 * @param filenames
 */
function multiDownload(filenames) {
  const getFilesIterator = function* () {
    while (filenames.length) {
      yield filenames.shift();
    }
  };
  const getFile = getFilesIterator();

  const timer = setInterval(function() {
    let filename = getFile.next().value;
    if (filename) {
      window.location = '/export/' + filename;
    } else {
      clearInterval(timer);
    }
  }, 1000);
}

export function exportReportBulkToPdf(entityType, id) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/${entityType}/export/bulk/pdf/${id}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatch({ type: 'RECEIVE_REQUEST' });
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(success(json.message));
          multiDownload(json.filenames);
        });
      } else {
        return response.json().then((json) => {
          dispatch(fail(json.message));
        });
      }
    });
  };
}

export function exportReportBulkToPng(entityType, id) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch(`/${entityType}/export/bulk/png/${id}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatch({ type: 'RECEIVE_REQUEST' });
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(success(json.message));
          multiDownload(json.filenames);
        });
      } else {
        return response.json().then((json) => {
          dispatch(fail(json.message));
        });
      }
    });
  };
}


