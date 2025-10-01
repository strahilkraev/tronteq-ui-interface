const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 3000;
const DEVICE_TYPE = process.env.DEVICE_TYPE || "2GE8FE";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Session middleware
app.use(
  session({
    secret: "roq-ui-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: false,
      sameSite: "lax",
    },
  })
);

// Route to serve test-api.html from root directory
app.get("/test-api.html", (req, res) => {
  const filePath = path.join(__dirname, "test-api.html");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("File not found");
  }
});

// Route to serve login.html from common directory
app.get("/login.html", (req, res) => {
  const filePath = path.join(__dirname, "WebContent", "common", "login.html");
  if (fs.existsSync(filePath)) {
    // Read and serve the HTML file with device-specific configuration
    const htmlContent = fs.readFileSync(filePath, "utf8");

    // Inject device-specific basic_jscript.js
    const deviceScriptPath = `/${DEVICE_TYPE}/basic_jscript.js`;
    let modifiedContent = htmlContent.replace(
      'src="/basic_jscript.js"',
      `src="${deviceScriptPath}"`
    );

    // Fix other static file paths
    modifiedContent = modifiedContent.replace(
      'href="/basic_layout.css"',
      'href="/common/basic_layout.css"'
    );
    modifiedContent = modifiedContent.replace(
      'src="/js/jquery-3.7.1.min.js"',
      'src="/common/js/jquery-3.7.1.min.js"'
    );
    modifiedContent = modifiedContent.replace(
      'src="/js/utils.js"',
      'src="/common/js/utils.js"'
    );
    modifiedContent = modifiedContent.replace(
      'src="/Logo.png"',
      'src="/common/Logo.png"'
    );

    // Add jQuery AJAX credentials configuration
    modifiedContent = modifiedContent.replace(
      '<script type="text/javascript" src="/common/js/jquery-3.7.1.min.js"></script>',
      '<script type="text/javascript" src="/common/js/jquery-3.7.1.min.js"></script>\n  <script type="text/javascript">\n    // Configure jQuery to send credentials with AJAX requests\n    $.ajaxSetup({\n      xhrFields: {\n        withCredentials: true\n      }\n    });\n  </script>'
    );

    res.send(modifiedContent);
  } else {
    res.status(404).send("File not found");
  }
});

// Route to serve main.html from common directory
app.get("/main.html", (req, res) => {
  const filePath = path.join(__dirname, "WebContent", "common", "main.html");
  if (fs.existsSync(filePath)) {
    // Read and serve the HTML file with device-specific configuration
    const htmlContent = fs.readFileSync(filePath, "utf8");

    // Inject device-specific basic_jscript.js
    const deviceScriptPath = `/${DEVICE_TYPE}/basic_jscript.js`;
    let modifiedContent = htmlContent.replace(
      'src="basic_jscript.js"',
      `src="${deviceScriptPath}"`
    );

    // Fix other static file paths
    modifiedContent = modifiedContent.replace(
      'href="basic_layout.css"',
      'href="/common/basic_layout.css"'
    );
    modifiedContent = modifiedContent.replace(
      'src="js/jquery-3.7.1.min.js"',
      'src="/common/js/jquery-3.7.1.min.js"'
    );

    modifiedContent = modifiedContent.replace(
      'src="js/utils.js"',
      'src="/common/js/utils.js"'
    );

    modifiedContent = modifiedContent.replace(
      'src="Logo.png"',
      'src="/common/Logo.png"'
    );

    // Fix HTML file paths
    modifiedContent = modifiedContent.replace(
      'src="dashboard.html"',
      'src="/common/dashboard.html"'
    );
    modifiedContent = modifiedContent.replace(
      'href="system.html"',
      'href="/common/system.html"'
    );
    modifiedContent = modifiedContent.replace(
      'href="m_interfaces.html"',
      'href="/common/m_interfaces.html"'
    );
    modifiedContent = modifiedContent.replace(
      'href="Traffic.html"',
      'href="/common/Traffic.html"'
    );
    modifiedContent = modifiedContent.replace(
      'href="m_lacp.html"',
      'href="/common/m_lacp.html"'
    );

    // Fix JavaScript dynamic paths
    modifiedContent = modifiedContent.replace(
      'iframe.src = event.id + ".html"',
      'iframe.src = "/common/" + event.id + ".html"'
    );
    modifiedContent = modifiedContent.replace(
      'window.top.location.href = "login.html"',
      'window.top.location.href = "/login.html"'
    );
    modifiedContent = modifiedContent.replace(
      'window.top.location.href = "login.html";',
      'window.top.location.href = "/login.html";'
    );

    // Add jQuery AJAX credentials configuration
    modifiedContent = modifiedContent.replace(
      '<script type="text/javascript" src="/common/js/jquery-3.7.1.min.js"></script>',
      '<script type="text/javascript" src="/common/js/jquery-3.7.1.min.js"></script>\n  <script type="text/javascript">\n    // Configure jQuery to send credentials with AJAX requests\n    $.ajaxSetup({\n      xhrFields: {\n        withCredentials: true\n      }\n    });\n  </script>'
    );

    res.send(modifiedContent);
  } else {
    res.status(404).send("File not found");
  }
});

// Route to serve HTML files with device-specific configuration
app.get("*.html", (req, res) => {
  const filePath = path.join(__dirname, "WebContent", req.path);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  // Read and serve the HTML file
  const htmlContent = fs.readFileSync(filePath, "utf8");

  // Inject device-specific basic_jscript.js
  const deviceScriptPath = `/${DEVICE_TYPE}/basic_jscript.js`;
  let modifiedContent = htmlContent.replace(
    'src="basic_jscript.js"',
    `src="${deviceScriptPath}"`
  );

  // Inject device-specific image path for dashboard
  if (req.path.includes("dashboard.html")) {
    const partNumber = getPartNumber();
    const imagePath = `/${DEVICE_TYPE}/${partNumber}.png`;
    modifiedContent = modifiedContent.replace(
      /data\["part number"\] \+ "\.png"/g,
      `"${imagePath}"`
    );
  }

  res.send(modifiedContent);
});

// Serve static files from WebContent (after HTML processing)
app.use(express.static(path.join(__dirname, "WebContent")));

// Debug endpoint to check session and cookies
app.get("/debug-session", (req, res) => {
  res.json({
    session: req.session,
    isLoggedIn: req.session?.isLoggedIn,
    user: req.session?.user,
    cookies: req.cookies,
    rawCookies: req.headers.cookie,
    sessionId: req.sessionID,
    sessionData: req.session,
  });
});

