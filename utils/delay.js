module.exports = function delay(time, shouldResolve = true) {
  return new Promise((resolve, reject) =>
    setTimeout(shouldResolve ? resolve : reject, time));
};

