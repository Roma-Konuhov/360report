
function success(message) {
  return {
    type: 'UPLOAD_SUCCESS',
    messages: Array.isArray(message) ? message : [message]
  };
}

function fail(messages) {
  return {
    type: 'UPLOAD_FAILURE',
    messages
  };
}

export function fileUploader(formData) {
  return (dispatch) => {
    dispatch({type: 'CLEAR_MESSAGES'});
    dispatch({type: 'SEND_REQUEST'});

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/upload", true);
      xhr.onload = xhr.onerror = function() {
        dispatch({type: 'RECEIVE_REQUEST'});
        try {
          var result = JSON.parse(xhr.response);
        } catch(e) {
          return reject('Error occurred during fetching');
        }
        if (this.status == 200) {
          return resolve(result.message);
        } else {
          return reject(result.message);
        }
      };
      xhr.send(formData);
    }).then((response) => {
      dispatch(success(response));
    }).catch(messages => {
      dispatch(fail(messages));
    });
  };
}


/*export function fileUploader(formData) {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SEND_REQUEST' });
    return fetch('/upload', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: formData
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
}*/