// API endpoints for dummy data
app.post("/api", async (req, res) => {
  let requestData = req.body;

  // Handle both JSON and form-encoded data
  if (req.is("application/x-www-form-urlencoded")) {
    // For form data, try to parse the JSON string from the body
    try {
      // The JSON string might be in a property of the parsed form data
      const jsonString = Object.keys(req.body)[0] || JSON.stringify(req.body);
      requestData = JSON.parse(jsonString);
    } catch (e) {
      // If parsing fails, try to use the body as-is
      requestData = req.body;
    }
  }

  const {
    service,
    access,
    command,
    parameters,
    sessionKeepAlive = true,
  } = requestData;

  // Check authentication for non-login requests
  if (service !== "user" || command !== "login") {
    console.log("API Request:", {
      service,
      command,
      sessionKeepAlive,
      session: req.session,
      isLoggedIn: req.session?.isLoggedIn,
    });

    if (!req.session || !req.session.isLoggedIn) {
      console.log("Authentication failed - no session or not logged in");
      return res.status(401).json({ error: "No active Session" });
    }

    // Check session timeout (10 minutes = 600000 ms)
    const now = Date.now();
    const lastActivity = req.session.lastActivity || now;
    const sessionTimeout = 10 * 60 * 1000; // 10 minutes

    if (now - lastActivity > sessionTimeout) {
      console.log("Session timeout - clearing session");
      req.session.destroy();
      return res.status(401).json({ error: "No active Session" });
    }

    // Update last activity if sessionKeepAlive is true (default)
    if (sessionKeepAlive !== false) {
      req.session.lastActivity = now;
    }

    // Check user level for write operations
    if (access === "set" && req.session.userLevel === 1) {
      console.log("Access denied - read only user attempting write operation");
      return res.status(403).json({ msg: "invalid rights" });
    }
  }

  // Simulate API response based on service and command
  let response = {};

  try {
    switch (service) {
      case "system":
        response = handleSystemAPI(access, command, parameters, req);
        break;
      case "user":
        response = await handleUserAPI(access, command, parameters, req);
        break;
      case "interface":
        response = handleInterfaceAPI(access, command, parameters, req);
        break;
      case "interfaces":
        response = handleInterfacesAPI(access, command, parameters, req);
        break;
      case "poe":
        response = handlePoEAPI(access, command, parameters, req);
        break;
      case "vlan":
        response = handleVlanAPI(access, command, parameters, req);
        break;
      case "dhcp":
        response = handleDhcpAPI(access, command, parameters, req);
        break;
      case "log":
        response = handleLogAPI(access, command, parameters, req);
        break;
      case "files":
        response = handleFilesAPI(access, command, parameters, req);
        break;
      case "ignition":
        response = handleIgnitionAPI(access, command, parameters, req);
        break;
      case "stp":
        response = handleStpAPI(access, command, parameters, req);
        break;
      case "lldp":
        response = handleLldpAPI(access, command, parameters, req);
        break;
      case "mirroring":
        response = handleMirroringAPI(access, command, parameters, req);
        break;
      case "staticmc":
        response = handleStaticMcAPI(access, command, parameters, req);
        break;
      case "usbapi":
        response = handleUsbApiAPI(access, command, parameters, req);
        break;
      case "qos":
        response = handleQosAPI(access, command, parameters, req);
        break;
      case "ntp":
        response = handleNtpAPI(access, command, parameters, req);
        break;
      case "snmp":
        response = handleSnmpAPI(access, command, parameters, req);
        break;
      case "trap":
        response = handleTrapAPI(access, command, parameters, req);
        break;
      case "nat":
        response = handleNatAPI(access, command, parameters, req);
        break;
      case "mqtt":
        response = handleMqttAPI(access, command, parameters, req);
        break;
      default:
        response = { error: "invalid command" };
    }

    // Check if response contains error
    if (response.error || response.msg) {
      const statusCode = response.error === "invalid command" ? 400 : 200;
      return res.status(statusCode).json(response);
    }

    // Add random delay to simulate real API
    setTimeout(() => {
      res.json(response);
    }, Math.random() * 1000);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(400).json({ error: "Command failed" });
  }
});

// System API handlers
function handleSystemAPI(access, command, parameters, req) {
  switch (command) {
    case "get id":
      return {
        sn: "ROQ123456789",
        "sw version": "1.0.0",
        "mgmt mac": "00:11:22:33:44:55",
        "part number": getPartNumber(),
        poe: DEVICE_TYPE.includes("4GE"),
      };
    case "get uptime":
      return { uptime: "00:00:00" };
    case "get config name":
      return { cfgName: "default.cfg" };
    case "get info":
      return { location: "Data Center A" };
    case "get supply":
      return { v1: true, v2: false };
    case "has unsaved changes":
      return { changes: false };
    case "devicenumbers":
      return { "cfg number": "001" };
    case "save config with name":
      return { success: true, message: "Configuration saved" };
    case "logout":
      return { success: true };
    case "files":
      return getSystemFiles();
    default:
      return { error: "Unknown command" };
  }
}

// User API handlers
async function handleUserAPI(access, command, parameters, req) {
  switch (command) {
    case "login":
      // Simulate successful login and set session
      if (parameters && parameters.user && parameters.password) {
        // Simulate different user levels based on username
        let userLevel = 0; // Default to full access
        if (parameters.user.toLowerCase().includes("user")) {
          userLevel = 1; // Read only access
        }

        req.session.isLoggedIn = true;
        req.session.user = parameters.user;
        req.session.userLevel = userLevel;
        req.session.lastActivity = Date.now();

        console.log("Session before save:", req.session);
        // Force session save and wait for it
        await new Promise((resolve, reject) => {
          req.session.save((err) => {
            if (err) {
              console.error("Session save error:", err);
              reject(err);
            } else {
              console.log("Session after save:", req.session);
              resolve();
            }
          });
        });

        // Set cookies for client-side access
        setCookie(req.res, "user", parameters.user, { httpOnly: false });
        setCookie(req.res, "loginTime", new Date().toISOString(), {
          httpOnly: false,
        });

        return { success: true, msg: "Login successful" };
      }
      return { error: "Invalid credentials" };
    case "logout":
      // Clear session
      req.session.destroy();

      // Clear cookies
      clearCookie(req.res, "user");
      clearCookie(req.res, "loginTime");

      return { success: true };
    case "get level":
      // Return user level (read only)
      if (req.session && req.session.user) {
        return { level: req.session.userLevel || 0 };
      }
      return { error: "No user logged in" };
    default:
      return { error: "Unknown command" };
  }
}

// Interface API handlers
function handleInterfaceAPI(access, command, parameters, req) {
  switch (command) {
    case "get interfaces state":
      return getInterfacesState();
    case "get interfaces":
      return getInterfaces();
    case "get counters":
      return getInterfaceCounters();
    case "get load":
      return getInterfaceLoad();
    case "get bsp state":
      return { bsp: true };
    case "set interfaces":
      return { success: true, msg: "Interfaces updated" };
    case "set bsp state":
      return { success: true, msg: "BSP state updated" };
    default:
      return { error: "Unknown command" };
  }
}

// Interfaces API handlers
function handleInterfacesAPI(access, command, parameters, req) {
  return {
    ports: getPortConfiguration(),
    status: "active",
  };
}

// PoE API handlers
function handlePoEAPI(access, command, parameters, req) {
  return {
    enabled: true,
    ports: getPoEPorts(),
    power: "30W",
  };
}

// Vlan API handlers
function handleVlanAPI(access, command, parameters, req) {
  switch (command) {
    case "get vlan interfaces":
      return getVlanInterfaces();
    case "get vids":
      return getVids();
    case "get vid members":
      return getVidMembers();
    case "get bridges":
      return getBridges();
    case "get current bridge config":
      return getCurrentBridgeConfig();
    case "get global vlans":
      return { enable: true };
    case "get bonds status":
      return getBondsStatus();
    case "vlan port settings":
      return getVlanPortSettings();
    case "get bridges":
      return getBridges();
    case "get vid":
      return getVids();
    case "get bonds":
      return getBondsStatus();
    case "set vlan interfaces":
      return { success: true, msg: "VLAN interfaces updated" };
    case "add vids":
      return { success: true, msg: "VLAN IDs added" };
    case "remove vids":
      return { success: true, msg: "VLAN IDs removed" };
    case "set vid members":
      return { success: true, msg: "VLAN members updated" };
    case "set bridges":
      return { success: true, msg: "Bridges updated" };
    case "set bridge temporary":
      return { success: true, msg: "Bridge temporary updated" };
    case "set global vlans":
      return { success: true, msg: "Global VLANs updated" };
    case "update vlan port settings":
      return { success: true, msg: "VLAN port settings updated" };
    case "set bridges":
      return { success: true, msg: "Bridges updated" };
    case "add vlan id":
      return { success: true, msg: "VLAN ID added" };
    case "remove vlan id":
      return { success: true, msg: "VLAN ID removed" };
    case "set bonds":
      return { success: true, msg: "Bonds updated" };
    default:
      return { error: "Unknown command" };
  }
}

