module.exports = function (fileInfo, api, options) {
  console.log(fileInfo.source)

  // api.
  // transform `fileInfo.source` here
  // ...
  // return changed source
  return fileInfo.source;
};