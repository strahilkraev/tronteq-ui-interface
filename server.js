const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 3000;
const DEVICE_TYPE = process.env.DEVICE_TYPE || "2GE8FE";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: false, // Allow client-side access for debugging
      sameSite: "lax", // Support cross-origin requests
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

// Debug endpoint to check session
app.get("/debug-session", (req, res) => {
  res.json({
    session: req.session,
    isLoggedIn: req.session?.isLoggedIn,
    user: req.session?.user,
  });
});

// API endpoints for dummy data
app.post("/api", (req, res) => {
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

  const { service, access, command, parameters } = requestData;

  // Check authentication for non-login requests
  if (service !== "user" || command !== "login") {
    console.log("API Request:", {
      service,
      command,
      session: req.session,
      isLoggedIn: req.session?.isLoggedIn,
    });
    if (!req.session || !req.session.isLoggedIn) {
      console.log("Authentication failed - no session or not logged in");
      return res.json({ error: "invalid rights" });
    }
  }

  // Simulate API response based on service and command
  let response = {};

  switch (service) {
    case "system":
      response = handleSystemAPI(access, command, parameters);
      break;
    case "user":
      response = handleUserAPI(access, command, parameters, req);
      break;
    case "interface":
      response = handleInterfaceAPI(access, command, parameters);
      break;
    case "interfaces":
      response = handleInterfacesAPI(access, command, parameters);
      break;
    case "poe":
      response = handlePoEAPI(access, command, parameters);
      break;
    case "vlan":
      response = handleVlanAPI(access, command, parameters);
      break;
    case "dhcp":
      response = handleDhcpAPI(access, command, parameters);
      break;
    case "log":
      response = handleLogAPI(access, command, parameters);
      break;
    case "files":
      response = handleFilesAPI(access, command, parameters);
      break;
    default:
      response = { error: "Unknown service" };
  }

  // Add random delay to simulate real API
  setTimeout(() => {
    res.json(response);
  }, Math.random() * 1000);
});

// System API handlers
function handleSystemAPI(access, command, parameters) {
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
      return { uptime: "5 days, 12 hours, 30 minutes" };
    case "get config name":
      return { cfgName: "default.cfg" };
    case "get info":
      return { location: "Data Center A" };
    case "get supply":
      return { v1: true, v2: true };
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
function handleUserAPI(access, command, parameters, req) {
  switch (command) {
    case "login":
      // Simulate successful login and set session
      if (parameters && parameters.user && parameters.password) {
        req.session.isLoggedIn = true;
        req.session.user = parameters.user;
        return { success: true, msg: "Login successful" };
      }
      return { error: "Invalid credentials" };
    case "logout":
      // Clear session
      req.session.destroy();
      return { success: true };
    default:
      return { error: "Unknown command" };
  }
}

// Interface API handlers
function handleInterfaceAPI(access, command, parameters) {
  switch (command) {
    case "get interfaces state":
      return getInterfacesState();
    case "get interfaces":
      return getInterfaces();
    default:
      return { error: "Unknown command" };
  }
}

// Interfaces API handlers
function handleInterfacesAPI(access, command, parameters) {
  return {
    ports: getPortConfiguration(),
    status: "active",
  };
}

// PoE API handlers
function handlePoEAPI(access, command, parameters) {
  return {
    enabled: true,
    ports: getPoEPorts(),
    power: "30W",
  };
}

// Vlan API handlers
function handleVlanAPI(access, command, parameters) {
  switch (command) {
    case "get bonds status":
      return getBondsStatus();
    default:
      return { error: "Unknown command" };
  }
}

// DHCP API handlers
function handleDhcpAPI(access, command, parameters) {
  switch (command) {
    case "get active leases":
      return getDhcpLeases();
    default:
      return { error: "Unknown command" };
  }
}

// Log API handlers
function handleLogAPI(access, command, parameters) {
  switch (command) {
    case "get log":
      return getLogMessages();
    default:
      return { error: "Unknown command" };
  }
}

// Files API handlers
function handleFilesAPI(access, command, parameters) {
  switch (command) {
    case "get files list":
      return getFilesList();
    default:
      return { error: "Unknown command" };
  }
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

  return interfaces;
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
      date: "2024-01-15 10:30:00",
      type: "config",
    },
    {
      name: "backup.cfg",
      size: "2048",
      date: "2024-01-14 15:45:00",
      type: "backup",
    },
    {
      name: "firmware.bin",
      size: "8192",
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
  console.log(
    `Access the interface at: http://localhost:${PORT}/common/main.html`
  );
});

module.exports = app;