// DHCP API handlers
function handleDhcpAPI(access, command, parameters, req) {
  switch (command) {
    case "get vids":
      return getVids();
    case "get cfg leases":
      return getDhcpLeases();
    case "get subnet":
      return getSubnets();
    case "get active leases":
      return getActiveLeases();
    case "subnets":
      if (access === "get") {
        return getSubnets();
      } else if (access === "set" && parameters) {
        return setSubnets(parameters);
      }
      break;
    case "set vids":
      return { success: true, msg: "VLAN IDs updated" };
    case "add cfg leases":
      return { success: true, msg: "Static lease added" };
    case "remove cfg leases":
      return { success: true, msg: "Static lease removed" };
    case "set subnet":
      return { success: true, msg: "Subnet updated" };
    case "remove subnet":
      return { success: true, msg: "Subnet removed" };
    case "edit subnet":
      return { success: true, msg: "Subnet edited" };
    case "relay settings":
      return getRelaySettings();
    case "relay update subnet":
      return { success: true, msg: "Relay subnet updated" };
    case "server id override":
      return { success: true, msg: "Server ID override updated" };
    case "remote id":
      return { success: true, msg: "Remote ID updated" };
    case "inserter settings":
      return getInserterSettings();
    case "inserter update subnet":
      return { success: true, msg: "Inserter subnet updated" };
    default:
      return { error: "Unknown command" };
  }
}

// Log API handlers
function handleLogAPI(access, command, parameters, req) {
  switch (command) {
    case "get log":
      return getLogMessages();
    default:
      return { error: "Unknown command" };
  }
}

// Files API handlers
function handleFilesAPI(access, command, parameters, req) {
  switch (command) {
    case "get files list":
      return getFilesList();
    default:
      return { error: "Unknown command" };
  }
}

// Ignition API handlers
function handleIgnitionAPI(access, command, parameters, req) {
  switch (command) {
    case "settings":
      if (access === "get") {
        return {
          enabled: true,
          timeout: 60,
        };
      } else if (access === "set") {
        return { success: true, msg: "Ignition settings updated" };
      }
      break;
    case "status":
      if (access === "get") {
        // Simulate different responses based on request count
        // In a real implementation, this would track state properly
        const requestCount = req.session.ignitionRequestCount || 0;
        req.session.ignitionRequestCount = requestCount + 1;

        if (requestCount % 2 === 0) {
          // First request - return enabled/timeout
          return {
            enabled: true,
            timeout: 60,
          };
        } else {
          // Second request - return V2Active/timer
          return {
            V2Active: true,
            timer: 0,
          };
        }
      }
      break;
    default:
      return { error: "Unknown command" };
  }
  return { error: "Unknown command" };
}

// STP API handlers
function handleStpAPI(access, command, parameters, req) {
  switch (command) {
    case "get stp version":
      if (access === "get") {
        return getStpVersion();
      }
      break;
    case "set stp version":
      if (access === "set" && parameters) {
        return setStpVersion(parameters);
      }
      break;
    case "port state":
      if (access === "get") {
        return getStpPortState();
      }
      break;
    case "rootbridge":
      if (access === "get") {
        return getStpRootBridge();
      }
      break;
    default:
      return { error: "Unknown command" };
  }
  return { error: "Unknown command" };
}

// LLDP API handlers
function handleLldpAPI(access, command, parameters, req) {
  switch (command) {
    case "get neighbors":
      if (access === "get") {
        return getLldpNeighbors();
      }
      break;
    case "get interfaces":
      if (access === "get") {
        return getLldpInterfaces();
      }
      break;
    case "set interfaces":
      if (access === "set" && parameters) {
        return setLldpInterfaces(parameters);
      }
      break;
    default:
      return { error: "Unknown command" };
  }
  return { error: "Unknown command" };
}

// Mirroring API handler
function handleMirroringAPI(access, command, parameters, req) {
  switch (command) {
    case "get mirroring":
      if (access === "get") {
        return getMirroringConfig();
      }
      break;
    case "set mirroring":
      if (access === "set" && parameters) {
        return setMirroringConfig(parameters);
      }
      break;
    default:
      return { error: "Unknown command" };
  }
  return { error: "Unknown command" };
}

// Static Multicast API handler
function handleStaticMcAPI(access, command, parameters, req) {
  switch (command) {
    case "get entries":
      if (access === "get") {
        return getStaticMcEntries();
      }
      break;
    case "set entries":
      if (access === "set" && parameters) {
        return setStaticMcEntries(parameters);
      }
      break;
    default:
      return { error: "Unknown command" };
  }
  return { error: "Unknown command" };
}

// USB API handler
function handleUsbApiAPI(access, command, parameters, req) {
  switch (command) {
    case "state":
      if (access === "get") {
        return getUsbState();
      }
      break;
    case "devices":
      if (access === "get") {
        return getUsbDevices();
      }
      break;
    case "mount":
      if (access === "set" && parameters) {
        return mountUsbDevice(parameters);
      }
      break;
    case "unmount":
      if (access === "set" && parameters) {
        return unmountUsbDevice(parameters);
      }
      break;
    default:
      return { error: "Unknown command" };
  }
  return { error: "Unknown command" };
}

// QoS API handler
function handleQosAPI(access, command, parameters, req) {
  switch (command) {
    case "get dscp->queue mapping":
      if (access === "get") {
        return getDscpQueueMapping();
      }
      break;
    case "set dscp->queue mapping":
      if (access === "set" && parameters) {
        return setDscpQueueMapping(parameters);
      }
      break;
    case "get queue settings":
      if (access === "get") {
        return getQueueSettings();
      }
      break;
    case "set queue settings":
      if (access === "set" && parameters) {
        return setQueueSettings(parameters);
      }
      break;
    case "get traffic classes":
      if (access === "get") {
        return getTrafficClasses();
      }
      break;
    default:
      return { error: "Unknown command" };
  }
  return { error: "Unknown command" };
}

// NTP API handler
function handleNtpAPI(access, command, parameters, req) {
  switch (command) {
    case "get config":
      if (access === "get") {
        return getNtpConfig();
      }
      break;
    case "set config":
      if (access === "set" && parameters) {
        return setNtpConfig(parameters);
      }
      break;
    case "get status":
      if (access === "get") {
        return getNtpStatus();
      }
      break;
    case "sync":
      if (access === "set") {
        return syncNtp();
      }
      break;
    default:
      return { error: "Unknown command" };
  }
  return { error: "Unknown command" };
}

// SNMP API handler
function handleSnmpAPI(access, command, parameters, req) {
  switch (command) {
    case "get config":
      if (access === "get") {
        return getSnmpConfig();
      }
      break;
    case "set config":
      if (access === "set" && parameters) {
        return setSnmpConfig(parameters);
      }
      break;
    case "get user":
      if (access === "get") {
        return getSnmpUsers();
      }
      break;
    case "add user":
      if (access === "set" && parameters) {
        return addSnmpUser(parameters);
      }
      break;
    case "remove user":
      if (access === "set" && parameters) {
        return removeSnmpUser(parameters);
      }
      break;
    default:
      return { error: "Unknown command" };
  }
  return { error: "Unknown command" };
}

