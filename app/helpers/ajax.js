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
        return resolve(result);
      } else {
        return reject(result);
      }
    };
    xhr.send();
  });
};

export {fetch};