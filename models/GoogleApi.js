var fs = require('fs');
var http = require('http');
var config = require('../config');
var logger = require('../lib/logger')(module);
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var TOKEN_DIR = config.get('google:api:credentials:directory');
var TOKEN_PATH = TOKEN_DIR + config.get('google:api:credentials:filename');
var SECRET_DIR = config.get('google:api:secret:directory');
var SECRET_PATH = SECRET_DIR + config.get('google:api:secret:filename');


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var redirectUrl = credentials.web.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      logger.info('Authorization failed');
      getNewToken(oauth2Client, callback);
    } else {
      logger.info('Authorization success. Token: %j', token);
      oauth2Client.credentials = JSON.parse(token);
      google.options({
        auth: oauth2Client
      });
      callback(oauth2Client);
    }
  });
}

exports.authorize = authorize;

exports.checkAuth = function() {
  try {
    const credentials = fs.readFileSync(SECRET_PATH);

    return isAuthorized(JSON.parse(credentials));
  } catch (e) {
    logger.error('Error loading client secret file: ' + e.message);
    return {status: 'error', message: e.message};
  }
};

exports.approveAuth = function(code, cb) {
  try {
    var credentials = JSON.parse(fs.readFileSync(SECRET_PATH));
    logger.info('credentials', credentials);
    var clientSecret = credentials.web.client_secret;
    var clientId = credentials.web.client_id;
    var redirectUrl = credentials.web.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    return saveToken(oauth2Client, code, cb);
  } catch (e) {
    logger.error('Error loading client secret file: ' + e.message);
    return { message: e.message };
  }
};

function isAuthorized(credentials) {
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var redirectUrl = credentials.web.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  try {
    // Check if we have previously stored a token.
    // If file doesn't exist then exception will be thrown
    const token = fs.readFileSync(TOKEN_PATH, { encoding: 'utf-8' });
    // else token exists and can be used
    logger.info('Authorization success. Token: %j', token);
    oauth2Client.credentials = JSON.parse(token);
    google.options({
      auth: oauth2Client
    });

    return { status: 'ok' };

  } catch (e) {
    logger.info('Authorization failed');
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'online',
      scope: config.get('google:api:scopes')
    });
    logger.info('Generate auth URL %s', authUrl);

    return { status: 'unauthorized', authUrl: authUrl };
  }
}

/**
 * Store new token
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {String} code Access key
 * @param {Function} callback The callback to call with the authorized
 *     client.
 */