// TRAP API handler
function handleTrapAPI(access, command, parameters, req) {
  switch (command) {
    case "get trap":
      if (access === "get") {
        return getTrapConfig();
      }
      break;
    case "set trap":
      if (access === "set" && parameters) {
        return setTrapConfig(parameters);
      }
      break;
    default:
      return { error: "Unknown command" };
  }
  return { error: "Unknown command" };
}

// NAT API handler
function handleNatAPI(access, command, parameters, req) {
  switch (command) {
    case "state":
      if (access === "get") {
        return getNatState();
      } else if (access === "set" && parameters) {
        return setNatState(parameters);
      }
      break;
    case "rule":
      if (access === "get") {
        return getNatRules();
      } else if (access === "add" && parameters) {
        return addNatRule(parameters);
      } else if (access === "remove" && parameters) {
        return removeNatRule(parameters);
      }
      break;
    default:
      return { error: "Unknown command" };
  }
  return { error: "Unknown command" };
}

// MQTT API handler
function handleMqttAPI(access, command, parameters, req) {
  switch (command) {
    case "get mqtt":
      if (access === "get") {
        return getMqttConfig();
      }
      break;
    case "set mqtt":
      if (access === "set" && parameters) {
        return setMqttConfig(parameters);
      }
      break;
    default:
      return { error: "Unknown command" };
  }
  return { error: "Unknown command" };
}

// Cookie helper functions
function setCookie(res, name, value, options = {}) {
  const defaultOptions = {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: "/",
  };

  const cookieOptions = { ...defaultOptions, ...options };
  res.cookie(name, value, cookieOptions);
}

function getCookie(req, name) {
  return req.cookies[name];
}

function clearCookie(res, name, options = {}) {
  const defaultOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  };

  const cookieOptions = { ...defaultOptions, ...options };
  res.clearCookie(name, cookieOptions);
}

// Helper functions
function getPartNumber() {
  switch (DEVICE_TYPE) {
    case "2GE8FE":
      return "006-130-120";
    case "4GE12FE":
      return "006-130-124";
    case "4GE20FE":
      return "006-130-140";
    default:
      return "006-130-120";
  }
}

function getPortConfiguration() {
  switch (DEVICE_TYPE) {
    case "2GE8FE":
      return {
        count: 10,
        names: ["G1", "P1", "P2", "P3", "P4", "G2", "P5", "P6", "P7", "P8"],
        speeds: [1000, 100, 100, 100, 100, 1000, 100, 100, 100, 100],
      };
    case "4GE12FE":
      return {
        count: 16,
        names: [
          "P1",
          "P2",
          "P3",
          "P4",
          "P5",
          "P6",
          "G1",
          "P7",
          "P8",
          "P9",
          "P10",
          "P11",
          "P12",
          "G4",
          "G2",
          "G3",
        ],
        speeds: [
          100, 100, 100, 100, 100, 100, 1000, 100, 100, 100, 100, 100, 100,
          1000, 1000, 1000,
        ],
      };
    case "4GE20FE":
      return {
        count: 24,
        names: [
          "G1",
          "G2",
          "G3",
          "G4",
          "G5",
          "G6",
          "G7",
          "G8",
          "G9",
          "G10",
          "G11",
          "G12",
          "G13",
          "G14",
          "G15",
          "G16",
          "G17",
          "G18",
          "G19",
          "G20",
          "G21",
          "G22",
          "G23",
          "G24",
        ],
        speeds: Array(24).fill(1000),
      };
    default:
      return { count: 10, names: [], speeds: [] };
  }
}

function getPoEPorts() {
  switch (DEVICE_TYPE) {
    case "2GE8FE":
      return ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"];
    case "4GE12FE":
      return ["P2", "P3", "P4", "P5", "P8", "P9", "P10", "P11"];
    case "4GE20FE":
      return ["G2", "G3", "G4", "G5", "G7", "G8", "G9", "G10"];
    default:
      return [];
  }
}

function getInterfacesState() {
  const portConfig = getPortConfiguration();
  const interfaces = [];

  for (let i = 0; i < portConfig.count; i++) {
    interfaces.push({
      interface: i + 1,
      state: Math.random() > 0.3, // 70% chance of being up
      duplex: Math.random() > 0.5, // 50% chance of full duplex
      speed: portConfig.speeds[i] || 100,
    });
  }

  return {
    interfaces: interfaces,
    total: interfaces.length,
    status: "success",
  };
}

function getInterfaces() {
  const portConfig = getPortConfiguration();
  const interfaces = [];

  for (let i = 0; i < portConfig.count; i++) {
    interfaces.push({
      interface: i + 1,
      name: portConfig.names[i] || `Port${i + 1}`,
      state: Math.random() > 0.3, // 70% chance of being up
      duplex: Math.random() > 0.5, // 50% chance of full duplex
      speed: portConfig.speeds[i] || 100,
      up: Math.random() > 0.3, // 70% chance of being up
      autoneg: Math.random() > 0.5, // 50% chance of auto-negotiation enabled
    });
  }

  return interfaces;
}

function getBondsStatus() {
  return {
    Bond1: {
      status: "up",
      lower_interfaces: {
        G1: { state: "up" },
        G2: { state: "up" },
      },
    },
    Bond2: {
      status: "down",
      lower_interfaces: {
        G3: { state: "down" },
        G4: { state: "down" },
      },
    },
  };
}

function getDhcpLeases() {
  return {
    static: [
      {
        ip: "192.168.1.10",
        mac: "00:11:22:33:44:55",
        time: "Permanent",
      },
      {
        ip: "192.168.1.11",
        mac: "00:11:22:33:44:56",
        time: "Permanent",
      },
    ],
    dynamic: [
      {
        ip: "192.168.1.100",
        mac: "aa:bb:cc:dd:ee:ff",
        time: "2h 30m",
      },
      {
        ip: "192.168.1.101",
        mac: "aa:bb:cc:dd:ee:01",
        time: "1h 15m",
      },
    ],
  };
}

function getLogMessages() {
  const messages = [];
  const priorities = ["CRITICAL", "ERROR", "WARNING", "NOTICE", "INFO"];
  const services = ["system", "network", "dhcp", "vlan", "poe"];

  for (let i = 0; i < 20; i++) {
    messages.push({
      pri: priorities[Math.floor(Math.random() * priorities.length)],
      tr: Math.floor(Math.random() * 86400), // Random time in seconds
      st: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      service: services[Math.floor(Math.random() * services.length)],
      msg: `Sample log message ${i + 1} - ${Math.random()
        .toString(36)
        .substring(7)}`,
    });
  }

  return {
    msgs: messages,
    overflow: false,
  };
}

function getFilesList() {
  return [
    {
      name: "config.cfg",
      size: "2048",
      url: "http://192.168.1.1/config.cfg",
      date: "2024-01-15 10:30:00",
      type: "config",
    },
    {
      name: "backup.cfg",
      size: "2048",
      url: "http://192.168.1.1/backup.cfg",
      date: "2024-01-14 15:45:00",
      type: "backup",
    },
    {
      name: "firmware.bin",
      size: "8192",
      url: "http://192.168.1.1/firmware.bin",
      date: "2024-01-10 09:20:00",
      type: "firmware",
    },
  ];
}

function getSystemFiles() {
  return {
    spacefree: 10485760, // 10MB free space
    files: getFilesList(),
  };
}

// Additional DHCP helper functions
function getActiveLeases() {
  return {
    static: [
      {
        mac: "00:11:22:33:44:55",
        ip: "192.168.1.100",
        time: "3600",
      },
    ],
    dynamic: [
      {
        mac: "00:11:22:33:44:56",
        ip: "192.168.1.101",
        time: "1800",
      },
      {
        mac: "00:11:22:33:44:57",
        ip: "192.168.1.102",
        time: "7200",
      },
    ],
  };
}

