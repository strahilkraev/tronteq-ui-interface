var NumberNetworkPorts = 10;
var NumberSwitchPorts = 10;
var SwitchPorts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var SwitchPortsMaxSpeed = [1000, 100, 100, 100, 100, 1000, 100, 100, 100, 100];
var SwitchPortNames = [
  "G1",
  "P1",
  "P2",
  "P3",
  "P4",
  "G2",
  "P5",
  "P6",
  "P7",
  "P8",
];

var PoEClassW = [15.4, 4, 7, 15.4, 30];
var PoEUserPWRLimit = [30, 2, 4, 6, 8, 10, 12, 15, 20, 24, 18];
var PoEPortName = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"];
var PoEPorts = 8;

var Order = [0, 5, 1, 2, 3, 4, 6, 7, 8, 9];

var info_div = null;

function setupPortInfo(callback) {
  $.post(
    "/api",
    '{"service":"system","access":"get","command":"get id"}',
    function (data) {
      if (
        data["part number"] == "006-130-132" ||
        data["part number"] == "006-130-133"
      ) {
        SwitchPortsMaxSpeed = [
          1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
        ];
        SwitchPortNames = [
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
        ];
        PoEPortName = ["G2", "G3", "G4", "G5", "G7", "G8", "G9", "G10"];
        Order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      } else if (
        data["part number"] == "006-130-120" ||
        data["part number"] == "006-130-119"
      ) {
        NumberNetworkPorts = 8;
        NumberSwitchPorts = 8;
        SwitchPorts = [0, 1, 2, 3, 4, 5, 6, 7];
        SwitchPortsMaxSpeed = [100, 100, 100, 100, 100, 100, 100, 100];
        SwitchPortNames = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"];
        PoEPortName = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"];
        Order = [0, 1, 2, 3, 4, 5, 6, 7];
      }
      callback();
    }
  );
}

function validate_ipv4(address) {
  if (address.split(".").length == 4) {
    var part = address.split(".");
    for (var i = 0; i < 4; i++) {
      var numb = Number(part[i]);
      var re = isNaN(numb) || numb < 0 || numb > 255;
      if (isNaN(numb) || numb < 0 || numb > 255 || part[i].length == 0)
        return false;
    }
    return true;
  }
  return false;
}

function validate_ip(event) {
  var obj = document.getElementById(event.target.id);
  if (validate_ipv4(obj.value) || obj.value.length == 0)
    obj.style.background = "";
  else obj.style.background = "#E00034";
}

function validate_mac_address(address) {
  address = address.replace(/-/g, ":");
  if (address.split(":").length == 6) {
    var part = address.split(":");
    for (var i = 0; i < 6; i++) {
      var numb = Number("0x" + part[i]);
      var re = isNaN(numb) || numb < 0 || numb > 255;
      if (isNaN(numb) || numb < 0 || numb > 255) return false;
    }
    return true;
  }
  return false;
}

function validate_mac(event) {
  var obj = document.getElementById(event.target.id);
  if (validate_mac_address(obj.value)) obj.style.background = "";
  else obj.style.background = "#E00034";
}

function check_azAz09(string, OK) {
  for (var i = 0; i < string.length; i++) {
    if (OK !== undefined) {
      if (OK.split(string.charAt(i)).length == 2) continue;
    }
    var j = string.charCodeAt(i);
    if (j < 48) return false;
    if (j > 57 && j < 65) return false;
    if (j > 90 && j < 97) return false;
    if (j > 122) return false;
  }
  return true;
}

function check_textbox(dom_obj, min, max, name) {
  if (dom_obj.value.length < min) {
    alert(name + " must be at least " + min + " character");
    return false;
  }
  if (dom_obj.value.length > max) {
    alert(name + " must be at most " + max + " character");
    return false;
  }
  if (!check_azAz09(dom_obj.value, "")) {
    alert(name + " contains not allowed character. Only use A-Z, a-z, 0-9");
    return false;
  }
  return true;
}

function color_textbox(event, min, max) {
  var obj = document.getElementById(event.target.id);
  if (obj.value.length < min) {
    obj.style.background = "#E00034";
    return;
  }
  if (obj.value.length > max) {
    obj.style.background = "#E00034";
    return;
  }
  if (!check_azAz09(obj.value)) {
    obj.style.background = "#E00034";
    return;
  }
  obj.style.background = "";
  return;
}

function ffunc(str) {
  create_overlay(str, "overlay_message_error", 5000);
}

function createOK(data) {
  if (
    info_div == undefined ||
    info_div == null ||
    info_div.className != "overlay_message_ok"
  )
    create_overlay("Configuration transmitted", "overlay_message_ok", 2000);
}

function create_overlay(text, type, time) {
  var di = document.createElement("div");
  di.className = type;
  var p = document.createElement("p");
  p.textContent = text;
  p.style.marginLeft = "10px";
  di.appendChild(p);
  if (info_div != null) {
    document.body.removeChild(info_div);
    info_div = null;
  }
  document.body.appendChild(di);
  info_div = di;

  setTimeout(function () {
    if (info_div != null) {
      document.body.removeChild(info_div);
      info_div = null;
    }
  }, time);
}

function compareNumbers(a, b) {
  return a - b;
}

function getPortsSorted(data) {
  bonds = [];
  g = [];
  p = [];

  for (str of data) {
    if (str.startsWith("Bond")) {
      bonds.push(parseInt(str.substr(4)));
    } else if (str.startsWith("G")) {
      g.push(parseInt(str.substr(1)));
    } else if (str.startsWith("P")) {
      p.push(parseInt(str.substr(1)));
    }
  }
  g = g.sort(compareNumbers);
  g = g.map((x) => "G" + x);
  p = p.sort(compareNumbers);
  p = p.map((x) => "P" + x);
  bonds = bonds.sort(compareNumbers);
  bonds = bonds.map((x) => "Bond" + x);

  return g.concat(p).concat(bonds);
}

function autoRefreshFn({ time = 10000, fn = () => {} }) {
  setInterval(function () {
    fn();
  }, time);
}