function saveToken(oauth2Client, code, callback) {
  logger.info('Save token %s', code);
  oauth2Client.getToken(code, function(err, token) {
    if (err) {
      return callback(err);
    }
    oauth2Client.credentials = token;
    storeToken(token);
    google.options({
      auth: oauth2Client
    });
    callback(null, oauth2Client);
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  logger.info('Token stored to ' + TOKEN_PATH);
}

/**
 * Save uploaded credentials on the disk
 *
 * @param filepath
 * @param cb
 */
exports.storeCredentials = function(filepath, cb) {
  try {
    fs.mkdirSync(SECRET_DIR);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
  var rs = fs.createReadStream(filepath);
  var ws = fs.createWriteStream(SECRET_PATH);

  rs.pipe(ws, { end: false });
  rs.on('end', function() {
    ws.end();
    cb(null, { status: 'ok' });
  });
};

/**
 * Call an Apps Script function to list the folders in the user's root
 * Drive folder.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function callAppsScript(scriptName, params, cb, auth) {
  logger.info('Google API call "%s" with params %j', scriptName, params);
  var script = google.script('v1');

  // Make the API request. The request object is included here as 'resource'.
  script.scripts.run({
    auth: auth,
    resource: {
      function: scriptName,
      parameters: params,
      devMode: true
    },
    scriptId: config.get('google:api:scriptId')
  }, function(err, resp) {
    if (hasErrors(err, resp)) {
      return cb(handleErrors(err, resp));
    } else {
      const result = resp.response && resp.response.result || null;
      logger.info('Google API call result %j', result);
      return cb(null, result);
    }
  });
}

/**
 * Check if response contains error
 *
 * @param err
 * @param resp
 * @returns {*}
 */
function hasErrors(err, resp) {
  return err || resp.error;
}

/**
 * Returns error message from the appropriate part of the response
 *
 * @param err
 * @param resp
 * @returns {*}
 */
function handleErrors(err, resp) {
  if (err) {
    // The API encountered a problem before the script started executing.
    logger.error('The API returned an error: ' + err);
    return err;
  }
  if (resp.error) {
    // The API executed, but the script returned an error.

    // Extract the first (and only) set of error details. The values of this
    // object are the script's 'errorMessage' and 'errorType', and an array
    // of stack trace elements.
    var error = resp.error.details[0];
    logger.error('Script error message: ' + error.errorMessage);
    return {
      message: error.errorMessage
    };

    // logger.error('Script error message: ' + error.errorMessage);
    // logger.error('Script error stacktrace:');
    //
    // if (error.scriptStackTraceElements) {
    //   // There may not be a stacktrace if the script didn't start executing.
    //   for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
    //     var trace = error.scriptStackTraceElements[i];
    //     console.log('\t%s: %s', trace.function, trace.lineNumber);
    //   }
    // }
  }
}


// ====================== API ======================

/**
 * Proxy function which performs authorizations with the
 * following calling of the original function
 *
 * @param scriptName
 * @param params
 */
function call(scriptName, params, cb) {
  fs.readFile(SECRET_PATH, function processClientSecrets(err, content) {
    if (err) {
      logger.error('Error loading client secret file: ' + err);
      return cb(err);
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Apps Script Execution API.
    authorize(JSON.parse(content), callAppsScript.bind(null, scriptName, params, cb));
  });
}

/**
 * Uploads file to the specific directory on the Google Drive
 * Passes ID of the uploaded file to the callback function
 *
 * @param {Object} params {
 *   srcFilepath: String, // path to local file
 *   destFilename: String,  // name of the dest file on Google Drive
 *   destDirectory: String  // ID of the parent directory on Google Drive
 * }
 * @param {Function} cb
 * @param {String} auth
 */
exports.upload = function(params, cb, auth) {
  logger.info('Google API upload file with params %j', params);
  var drive = google.drive({ version: 'v3', auth: auth });
  var parentDirectories = !!params.destDirectory ? [params.destDirectory] : [];
  logger.info('Google API upload final params %j', {
    name: params.destFilename,
    mimeType: 'application/pdf',
    parents: parentDirectories,
  });

  drive.files.create({
    resource: {
      name: params.destFilename,
      mimeType: 'application/pdf',
      parents: parentDirectories,
    },
    media: {
      mimeType: 'application/pdf',
      body: fs.createReadStream(params.srcFilepath) // read streams are awesome!
    }
  }, function(err, file) {
    if (err) {
      logger.error('Error during uploading of the file "%s" to directory "%s"', params.srcFilepath, params.destDirectory);
      return cb(err);
    }
    logger.info('File "%s" was uploaded to directory "%s" successfully: %j', params.srcFilepath, params.destDirectory, file);
    cb(null, file.id);
  });
};

/**
 * Creates directory on the Google Drive
 * Passes ID of the created directory to the callback function
 *
 * @param directory
 * @param cb
 * @param auth
 */
exports.createFolder = function(directory, cb, auth) {
  logger.info('Google API create folder %s', directory);
  var metaData = {
    'name': directory,
    'mimeType': 'application/vnd.google-apps.folder'
  };

  var drive = google.drive({ version: 'v3', auth: auth });
  drive.files.create({
    resource: metaData,
  }, function(err, file) {
    if (err) {
      logger.error('Error during creating of directory "%s"', directory);
      return cb(err);
    }
    logger.error('Directory "%s" was created successfully', directory);
    cb(null, file.id);
  })
};

/**
 * Creates directory path on the Google Drive. If parent directory
 * doesn't exist then it will be created also.
 * Directories which exist are skipped.
 *
 * Passes ID of the created directory to the callback function
 *
 * @param directory
 * @param cb
 */
exports.createPath = function(directory, cb) {
  call('apiCreateDir', directory, cb);
};

/**
 * Creates directory path exists on the Google Drive.
 *
 * Passes true to the callback function if exists
 *
 * @param path
 * @param cb
 */
exports.isDirExists = function(path, cb) {
  call('apiIsDirExists', path, cb);
};

/**
 * Creates directory path exists on the Google Drive.
 *
 * Passes true to the callback function if exists
 *
 * @param path
 * @param cb
 */
exports.isFileExists = function(path, cb) {
  call('apiIsFileExists', path, cb);
};

/**
 * Shares the directory "lmDirectory" which is located in the "reportDirectory"
 * with LM by sending invitation on "email" address
 *
 * @param {String} reportDirectory Root directory wth reports
 * @param {String} lmDirectory LM directory with reports of all his subordinates
 * @param {String} email LM email address
 * @param cb
 */
exports.shareDirectory = function(reportDirectory, lmDirectory, email, cb) {
  call('apiShareDirectory', [reportDirectory, lmDirectory, email], cb);
};