function getVids() {
  return [
    { vid: 1, name: "Default" },
    { vid: 10, name: "Management" },
    { vid: 20, name: "Guest" },
    { vid: 30, name: "IoT" },
  ];
}

function getRelaySettings() {
  return {
    enabled: true,
    subnets: [
      { vid: 10, servers: ["192.168.10.1"], ports: [1, 2, 3] },
      { vid: 20, servers: ["192.168.20.1"], ports: [4, 5, 6] },
    ],
  };
}

function getInserterSettings() {
  return {
    enabled: true,
    subnets: [
      { vid: 10, ports: [1, 2, 3] },
      { vid: 20, ports: [4, 5, 6] },
    ],
  };
}

// Interface helper functions
function getInterfaceCounters() {
  const portConfig = getPortConfiguration();
  return portConfig.names.map((name, index) => ({
    interface: index + 1,
    name: name,
    rx_bytes: Math.floor(Math.random() * 1000000),
    tx_bytes: Math.floor(Math.random() * 1000000),
    rx_packets: Math.floor(Math.random() * 10000),
    tx_packets: Math.floor(Math.random() * 10000),
    rx_errors: Math.floor(Math.random() * 10),
    tx_errors: Math.floor(Math.random() * 10),
  }));
}

function getInterfaceLoad() {
  const portConfig = getPortConfiguration();
  return portConfig.names.map((name, index) => ({
    interface: index + 1,
    name: name,
    load: Math.floor(Math.random() * 100),
    utilization: Math.floor(Math.random() * 100),
  }));
}

// VLAN helper functions
function getVlanInterfaces() {
  const portConfig = getPortConfiguration();
  return portConfig.names.map((name, index) => ({
    interface: index + 1,
    name: name,
    tags: Math.floor(Math.random() * 10) + 1,
    discardtagged: false,
    discarduntagged: false,
    forcedefaultvid: false,
  }));
}

function getVidMembers() {
  return [
    { vid: 1, members: [1, 2, 3, 4, 5, 6, 7, 8] },
    { vid: 10, members: [1, 2] },
    { vid: 20, members: [3, 4] },
    { vid: 30, members: [5, 6] },
  ];
}

function getBridges() {
  return [
    {
      wan: false,
      vlan_id: 0,
      vid: 1,
      ip: "192.168.1.1",
      sm: "255.255.255.0",
      gw: "192.168.1.1",
      forward: true,
      proxy_arp: false,
      dhcp_client: true,
      dhcp_provision: false,
      dhcp_filter: true,
    },
    {
      wan: true,
      vlan_id: 10,
      vid: 10,
      ip: "192.168.10.1",
      sm: "255.255.255.0",
      gw: "192.168.10.1",
      forward: true,
      proxy_arp: true,
      dhcp_client: false,
      dhcp_provision: true,
      dhcp_filter: false,
    },
    {
      wan: false,
      vlan_id: 20,
      vid: 20,
      ip: "192.168.20.1",
      sm: "255.255.255.0",
      gw: "192.168.20.1",
      forward: true,
      proxy_arp: false,
      dhcp_client: true,
      dhcp_provision: true,
      dhcp_filter: true,
    },
  ];
}

function getCurrentBridgeConfig() {
  return {
    bridges: getBridges(),
    global_vlans: { enable: true },
  };
}

function getVlanPortSettings() {
  const portConfig = getPortConfiguration();
  return portConfig.names.map((name, index) => ({
    interface: index + 1,
    name: name,
    pvid: 1,
    tagged: [],
    untagged: [1],
  }));
}

// STP helper functions
function getStpVersion() {
  // Simulate STP configuration - can be enabled/disabled
  const stpEnabled = Math.random() > 0.3; // 70% chance of being enabled
  return {
    lan: stpEnabled ? "rstp" : "none",
    lanprio: Math.floor(Math.random() * 16), // Random priority 0-15
  };
}

function setStpVersion(parameters) {
  // Simulate setting STP version
  return { success: true, msg: "STP configuration updated" };
}

