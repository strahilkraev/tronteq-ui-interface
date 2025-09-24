function autoRefreshFn({ time = 10000, fn = () => {} }) {
  setInterval(function () {
    // Mark that we're in auto refresh mode
    window.isAutoRefresh = true;
    console.log("autoRefreshFn", fn);
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
function isReadOnlyUser(callback) {
  getUserLevel(function (level) {
    callback(level === 1);
  });
}

// Function to disable/hide editable elements for readonly users
function applyReadOnlyRestrictions() {
  isReadOnlyUser(function (isReadOnly) {
    if (isReadOnly) {
      // Hide all buttons with edit/set/add/delete/update/change/apply actions
      var editButtons = document.querySelectorAll(
        'input[type="button"][value*="Set"], input[type="button"][value*="Add"], input[type="button"][value*="Delete"], input[type="button"][value*="Remove"], input[type="button"][value*="Update"], input[type="button"][value*="Change"], input[type="button"][value*="Apply"], input[type="button"][value*="Save"]'
      );
      editButtons.forEach(function (button) {
        button.style.display = "none";
      });

      // Disable all text inputs, selects, and textareas
      var editableElements = document.querySelectorAll(
        'input[type="text"], input[type="password"], input[type="number"], select, textarea'
      );
      editableElements.forEach(function (element) {
        element.disabled = true;
        element.style.backgroundColor = "#f5f5f5";
        element.style.cursor = "not-allowed";
      });

      // Disable checkboxes and radio buttons
      var checkboxes = document.querySelectorAll(
        'input[type="checkbox"], input[type="radio"]'
      );
      checkboxes.forEach(function (checkbox) {
        checkbox.disabled = true;
        checkbox.style.cursor = "not-allowed";
      });

      // Add readonly indicator if not already present
      if (!document.getElementById("readonly-indicator")) {
        var readonlyIndicator = document.createElement("div");
        readonlyIndicator.id = "readonly-indicator";
        readonlyIndicator.style.cssText =
          "position: fixed; top: 10px; right: 10px; background: #ff6b6b; color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; z-index: 9999;";
        readonlyIndicator.textContent = "READ ONLY MODE";
        document.body.appendChild(readonlyIndicator);
      }
    }
  });
}

// Function to apply restrictions to dynamically loaded content (for iframes)
function applyReadOnlyRestrictionsToIframe(iframe) {
  if (!iframe || !iframe.contentDocument) return;

  isReadOnlyUser(function (isReadOnly) {
    if (isReadOnly) {
      var doc = iframe.contentDocument;

      // Hide all buttons with edit/set/add/delete/update/change/apply actions
      var editButtons = doc.querySelectorAll(
        'input[type="button"][value*="Set"], input[type="button"][value*="Add"], input[type="button"][value*="Delete"], input[type="button"][value*="Remove"], input[type="button"][value*="Update"], input[type="button"][value*="Change"], input[type="button"][value*="Apply"], input[type="button"][value*="Save"]'
      );
      editButtons.forEach(function (button) {
        button.style.display = "none";
      });

      // Disable all text inputs, selects, and textareas
      var editableElements = doc.querySelectorAll(
        'input[type="text"], input[type="password"], input[type="number"], select, textarea'
      );
      editableElements.forEach(function (element) {
        element.disabled = true;
        element.style.backgroundColor = "#f5f5f5";
        element.style.cursor = "not-allowed";
      });

      // Disable checkboxes and radio buttons
      var checkboxes = doc.querySelectorAll(
        'input[type="checkbox"], input[type="radio"]'
      );
      checkboxes.forEach(function (checkbox) {
        checkbox.disabled = true;
        checkbox.style.cursor = "not-allowed";
      });
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
