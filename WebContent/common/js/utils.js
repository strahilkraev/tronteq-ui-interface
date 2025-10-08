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

// Global variable to store user level
window.userLevel = null;

// Function to get user level from server
function getUserLevel(callback) {
  if (window.userLevel !== null) {
    callback(window.userLevel);
    return;
  }

  $.post(
    "/api",
    '{"service":"user","access":"get","command":"get level"}',
    function (data) {
      if (data.level !== undefined) {
        window.userLevel = data.level;
        callback(window.userLevel);
      } else {
        window.userLevel = 0; // Default to full access
        callback(window.userLevel);
      }
    }
  ).fail(function () {
    window.userLevel = 0; // Default to full access on error
    callback(window.userLevel);
  });
}

// Function to check if user is readonly (level 1)
function isAdminUser(callback) {
  getUserLevel(function (level) {
    window.userLevel = level;
    callback(level === 0);
  });
}

// Function to disable/hide editable elements for readonly users
function applyAdminRestrictions(callback) {
  isAdminUser(function (isAdmin) {
    if (isAdmin) {
      // show all buttons with edit/set/add/delete/update/change/apply actions
      var editButtons = document.querySelectorAll(".btn-admin-only");
      editButtons.forEach(function (button) {
        button.style.display = "block";
      });

      // Enable all text inputs, selects, and textareas
      var editableElements = document.querySelectorAll(".input-admin-only");
      editableElements.forEach(function (element) {
        element.disabled = false;
      });

      // Enable menu sections
      var menuSections = document.querySelectorAll(".menu-section");
      menuSections.forEach(function (section) {
        section.style.display = "block";
      });

      // Show all only-admin elements
      var onlyAdminElements = document.querySelectorAll(".only-admin");
      onlyAdminElements.forEach(function (element) {
        element.style.display = "block";
      });
    }

    // Call the callback function if provided
    // Pass isAdmin and userLevel to callback for convenience
    if (callback && typeof callback === "function") {
      callback(isAdmin, window.userLevel);
    }
  });
}

$(document).ajaxError(function (event, request, settings) {
  var obj = JSON.parse(request.responseText);

  // Handle 401 - No active Session
  if (request.status === 401 || obj.error === "No active Session") {
    window.top.location.href = "login.html";
    return;
  }
  // Handle 403 - invalid rights
  if (request.status === 403 || obj.msg === "invalid rights") {
    ffunc('"You do not have permission to access this page"');
    return;
  }

  // Handle other errors
  if (obj.msg) {
    ffunc(obj.msg);
    return;
  }
  ffunc(obj);
  return;
});

// Require login
function requireLogin() {
  //set username
  var cookies = document.cookie.split("; ");
  var found = false;
  for (var i in cookies) {
    if (cookies[i].split("=")[0].match("user")) {
      $("#username").text(cookies[i].split("=")[1]);
      found = true;
    }
  }

  if (!found)
    window.top.location.href =
      window.top.location.protocol +
      "//" +
      window.top.location.host +
      "/login.html";
}
