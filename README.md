# ROQ UI Interface - Node.js Server

A Node.js server to render ROQ UI interface with configurable device types through environment variables.

## Features

- ✅ Render existing HTML files from `WebContent` directory
- ✅ Configure device type through environment variables (2GE8FE, 4GE12FE, 4GE20FE)
- ✅ Automatically inject appropriate `basic_jscript.js` based on device type
- ✅ API endpoints returning dummy data for `$.post("/api")` requests
- ✅ Serve static files (CSS, JS, images)
- ✅ No modification to original HTML files

## Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
# Copy sample configuration file
cp config.env .env

# Edit .env file to select device type
# DEVICE_TYPE=2GE8FE    # or 4GE12FE, 4GE20FE
```

3. Run server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Configuration

### Environment Variables

Create `.env` file from `config.env` and configure:

```env
# Device type (2GE8FE, 4GE12FE, 4GE20FE)
DEVICE_TYPE=2GE8FE

# Server port (default: 3000)
PORT=3000

# Environment (development/production)
NODE_ENV=development
```

### Supported Device Types

- **2GE8FE**: 10 ports (2 Gigabit + 8 Fast Ethernet)
- **4GE12FE**: 16 ports (4 Gigabit + 12 Fast Ethernet)
- **4GE20FE**: 24 ports (20 Gigabit + 4 Fast Ethernet)

## Usage

1. Start server:

```bash
npm start
```

2. Access interface:

```
http://localhost:3000/common/main.html
```

3. Test API endpoints:

```
http://localhost:3000/test-api.html
```

4. Other HTML files can be accessed via:

```
http://localhost:3000/common/dashboard.html
http://localhost:3000/common/system.html
http://localhost:3000/2GE8FE/multicast.html
http://localhost:3000/4GE12FE/wizard.html
```

## API Endpoints

Server provides API endpoints returning dummy data:

### POST /api

Handles requests from web interface:

```javascript
// Example request
$.post(
  "/api",
  {
    service: "system",
    access: "get",
    command: "get id",
  },
  function (data) {
    console.log(data);
  }
);
```

#### Supported Services:

- **system**: System information, uptime, config
- **user**: User management, logout
- **interface**: Interface states and port information
- **interfaces**: Port configuration and status
- **poe**: PoE information

#### Example Responses:

```json
// GET system info
{
  "sn": "ROQ123456789",
  "sw version": "1.0.0",
  "mgmt mac": "00:11:22:33:44:55",
  "part number": "006-130-120",
  "poe": true
}

// GET uptime
{
  "uptime": "5 days, 12 hours, 30 minutes"
}

// GET config name
{
  "cfgName": "default.cfg"
}

// GET interface states
[
  {"interface":1,"state":true,"duplex":true,"speed":100},
  {"interface":2,"state":true,"duplex":false,"speed":100},
  {"interface":3,"state":false,"duplex":false,"speed":100}
]
```

## Project Structure

```
roq-ui-interface/
├── WebContent/           # Original HTML, CSS, JS files
│   ├── common/          # Common files
│   ├── 2GE8FE/         # Files for 2GE8FE device
│   ├── 4GE12FE/        # Files for 4GE12FE device
│   └── 4GE20FE/        # Files for 4GE20FE device
├── server.js            # Main server
├── package.json         # Dependencies
├── config.env          # Sample configuration file
├── test-api.html       # API testing page
├── start.sh            # Quick start script
└── README.md           # This documentation
```

## Development

### Adding New Device Type

1. Add device directory in `WebContent/`
2. Update `getPartNumber()` and `getPortConfiguration()` in `server.js`
3. Add new option to `config.env`

### Adding New API Endpoint

1. Add new case in switch statement of corresponding service
2. Create new handler function
3. Update documentation

## Troubleshooting

### Common Issues

1. **Port already in use**: Change PORT in `.env`
2. **File not found**: Check file paths in `WebContent/`
3. **API not working**: Check JSON format of request

### Debug

Enable debug mode:

```bash
NODE_ENV=development npm start
```

## Quick Start

Use the provided script for easy setup:

```bash
# Make script executable
chmod +x start.sh

# Run quick start
./start.sh
```

## License

MIT
