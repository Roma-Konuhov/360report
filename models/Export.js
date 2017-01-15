var _ = require('lodash');
var phantom = require("phantom");
//var pdf = require('html-pdf');
var logger = require('../lib/logger')(module);
var path = require('path');
var q = require('q');

exports.exportFile = function(url, filepath, cb = _.identity()) {
  var page, ph;

  logger.info('Filename to export: "%s"', filepath);
  phantom.create()
    .then(function (_ph) {
      ph = _ph;
      return ph.createPage();
    })
    .then(function (_page) {
      page = _page;
      return q.all([
        page.setting('loadImages', true),
        page.setting('localToRemoteUrlAccessEnabled', true),
        page.setting('javascriptEnabled', true),
        page.setting('loadPlugins', false),
        page.property("zoomFactor", 1),
          // page.property("viewportSize", { width: 1170, height: 1670  }),
        page.property("paperSize", {format: "A2", orientation: 'portrait', margin: '1cm'}),
      ]);
    })
    .then(function () {
      return page.open(url)
    })
    .then(function (status) {
      if (status === 'success') {
        return page.render(filepath);
      } else {
        throw 'File was not opened';
      }
    })
    .then(function () {
      ph.exit();
      cb(null, { filepath: filepath, filename: path.basename(filepath) });
    })
    .catch(function () {
      ph.exit();
      cb(err);
    });
};



/*
function nodeph(cb) {
  var phantom=require('node-phantom');

  phantom.create(function (error, ph) {
    ph.createPage(function (error, page) {
      page.settings = {
        loadImages: true,
        localToRemoteUrlAccessEnabled: true,
        javascriptEnabled: true,
        loadPlugins: false
      };
      var html = fs.readFileSync('./public/page.html');
      page.set('viewportSize', { width: 800, height: 600 });
      page.set('paperSize', { format: 'A4', orientation: 'portrait', border: '1cm' });
      page.set('content', html, function (error) {
        if (error) {
          console.log('Error setting content: ', error);
        }
      });

      page.onResourceRequested = function (rd, req) {
        console.log("REQUESTING: ", rd[0]["url"]);
      }
      page.onResourceReceived = function (rd) {
        rd.stage == "end" && console.log("LOADED: ", rd["url"]);
      }
      page.onLoadFinished = function (status) {
        page.render(url, function (error) {
          if (error) console.log('Error rendering PDF: %s', error);
          console.log("PDF GENERATED : ", status);
          ph.exit();
          cb && cb();
        });
      }
    });
  }, {phantomPath:require('phantomjs').path});
}*/
