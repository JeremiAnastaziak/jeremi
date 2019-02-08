module.exports = function retry(fun, options = { timeout: 0, retries: 0 }) {
  return fun().catch((err) => {
    if (options.retries === 0) {
      throw err;
    } else {
      return new Promise((resolve, reject) => setTimeout(() =>
        retry(fun, {
          ...options,
          timeout: options.timeout,
          retries: options.retries - 1,
        })
          .then(resolve, reject), options.timeout));
    }
  });
}
