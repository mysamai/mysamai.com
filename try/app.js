/* global mysam, KeenAsync */
KeenAsync.ready(function () {
  // Configure a client instance
  // This is your actual Project ID and Write Key
  var keen = new KeenAsync({
    projectId: '5a8f8885c9e77c00018ecd51',
    writeKey: '675FA3E5593D0B3FFAD8A8771B9177403C4F6411F66B28825DF3498FBE2A730C690697BD7E74D8FF35B4210C87AB8F63445D1226FD13403ACADDBDBE2A39303F992FBF1BB06B49E89B17B8A2AF8047A5C80723789F34A92A4A6318BC42364122'
  });

  var sam = mysam(document.getElementById('content'));
  var app = sam.app;
  var metadata = {
    ip_address: '${keen.ip}',
    user_agent: '${keen.user_agent}'
  };

  // Record an event
  keen.recordEvent('pageviews', metadata);

  window.onerror = function (msg, url, lineNo, columnNo, error) {
    keen.recordEvent('error', {
      msg: msg,
      url: url,
      lineNo: lineNo,
      columNo: columnNo,
      error: error,
      metadata: metadata
    });
  };

  app.service('classify').on('created', function (classification) {
    var classify = Object.assign({
      metadata: metadata
    }, classification);

    keen.recordEvent('classification', {
      metadata: metadata,
      text: classification.text
    });
    keen.recordEvent('classify', classify);
  });

  app.service('trainings').on('created', function (training) {
    keen.recordEvent('trainings', training);
  });
});
