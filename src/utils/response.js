function respone(msg, data) {
  return {
    error: false,
    msg,
    data,
  };
}

function errorRespone(msg) {
  return {
    error: true,
    msg,
  };
}

module.exports = {
  respone,
  errorRespone,
};
