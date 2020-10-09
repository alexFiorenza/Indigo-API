const handleError = (status, req, res, message = 'Unexpected error') => {
  if (status === 500) {
    return res.status(status).json({ status: false, message });
  } else if (status === 400 || status === 404) {
    return res.status(status).json({ status: false, message });
  }
};
const handleResponse = (status, req, res, data) => {
  return res.status(status).json({ status: true, response: data });
};

module.exports = {
  handleError,
  handleResponse,
};
