function autoRefreshFn({ time = 10000, fn = () => {} }) {
  setInterval(function () {
    // Mark that we're in auto refresh mode
    window.isAutoRefresh = true;
    fn();
    // Reset the flag after a short delay
    setTimeout(function () {
      window.isAutoRefresh = false;
    }, 100);
  }, time);
}

// Override $.post to automatically add sessionKeepAlive for auto refresh
$(document).ready(function () {
  var originalPost = $.post;
  $.post = function (url, data, success, dataType) {
    // If it's an API call and we're in auto refresh mode
    if (url === "/api" && window.isAutoRefresh && typeof data === "string") {
      try {
        var obj = JSON.parse(data);
        obj.sessionKeepAlive = false;
        data = JSON.stringify(obj);
      } catch (e) {
        // If parsing fails, use original data
      }
    }
    return originalPost.call(this, url, data, success, dataType);
  };
});

$(document).ajaxError(function (event, request, settings) {
  var obj = JSON.parse(request.responseText);
  // Handle 401 - No active Session
  if (request.status === 401 || obj.error === "No active Session") {
    window.top.location.href = "login.html";
    return;
  }
  // Handle 403 - invalid rights
  if (request.status === 403 || obj.msg === "invalid rights") {
    window.top.location.href = "login.html";
    return;
  }
  // Handle 400 - Invalid command/Command failed
  if (request.status === 400) {
    if (obj.error) {
      ffunc(obj.error);
    }
    return;
  }
  // Handle other errors
  if (obj.msg) ffunc(obj.msg);
});
