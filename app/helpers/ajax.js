function fetch(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = xhr.onerror = function() {
      try {
        var result = JSON.parse(xhr.response);
      } catch(e) {
        return reject();
      }
      if (this.status == 200) {
        if (result.status === 'ok') {
          return resolve(result.data);
        } else {
          return reject(result.message);
        }
      } else {
        return reject(result.message);
      }
    };
    xhr.send();
  });
};

export {fetch};