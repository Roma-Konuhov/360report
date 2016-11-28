module.exports = function(res, error) {
  res.status(error.status);

  //if (res.req.headers['x-requested-with'] === 'XMLHttpRequest') {
    res.json(error);
  // } else {
  //   res.render('error', { error: error });
  // }
};