function getStpPortState() {
  const portConfig = getPortConfiguration();
  const portStates = [];

  for (let i = 0; i < portConfig.count; i++) {
    const portName = portConfig.names[i] || `Port${i + 1}`;
    const states = ["forwarding", "blocking", "learning", "discarding"];
    const roles = ["root", "designated", "alternate", "backup"];

    // Simulate realistic STP states
    const state = states[Math.floor(Math.random() * states.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];

    portStates.push({
      port: portName,
      state: state,
      role: role,
    });
  }

  return portStates;
}

function getStpRootBridge() {
  // Generate a random MAC address for root bridge
  const macParts = [];
  for (let i = 0; i < 6; i++) {
    macParts.push(
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0")
    );
  }
  const macAddress = macParts.join(":");
  const priority = Math.floor(Math.random() * 16) * 4096; // STP priority values

  return {
    rootbridge: `${priority.toString(16).padStart(4, "0")}.${macAddress}`,
  };
}

// LLDP helper functions
function getLldpNeighbors() {
  const portConfig = getPortConfiguration();
  const neighbors = [];

  // Generate some sample LLDP neighbors for a few ports
  const sampleNeighbors = [
    {
      interface: 1,
      data: {
        chassis: {
          id: "00:11:22:33:44:55",
          descr: "Cisco Catalyst 2960",
          type: "macAddress",
          value: "00:11:22:33:44:55",
        },
        port: {
          id: {
            type: "macAddress",
            value: "00:11:22:33:44:56",
          },
          descr: "GigabitEthernet0/1",
        },
        age: "120",
      },
    },
    {
      interface: 3,
      data: {
        chassis: {
          id: "00:aa:bb:cc:dd:ee",
          descr: "HP ProCurve 2520",
          type: "macAddress",
          value: "00:aa:bb:cc:dd:ee",
        },
        port: {
          id: {
            type: "macAddress",
            value: "00:aa:bb:cc:dd:ef",
          },
          descr: "Port 1",
        },
        age: "45",
      },
    },
    {
      interface: 5,
      data: {
        chassis: {
          id: "00:ff:ee:dd:cc:bb",
          descr: "Dell PowerConnect 2824",
          type: "macAddress",
          value: "00:ff:ee:dd:cc:bb",
        },
        port: {
          id: {
            type: "macAddress",
            value: "00:ff:ee:dd:cc:bc",
          },
          descr: "Port 24",
        },
        age: "200",
      },
    },
  ];

  return {
    lldp: {
      interface: sampleNeighbors,
    },
  };
}

function getLldpInterfaces() {
  const portConfig = getPortConfiguration();
  const interfaces = [];

  for (let i = 0; i < portConfig.count; i++) {
    interfaces.push({
      interface: i + 1,
      tx: Math.random() > 0.5, // Randomly enable/disable transmit
    });
  }

  return interfaces;
}

function setLldpInterfaces(parameters) {
  // Simulate setting LLDP interfaces
  return { success: true, msg: "LLDP interfaces updated" };
}

// DHCP helper functions
function getSubnets() {
  return [
    {
      id: 1,
      name: "Local Network",
      network: "192.168.1.0",
      netmask: "255.255.255.0",
      role: "server",
      oif: ["eth0", "192.168.1.1"],
      type: "local",
      operation: true,
      description: "Main local network",
      params: {
        id: 1,
        name: "Local Network Parameters",
        netmask: "255.255.255.0",
        gateway: "192.168.1.1",
        dns0: "8.8.8.8",
        dns1: "8.8.4.4",
        domain: "local",
        leasetime: 3600,
        pool_start: "192.168.1.100",
        pool_end: "192.168.1.200",
      },
      server0: "127.0.0.1",
      leasesO82: {
        active: [
          {
            id: 1,
            port: 1,
            name: "P1",
            remoteid: "Port P1",
            ip: "192.168.1.101",
            cfgname: "Port1-Config",
            state: "active",
            expiry: "2024-01-01 12:00:00",
          },
          {
            id: 2,
            port: 2,
            name: "P2",
            remoteid: "Port P2",
            ip: "192.168.1.102",
            cfgname: "Port2-Config",
            state: "active",
            expiry: "2024-01-01 12:00:00",
          },
        ],
        idle: [
          {
            id: 3,
            port: 3,
            name: "P3",
            remoteid: "Port P3",
            ip: "0.0.0.0",
            cfgname: "",
            state: "idle",
            expiry: "N/A",
          },
        ],
      },
      leasesMAC: {
        active: [
          {
            id: 1,
            remoteid: "00:11:22:33:44:55",
            ip: "192.168.1.150",
            cfgname: "Server-Config",
            state: "active",
            expiry: "2024-01-01 12:00:00",
          },
        ],
        idle: [],
      },
      leasesDYN: {
        active: [
          {
            id: 1,
            remoteid: "00:aa:bb:cc:dd:ee",
            ip: "192.168.1.151",
            state: "active",
            expiry: "2024-01-01 11:30:00",
          },
          {
            id: 2,
            remoteid: "00:ff:ee:dd:cc:bb",
            ip: "192.168.1.152",
            state: "active",
            expiry: "2024-01-01 11:45:00",
          },
        ],
        idle: [],
      },
    },
    {
      id: 2,
      name: "Remote Network",
      network: "192.168.10.0",
      netmask: "255.255.255.0",
      role: "relay",
      oif: ["eth1", "192.168.10.1"],
      type: "remote",
      operation: true,
      description: "Remote network relay",
      params: {
        id: 2,
        name: "Remote Network Parameters",
        netmask: "255.255.255.0",
        gateway: "192.168.10.1",
        dns0: "8.8.8.8",
        dns1: "8.8.4.4",
        domain: "remote.local",
        leasetime: 7200,
        pool_start: "192.168.10.100",
        pool_end: "192.168.10.200",
      },
      server0: "192.168.10.10",
      leasesO82: {
        active: [
          {
            id: 1,
            port: 1,
            name: "P1",
            remoteid: "Remote-Port-1",
            ip: "192.168.10.101",
            cfgname: "Remote-Port1-Config",
            state: "active",
            expiry: "2024-01-01 12:00:00",
          },
        ],
        idle: [],
      },
      leasesMAC: {
        active: [],
        idle: [],
      },
      leasesDYN: {
        active: [],
        idle: [],
      },
    },
  ];
}

function setSubnets(parameters) {
  // Validate parameters
  if (!parameters) {
    return { error: "Invalid parameters" };
  }

  // In a real implementation, this would save to device configuration
  // For now, just return success with processed data
  const result = {
    success: true,
    msg: "DHCP subnets configuration updated successfully",
    processed: {
      updated: parameters.upd ? parameters.upd.length : 0,
      added: parameters.add ? parameters.add.length : 0,
      deleted: parameters.del ? parameters.del.length : 0,
    },
  };

  return result;
}

// Mirroring helper functions
function getMirroringConfig() {
  const portConfig = getPortConfiguration();
  const src = [];

  // Generate source interfaces with default states
  for (let i = 1; i <= portConfig.count; i++) {
    src.push({
      interface: i,
      state: "normal", // Default state: normal, source_ingress, source_egress, source_both
    });
  }

  return {
    src: src,
    dest: -1, // No destination port selected by default
  };
}

function setMirroringConfig(parameters) {
  // Validate parameters
  if (!parameters || !parameters.src || !Array.isArray(parameters.src)) {
    return { error: "Invalid parameters" };
  }

  // In a real implementation, this would save to device configuration
  // For now, just return success
  return {
    success: true,
    msg: "Mirroring configuration updated successfully",
  };
}

// Static Multicast helper functions
function getStaticMcEntries() {
  // Return sample static multicast entries
  return {
    entries: [
      {
        id: 1,
        group: "224.1.1.1",
        source: "192.168.1.10",
        vlan: 1,
        ports: [1, 2, 3],
        status: "active",
      },
      {
        id: 2,
        group: "224.2.2.2",
        source: "192.168.1.20",
        vlan: 1,
        ports: [4, 5, 6],
        status: "active",
      },
    ],
  };
}

function setStaticMcEntries(parameters) {
  // Validate parameters
  if (
    !parameters ||
    !parameters.entries ||
    !Array.isArray(parameters.entries)
  ) {
    return { error: "Invalid parameters" };
  }

  // In a real implementation, this would save to device configuration
  // For now, just return success
  return {
    success: true,
    msg: "Static multicast entries updated successfully",
  };
}

// USB API helper functions
function getUsbState() {
  return {
    enabled: true,
    status: "ready",
    devices_connected: 2,
    last_update: new Date().toISOString(),
    usb_version: "2.0",
    power_management: "enabled",
  };
}

function getUsbDevices() {
  return {
    devices: [
      {
        id: "usb1",
        name: "USB Storage Device",
        type: "storage",
        size: "32GB",
        status: "mounted",
        mount_point: "/mnt/usb1",
        filesystem: "FAT32",
        vendor: "SanDisk",
        product: "Cruzer Blade",
      },
      {
        id: "usb2",
        name: "USB Network Adapter",
        type: "network",
        status: "connected",
        vendor: "Realtek",
        product: "RTL8153",
        driver: "r8152",
      },
    ],
  };
}

function mountUsbDevice(parameters) {
  if (!parameters || !parameters.device_id) {
    return { error: "Device ID required" };
  }

  return {
    success: true,
    msg: `USB device ${parameters.device_id} mounted successfully`,
    mount_point: `/mnt/${parameters.device_id}`,
  };
}

function unmountUsbDevice(parameters) {
  if (!parameters || !parameters.device_id) {
    return { error: "Device ID required" };
  }

  return {
    success: true,
    msg: `USB device ${parameters.device_id} unmounted successfully`,
  };
}

// QoS helper functions
function getDscpQueueMapping() {
  return {
    mappings: [
      { dscp: 0, queue: 0, description: "Best Effort" },
      { dscp: 1, queue: 0, description: "Best Effort" },
      { dscp: 2, queue: 0, description: "Best Effort" },
      { dscp: 3, queue: 0, description: "Best Effort" },
      { dscp: 4, queue: 0, description: "Best Effort" },
      { dscp: 5, queue: 0, description: "Best Effort" },
      { dscp: 6, queue: 0, description: "Best Effort" },
      { dscp: 7, queue: 0, description: "Best Effort" },
      { dscp: 8, queue: 1, description: "Low Priority" },
      { dscp: 9, queue: 1, description: "Low Priority" },
      { dscp: 10, queue: 1, description: "Low Priority" },
      { dscp: 11, queue: 1, description: "Low Priority" },
      { dscp: 12, queue: 1, description: "Low Priority" },
      { dscp: 13, queue: 1, description: "Low Priority" },
      { dscp: 14, queue: 1, description: "Low Priority" },
      { dscp: 15, queue: 1, description: "Low Priority" },
      { dscp: 16, queue: 2, description: "Medium Priority" },
      { dscp: 17, queue: 2, description: "Medium Priority" },
      { dscp: 18, queue: 2, description: "Medium Priority" },
      { dscp: 19, queue: 2, description: "Medium Priority" },
      { dscp: 20, queue: 2, description: "Medium Priority" },
      { dscp: 21, queue: 2, description: "Medium Priority" },
      { dscp: 22, queue: 2, description: "Medium Priority" },
      { dscp: 23, queue: 2, description: "Medium Priority" },
      { dscp: 24, queue: 3, description: "High Priority" },
      { dscp: 25, queue: 3, description: "High Priority" },
      { dscp: 26, queue: 3, description: "High Priority" },
      { dscp: 27, queue: 3, description: "High Priority" },
      { dscp: 28, queue: 3, description: "High Priority" },
      { dscp: 29, queue: 3, description: "High Priority" },
      { dscp: 30, queue: 3, description: "High Priority" },
      { dscp: 31, queue: 3, description: "High Priority" },
      { dscp: 32, queue: 4, description: "Critical" },
      { dscp: 33, queue: 4, description: "Critical" },
      { dscp: 34, queue: 4, description: "Critical" },
      { dscp: 35, queue: 4, description: "Critical" },
      { dscp: 36, queue: 4, description: "Critical" },
      { dscp: 37, queue: 4, description: "Critical" },
      { dscp: 38, queue: 4, description: "Critical" },
      { dscp: 39, queue: 4, description: "Critical" },
      { dscp: 40, queue: 5, description: "Voice" },
      { dscp: 41, queue: 5, description: "Voice" },
      { dscp: 42, queue: 5, description: "Voice" },
      { dscp: 43, queue: 5, description: "Voice" },
      { dscp: 44, queue: 5, description: "Voice" },
      { dscp: 45, queue: 5, description: "Voice" },
      { dscp: 46, queue: 5, description: "Voice" },
      { dscp: 47, queue: 5, description: "Voice" },
      { dscp: 48, queue: 6, description: "Video" },
      { dscp: 49, queue: 6, description: "Video" },
      { dscp: 50, queue: 6, description: "Video" },
      { dscp: 51, queue: 6, description: "Video" },
      { dscp: 52, queue: 6, description: "Video" },
      { dscp: 53, queue: 6, description: "Video" },
      { dscp: 54, queue: 6, description: "Video" },
      { dscp: 55, queue: 6, description: "Video" },
      { dscp: 56, queue: 7, description: "Network Control" },
      { dscp: 57, queue: 7, description: "Network Control" },
      { dscp: 58, queue: 7, description: "Network Control" },
      { dscp: 59, queue: 7, description: "Network Control" },
      { dscp: 60, queue: 7, description: "Network Control" },
      { dscp: 61, queue: 7, description: "Network Control" },
      { dscp: 62, queue: 7, description: "Network Control" },
      { dscp: 63, queue: 7, description: "Network Control" },
    ],
    total_queues: 8,
    default_queue: 0,
  };
}

function setDscpQueueMapping(parameters) {
  if (
    !parameters ||
    !parameters.mappings ||
    !Array.isArray(parameters.mappings)
  ) {
    return { error: "Invalid parameters" };
  }

  return {
    success: true,
    msg: "DSCP to queue mapping updated successfully",
  };
}

function getQueueSettings() {
  return {
    queues: [
      {
        id: 0,
        name: "Best Effort",
        weight: 1,
        priority: 0,
        min_rate: 0,
        max_rate: 100,
      },
      {
        id: 1,
        name: "Low Priority",
        weight: 2,
        priority: 1,
        min_rate: 5,
        max_rate: 50,
      },
      {
        id: 2,
        name: "Medium Priority",
        weight: 4,
        priority: 2,
        min_rate: 10,
        max_rate: 75,
      },
      {
        id: 3,
        name: "High Priority",
        weight: 8,
        priority: 3,
        min_rate: 20,
        max_rate: 90,
      },
      {
        id: 4,
        name: "Critical",
        weight: 16,
        priority: 4,
        min_rate: 30,
        max_rate: 95,
      },
      {
        id: 5,
        name: "Voice",
        weight: 32,
        priority: 5,
        min_rate: 40,
        max_rate: 100,
      },
      {
        id: 6,
        name: "Video",
        weight: 16,
        priority: 4,
        min_rate: 25,
        max_rate: 90,
      },
      {
        id: 7,
        name: "Network Control",
        weight: 64,
        priority: 6,
        min_rate: 50,
        max_rate: 100,
      },
    ],
  };
}

function setQueueSettings(parameters) {
  if (!parameters || !parameters.queues || !Array.isArray(parameters.queues)) {
    return { error: "Invalid parameters" };
  }

  return {
    success: true,
    msg: "Queue settings updated successfully",
  };
}

function getTrafficClasses() {
  return {
    classes: [
      {
        id: 0,
        name: "Best Effort",
        dscp_range: "0-7",
        queue: 0,
        color: "green",
      },
      {
        id: 1,
        name: "Low Priority",
        dscp_range: "8-15",
        queue: 1,
        color: "yellow",
      },
      {
        id: 2,
        name: "Medium Priority",
        dscp_range: "16-23",
        queue: 2,
        color: "orange",
      },
      {
        id: 3,
        name: "High Priority",
        dscp_range: "24-31",
        queue: 3,
        color: "red",
      },
      {
        id: 4,
        name: "Critical",
        dscp_range: "32-39",
        queue: 4,
        color: "purple",
      },
      { id: 5, name: "Voice", dscp_range: "40-47", queue: 5, color: "blue" },
      { id: 6, name: "Video", dscp_range: "48-55", queue: 6, color: "cyan" },
      {
        id: 7,
        name: "Network Control",
        dscp_range: "56-63",
        queue: 7,
        color: "magenta",
      },
    ],
  };
}

// NTP helper functions
function getNtpConfig() {
  return {
    enabled: true,
    servers: [
      {
        id: 1,
        address: "pool.ntp.org",
        port: 123,
        priority: 1,
        status: "active",
      },
      {
        id: 2,
        address: "time.google.com",
        port: 123,
        priority: 2,
        status: "active",
      },
      {
        id: 3,
        address: "time.cloudflare.com",
        port: 123,
        priority: 3,
        status: "active",
      },
    ],
    timezone: "UTC+7",
    sync_interval: 3600, // seconds
    drift_compensation: true,
    authentication: false,
    log_level: "info",
    last_sync: new Date().toISOString(),
    next_sync: new Date(Date.now() + 3600000).toISOString(),
  };
}

function setNtpConfig(parameters) {
  if (!parameters) {
    return { error: "Invalid parameters" };
  }

  return {
    success: true,
    msg: "NTP configuration updated successfully",
    config: {
      enabled: parameters.enabled !== undefined ? parameters.enabled : true,
      servers: parameters.servers || [],
      timezone: parameters.timezone || "UTC+7",
      sync_interval: parameters.sync_interval || 3600,
    },
  };
}

function getNtpStatus() {
  return {
    status: "synchronized",
    stratum: 3,
    offset: 0.001, // milliseconds
    jitter: 0.002, // milliseconds
    delay: 0.015, // milliseconds
    dispersion: 0.001, // milliseconds
    reference_time: "2024-01-01T00:00:00Z",
    last_sync: new Date().toISOString(),
    uptime: 86400, // seconds
    packets_sent: 1440,
    packets_received: 1440,
    packets_dropped: 0,
    current_server: "pool.ntp.org",
  };
}

function syncNtp() {
  return {
    success: true,
    msg: "NTP synchronization initiated",
    sync_time: new Date().toISOString(),
    estimated_completion: new Date(Date.now() + 30000).toISOString(), // 30 seconds
  };
}

// SNMP helper functions
function getSnmpConfig() {
  return {
    v1: true,
    v2c: true,
    v3: true,
    read_community: "public",
    write_community: "private",
    engineID: "8000000001020304",
  };
}

function setSnmpConfig(parameters) {
  if (!parameters) {
    return { error: "Invalid parameters" };
  }

  return {
    success: true,
    msg: "SNMP configuration updated successfully",
    config: {
      v1: parameters.v1 !== undefined ? parameters.v1 : true,
      v2c: parameters.v2c !== undefined ? parameters.v2c : true,
      v3: parameters.v3 !== undefined ? parameters.v3 : true,
      read_community: parameters.read_community || "public",
      write_community: parameters.write_community || "private",
      engineID: parameters.engineID || "8000000001020304",
    },
  };
}

function getSnmpUsers() {
  return [
    {
      name: "admin",
      authpass: "********",
      privpass: "********",
      created: "2024-01-01T00:00:00Z",
      last_used: "2024-01-15T10:30:00Z",
    },
    {
      name: "monitor",
      authpass: "********",
      privpass: "********",
      created: "2024-01-02T00:00:00Z",
      last_used: "2024-01-14T15:45:00Z",
    },
    {
      name: "guest",
      authpass: "********",
      privpass: "********",
      created: "2024-01-03T00:00:00Z",
      last_used: "2024-01-13T09:20:00Z",
    },
  ];
}

function addSnmpUser(parameters) {
  if (!parameters || !Array.isArray(parameters) || parameters.length === 0) {
    return { error: "Invalid parameters" };
  }

  const user = parameters[0];
  if (!user.name || !user.authpass || !user.privpass) {
    return { error: "Missing required user fields" };
  }

  if (user.authpass.length < 8 || user.privpass.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  return {
    success: true,
    msg: `SNMP user '${user.name}' added successfully`,
    user: {
      name: user.name,
      authpass: "********",
      privpass: "********",
      created: new Date().toISOString(),
    },
  };
}

function removeSnmpUser(parameters) {
  if (!parameters || !Array.isArray(parameters) || parameters.length === 0) {
    return { error: "Invalid parameters" };
  }

  const username = parameters[0];
  if (!username) {
    return { error: "Username is required" };
  }

  return {
    success: true,
    msg: `SNMP user '${username}' removed successfully`,
  };
}

// TRAP helper functions
function getTrapConfig() {
  return {
    enabled: true,
    destination: "192.168.1.100",
    community: "public",
    version: "v1",
    port: 162,
    retries: 3,
    timeout: 1000,
    last_sent: "2024-01-15T10:30:00Z",
    total_sent: 1250,
    failed_sends: 5,
  };
}

function setTrapConfig(parameters) {
  if (!parameters) {
    return { error: "Invalid parameters" };
  }

  return {
    success: true,
    msg: "SNMP Trap configuration updated successfully",
    config: {
      enabled: parameters.enabled !== undefined ? parameters.enabled : true,
      destination: parameters.destination || "192.168.1.100",
      community: parameters.community || "public",
      version: parameters.version || "v1",
      port: parameters.port || 162,
    },
  };
}

// NAT helper functions
function getNatState() {
  return {
    enabled: true,
    status: "active",
    total_rules: 3,
    active_connections: 15,
    last_updated: new Date().toISOString(),
  };
}

function setNatState(parameters) {
  if (!parameters) {
    return { error: "Invalid parameters" };
  }

  return {
    success: true,
    msg: `NAT ${parameters.enabled ? "enabled" : "disabled"} successfully`,
    enabled: parameters.enabled,
    status: parameters.enabled ? "active" : "inactive",
    updated: new Date().toISOString(),
  };
}

function getNatRules() {
  return [
    {
      name: "1:1 NAT 203.0.113.1 to 192.168.1.100",
      type: "1:1_NAT",
      internal_ip: "192.168.1.100",
      external_ip: "203.0.113.1",
      masquerade: false,
      status: "active",
      created: "2024-01-10T08:30:00Z",
      last_used: "2024-01-15T14:22:00Z",
    },
    {
      name: "PAT TCP 203.0.113.1:80 to 192.168.1.50:8080",
      type: "PAT",
      protocol: "tcp",
      incoming_ip: "203.0.113.1",
      incoming_port: 80,
      destination_ip: "192.168.1.50",
      destination_port: 8080,
      masquerade: true,
      status: "active",
      created: "2024-01-12T10:15:00Z",
      last_used: "2024-01-15T16:45:00Z",
    },
    {
      name: "PAT UDP 203.0.113.1:53 to 192.168.1.10:53",
      type: "PAT",
      protocol: "udp",
      incoming_ip: "203.0.113.1",
      incoming_port: 53,
      destination_ip: "192.168.1.10",
      destination_port: 53,
      masquerade: false,
      status: "active",
      created: "2024-01-14T09:20:00Z",
      last_used: "2024-01-15T12:30:00Z",
    },
  ];
}

function addNatRule(parameters) {
  if (!parameters) {
    return { error: "Invalid parameters" };
  }

  if (!parameters.name) {
    return { error: "Rule name is required" };
  }

  // Simulate adding the rule
  const newRule = {
    name: parameters.name,
    type: parameters.FORWARD ? "1:1_NAT" : "PAT",
    status: "active",
    created: new Date().toISOString(),
    last_used: new Date().toISOString(),
    ...parameters,
  };

  return {
    success: true,
    msg: `NAT rule '${parameters.name}' added successfully`,
    rule: newRule,
    total_rules: 4,
  };
}

function removeNatRule(parameters) {
  if (!parameters) {
    return { error: "Invalid parameters" };
  }

  if (parameters.index === undefined) {
    return { error: "Rule index is required" };
  }

  return {
    success: true,
    msg: `NAT rule at index ${parameters.index} removed successfully`,
    removed_index: parameters.index,
    total_rules: 2,
  };
}

// MQTT helper functions
function getMqttConfig() {
  return {
    enabled: true,
    server: "mqtt.example.com",
    port: 1883,
    name: "roqstar-client-001",
    username: "mqtt_user",
    password: "mqtt_password",
    tls: false,
    ca_cert: "",
    verify: false,
    qos: 1,
    pingreq_interval: 120,
    update_enabled: true,
    update_topic: "roqstar/update",
    s: "connected",
    last_connected: new Date().toISOString(),
    messages_sent: 1250,
    messages_received: 890,
    connection_uptime: 86400,
    last_error: null,
  };
}

function setMqttConfig(parameters) {
  if (!parameters) {
    return { error: "Invalid parameters" };
  }

  // Validate required fields
  if (parameters.enabled && !parameters.server) {
    return { error: "Server hostname is required when MQTT is enabled" };
  }

  if (parameters.tls && !parameters.ca_cert) {
    return { error: "CA certificate is required when TLS is enabled" };
  }

  if (parameters.qos < 0 || parameters.qos > 2) {
    return { error: "QoS must be between 0 and 2" };
  }

  if (parameters.pingreq_interval < 1 || parameters.pingreq_interval > 3600) {
    return { error: "Keep alive interval must be between 1 and 3600 seconds" };
  }

  return {
    success: true,
    msg: "MQTT configuration updated successfully",
    config: {
      enabled: parameters.enabled || false,
      server: parameters.server || "mqtt.example.com",
      port: parameters.port || 1883,
      name: parameters.name || "roqstar-client-001",
      username: parameters.username || "",
      password: parameters.password || "",
      tls: parameters.tls || false,
      ca_cert: parameters.ca_cert || "",
      verify: parameters.verify || false,
      qos: parameters.qos || 1,
      pingreq_interval: parameters.pingreq_interval || 120,
      update_enabled: parameters.update_enabled || false,
      update_topic: parameters.update_topic || "roqstar/update",
    },
    updated: new Date().toISOString(),
  };
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Device type: ${DEVICE_TYPE}`);
  console.log(`Access the interface at: http://localhost:${PORT}/main.html`);
});

module.exports = app;
