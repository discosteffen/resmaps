

/* ---- data/1AvF5TpcaamRNtqvN1cnDEWzNmUtD47Npg/js/lib/ZeroFrame.coffee ---- */


(function() {
  var ZeroFrame,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  ZeroFrame = (function() {
    function ZeroFrame(url) {
      this.onCloseWebsocket = __bind(this.onCloseWebsocket, this);
      this.onOpenWebsocket = __bind(this.onOpenWebsocket, this);
      this.route = __bind(this.route, this);
      this.onMessage = __bind(this.onMessage, this);
      this.url = url;
      this.waiting_cb = {};
      this.connect();
      this.next_message_id = 1;
      this.init();
    }

    ZeroFrame.prototype.init = function() {
      return this;
    };

    ZeroFrame.prototype.connect = function() {
      this.target = window.parent;
      window.addEventListener("message", this.onMessage, false);
      return this.cmd("innerReady");
    };

    ZeroFrame.prototype.onMessage = function(e) {
      var cmd, message;
      message = e.data;
      cmd = message.cmd;
      if (cmd === "response") {
        if (this.waiting_cb[message.to] != null) {
          return this.waiting_cb[message.to](message.result);
        } else {
          return this.log("Websocket callback not found:", message);
        }
      } else if (cmd === "wrapperReady") {
        return this.cmd("innerReady");
      } else if (cmd === "ping") {
        return this.response(message.id, "pong");
      } else if (cmd === "wrapperOpenedWebsocket") {
        return this.onOpenWebsocket();
      } else if (cmd === "wrapperClosedWebsocket") {
        return this.onCloseWebsocket();
      } else {
        return this.route(cmd, message);
      }
    };

    ZeroFrame.prototype.route = function(cmd, message) {
      return this.log("Unknown command", message);
    };

    ZeroFrame.prototype.response = function(to, result) {
      return this.send({
        "cmd": "response",
        "to": to,
        "result": result
      });
    };

    ZeroFrame.prototype.cmd = function(cmd, params, cb) {
      if (params == null) {
        params = {};
      }
      if (cb == null) {
        cb = null;
      }
      return this.send({
        "cmd": cmd,
        "params": params
      }, cb);
    };

    ZeroFrame.prototype.send = function(message, cb) {
      if (cb == null) {
        cb = null;
      }
      message.id = this.next_message_id;
      this.next_message_id += 1;
      this.target.postMessage(message, "*");
      if (cb) {
        return this.waiting_cb[message.id] = cb;
      }
    };

    ZeroFrame.prototype.log = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return console.log.apply(console, ["[ZeroFrame]"].concat(__slice.call(args)));
    };

    ZeroFrame.prototype.onOpenWebsocket = function() {
      return this.log("Websocket open");
    };

    ZeroFrame.prototype.onCloseWebsocket = function() {
      return this.log("Websocket close");
    };

    return ZeroFrame;

  })();

  window.ZeroFrame = ZeroFrame;

}).call(this);


/* ---- data/1AvF5TpcaamRNtqvN1cnDEWzNmUtD47Npg/js/utils/Text.coffee ---- */


(function() {
  var Text;

  Text = (function() {
    function Text() {}

    Text.prototype.toColor = function(text, saturation, lightness) {
      var hash, i, _i, _ref;
      if (saturation == null) {
        saturation = 30;
      }
      if (lightness == null) {
        lightness = 40;
      }
      hash = 0;
      for (i = _i = 0, _ref = text.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        hash += text.charCodeAt(i) * i;
        hash = hash % 1777;
      }
      return "hsl(" + (hash % 360) + ("," + saturation + "%," + lightness + "%)");
    };

    return Text;

  })();

  window.Text = new Text();

}).call(this);


/* ---- data/1AvF5TpcaamRNtqvN1cnDEWzNmUtD47Npg/js/utils/Time.coffee ---- */


(function() {
  var Time;

  Time = (function() {
    function Time() {}

    Time.prototype.since = function(time) {
      var back, now, secs;
      now = +(new Date) / 1000;
      secs = now - time;
      if (secs < 60) {
        back = "Just now";
      } else if (secs < 60 * 60) {
        back = (Math.round(secs / 60)) + " minutes ago";
      } else if (secs < 60 * 60 * 24) {
        back = (Math.round(secs / 60 / 60)) + " hours ago";
      } else if (secs < 60 * 60 * 24 * 3) {
        back = (Math.round(secs / 60 / 60 / 24)) + " days ago";
      } else {
        back = "on " + this.date(time);
      }
      back = back.replace(/1 ([a-z]+)s/, "1 $1");
      return back;
    };

    Time.prototype.date = function(timestamp, format) {
      var display, parts;
      if (format == null) {
        format = "short";
      }
      parts = (new Date(timestamp * 1000)).toString().split(" ");
      if (format === "short") {
        display = parts.slice(1, 4);
      } else {
        display = parts.slice(1, 5);
      }
      return display.join(" ").replace(/( [0-9]{4})/, ",$1");
    };

    Time.prototype.timestamp = function(date) {
      if (date == null) {
        date = "";
      }
      if (date === "now" || date === "") {
        return parseInt(+(new Date) / 1000);
      } else {
        return parseInt(Date.parse(date) / 1000);
      }
    };

    return Time;

  })();

  window.Time = new Time;

}).call(this);


/* ---- data/1AvF5TpcaamRNtqvN1cnDEWzNmUtD47Npg/js/ZeroChat.coffee ---- */


(function() {
  var ZeroChat,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  ZeroChat = (function(_super) {
    __extends(ZeroChat, _super);

    function ZeroChat() {
      this.onOpenWebsocket = __bind(this.onOpenWebsocket, this);
      this.sendMessage = __bind(this.sendMessage, this);
      this.selectUser = __bind(this.selectUser, this);
      return ZeroChat.__super__.constructor.apply(this, arguments);
    }

    ZeroChat.prototype.init = function() {
      return this.addLine("inited!");
    };

    ZeroChat.prototype.selectUser = function() {
      Page.cmd("certSelect", [["zeroid.bit", "zeroverse.bit"]]);
      return false;
    };

    ZeroChat.prototype.route = function(cmd, message) {
      if (cmd === "setSiteInfo") {
        if (message.params.cert_user_id) {
          document.getElementById("select_user").innerHTML = message.params.cert_user_id;
        } else {
          document.getElementById("select_user").innerHTML = "Select user";
        }
        this.site_info = message.params;
        if (message.params.event[0] === "file_done") {
          return this.loadMessages();
        }
      }
    };


    ZeroChat.prototype.sendMessage = function() {
      var inner_path;
      if (!Page.site_info.cert_user_id) {
        Page.cmd("wrapperNotification", ["info", "Please, select your account."]);
        return false;
      }

      document.getElementById("message").disabled = true;
      inner_path = "data/users/" + this.site_info.auth_address + "/data.json";
      this.cmd("fileGet", {
        "inner_path": inner_path,
        "required": false
      }, (function(_this) {
        return function(data) {
          var json_raw;
          if (data) {
            data = JSON.parse(data);
          } else {
            data = {
              "message": []
            };
          }
          data.message.push({
            "body": document.getElementById("message").value,
//            "lon": document.getElementById("lon").value,
              "lon": AndroidFunctionLong.getString(),
              "lat": AndroidFunctionLat.getString(),
//            "lat": document.getElementById("lat").value,
            "date_added": +(new Date)
          });
          json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
          return _this.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
            if (res === "ok") {
              return _this.cmd("sitePublish", {
                "inner_path": inner_path
              }, function(res) {
                document.getElementById("message").disabled = false;
                document.getElementById("message").value = "";
                document.getElementById("message").focus();
                return _this.loadMessages();
              });
            } else {
              _this.cmd("wrapperNotification", ["error", "File write error: " + res]);
              return document.getElementById("message").disabled = false;
            }
          });
        };
      })(this));
      return false;
    };

    ZeroChat.prototype.loadMessages = function(mode) {
      var query;
      if (mode == null) {
        mode = "normal";
      }
      query = "SELECT message.*, keyvalue.value AS cert_user_id FROM message\nLEFT JOIN json AS data_json USING (json_id)\nLEFT JOIN json AS content_json ON (\n    data_json.directory = content_json.directory AND content_json.file_name = 'content.json'\n)\nLEFT JOIN keyvalue ON (keyvalue.key = 'cert_user_id' AND keyvalue.json_id = content_json.json_id)\nORDER BY date_added DESC";
      if (mode !== "nolimit") {
        query += " LIMIT 100";
      }
      this.cmd("dbQuery", [query], (function(_this) {
        return function(messages) {
          var added, body, message, message_lines, _i, _len;

          var newDate = 0;

          document.getElementById("messages").innerHTML = "";
          message_lines = [];

          // lon and lat arr added. No bueno yet.
          var latArr = [];
          var lonArr = [];
          var userList = [];
          var counter = 0;

          for (_i = 0, _len = messages.length; _i < _len; _i++) {
            message = messages[_i];
        //    console.log(message);
            if (message.date_added > (+(new Date)) + 60 * 3) {
              continue;
            }

              userList[_i] = message.cert_user_id;
              latArr[_i] = message.lat;
              lonArr[_i] = message.lon;

//            console.log(JSON.stringify(messages)); // gives us a parsed json of compelte db

            // the two lines below work to display data. however, it does not replace data yet.
            //            console.log(message.lat); // fix the race condition
              //  document.getElementById('demo').innerHTML += '<br/>' + 'User: ' + message.cert_user_id + ' New Long : ' + message.lon + ' New Lat : ' + message.lat;
              // remove above to display all coordinates.

              //            myFunction();
              //            console.log(latArr, lonArr);

/*
                L.marker([message.lat, message.lon]).addTo(map)
                  .bindPopup("<b>new coordinates for user :</b> " + message.cert_user_id +" <br />Long: " + message.lon + "Lat: " + message.lat + " counter: " + counter).openPopup();
                  newDate = message.date_added;
                  counter++;
*/
            //      console.log(newDate);


// need to add replace here as well.
            lon = message.lon.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            lat = message.lat.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            body = message.body.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            added = new Date(message.date_added);
//            message_lines.push("<li><small title='" + added + "'>" + (Time.since(message.date_added / 1000)) + "</small> <b style='color: " + (Text.toColor(message.cert_user_id)) + "'>" + (message.cert_user_id.replace('@zeroid.bit', '')) + "</b>: " + body + "</li>");
// above triggers / removes chat box.
          }

// following is attempt to sort by user... Not working yet...
          var userSort;
          var usersUnique = [];
          for (_i = 0, _len = messages.length; _i < _len; _i++) {
            if (message.date_added > (+(new Date)) + 60 * 3) {
              continue;
            }
            userSort = messages[_i];
            usersUnique[_i] = messages[_i];

//            console.log(userSort); // shows entire user info.
  //          console.log(message.cert_user_id);
          }
//          console.log(usersUnique[14]);

/*      var obj = messages;
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          var val = obj[key];
          console.log((val));
        }
      }
*/


// finds unique linked ID to cert user ID. What good is this though?
var array = messages;
var unique = {};
var distinct = [];

      for( var i in array ){
       if( typeof(unique[array[i].json_id]) == "undefined"){
        distinct.push(array[i].cert_user_id);
       }
       unique[array[i].json_id] = 0;
      }

//console.log(distinct);

var results = [];
var lats = [];
var longs = [];
var searchField = "cert_user_id";
//var obj2 = messages;

//console.log(distinct);

// another test

var seats = [];
var numbers = [];

for (var i = 0; i < array.length; i++){
  seats[i] = array[i].cert_user_id;
//  console.log(seats[i]);
}


// shows last known lat and long per user.
document.getElementById('demo').innerHTML = ' ';

for (var x = 0 ; x < distinct.length; x++){
  console.log(distinct[x] + " is at : "+ lastUserLocation() + " Lon : " + lonArr[lastUserLocation()] + " Lat : " + latArr[lastUserLocation()]);

  document.getElementById('totalUsers').innerHTML = 'Total Users: ' + (x+1);
  document.getElementById('demo').innerHTML += '<br/>' + ' User : ' + distinct[x] + ' Is at (arraylocation) : ' +  lastUserLocation() + " Lon : " + lonArr[lastUserLocation()] + " Lat : " + latArr[lastUserLocation()];

  // currently shows only the last distinct x in the loop. need to do each step. hm.


// need to do something about coordinates being undefined... This causes map to not load.
//if (typeof variable === 'undefined')


if(latArr[lastUserLocation()] == null)
//(typeof latArr[lastUserLocation()] === 'undefined')
{
    // quickfix for undefined variable. this wont work once we pass the count for separate users. Need to do a + 1 per user for this scenario or solve in different way
    console.log("Error, delayed post for newest GPS, Will update soon loading dirrect from jscript variable instead of db");
    L.marker([latArr[x+1], lonArr[x+1]]).addTo(map)
      .bindPopup("<b>new coordinates for user :</b> " + distinct[x+1] +" <br />Long: " + lonArr[lastUserLocation()+1] + "Lat: " + latArr[lastUserLocation()+1]).openPopup();
      newDate = message.date_added;

}
else{

    console.log("Load away");
    L.marker([latArr[lastUserLocation()], lonArr[lastUserLocation()]]).addTo(map)
      .bindPopup("<b>new coordinates for user :</b> " + distinct[x] +" <br />Long: " + lonArr[lastUserLocation()] + "Lat: " + latArr[lastUserLocation()]).openPopup();
      newDate = message.date_added;

}
  numbers[x] = lastUserLocation();
//  console.log(numbers); just displays the numbers in the array of users logged
}

function lastUserLocation()
{
    for(index in seats)
    {
        if(seats[index] === distinct[x])
            return index;
    }
    return -1;
}

//console.log(lastUserLocation());

// check nr of entry place.


for (var x = 0 ; x < distinct.length; x++){

  var searchVal = distinct[x];

  for (var i=0 ; i < usersUnique.length ; i++)
  {
      if (usersUnique[i][searchField] == searchVal) {
  //        results.push(usersUnique[i].lon);
//          console.log(usersUnique[i][searchField]);
  //        console.log(searchVal);
      }
      else {

      }

    //console.log(usersUnique[i][searchField]);
  //console.log(searchField);
  }

//    console.log(searchVal);
//  console.log(results);
//  console.log(distinct[x] + " " + x);

}


//console.log(unique);


//          console.log(message.cert_user_id);
          // This following loop should give us newest post for all users. need to sort out unique id first though

/*

          console.log("date added prior" + newDate);
          var message2;
          for (_i = messages.length, _len = 0; _i >= _len; _i--) {
            message2 = messages[_i];
      //      console.log(message2);
          }
          console.log(message2);
          //console.log(message.date_added);

*/

// shows unique users
  // by removing duplicates from user Array.
result = removeDuplicates(userList);
//  console.log(userList);
//  console.log(result);


            // this output gives us either the first or last Lat and Long of ALL the users..
            // need to first sort by users then the loop to add coords to this array per user.

            //make this a good loop to display unique users woth their coordinates.... Then we can style from there... Also separate main and dashboard pages.
//            document.getElementById('demo').innerHTML = '<br/>' + ' New Long : ' + latArr[1] + ' User : ' + userList[1];
            //document.getElementById('demo').innerHTML = '<br/>' + ' New Long : ' + latArr[messages.length-1] + ' User : ' + userList[messages.length-1];


            var resultPrint

              resultPrint = '<br/>' + ' User : ' + result[0] + " Count: " + 0;
            for(var _k = 1; _k < result.length; _k++){
            //  document.getElementById('users').innerHTML += '<br/>' + ' User : ' + result[_k];
              resultPrint += '<br/>' + ' User : ' + result[_k] + " Count: " + _k;
            }

//            document.getElementById('users').innerHTML = resultPrint;
//            console.log(resultPrint)

            //console.log(latArr[1], lonArr[1]);

            //console.log(userList);

            // newest post loop end

          if (mode !== "nolimit") {
            message_lines.push("<li><a href='#More' onclick='this.style.opacity = 0.4; return Page.loadMessages(\"nolimit\"); '>Load more messages...</a></li>");
          }
          return document.getElementById("messages").innerHTML = message_lines.join("\n");
        };
      })(this));
      return false;
    };

    function removeDuplicates(num) {
      var x,
          len=num.length,
          out=[],
          obj={};

      for (x=0; x<len; x++) {
        obj[num[x]]=0;
      }
      for (x in obj) {
        out.push(x);
      }
      return out;
    }


    ZeroChat.prototype.addMapCords = function(cords) {
      var messages;
      messages = document.getElementById("messages");
      return messages.innerHTML = ("<li>" + line + "</li>") + messages.innerHTML;
    };



    ZeroChat.prototype.addLine = function(line) {
      var messages;
      messages = document.getElementById("messages");
      return messages.innerHTML = ("<li>" + line + "</li>") + messages.innerHTML;
    };

    ZeroChat.prototype.onOpenWebsocket = function(e) {
      this.cmd("siteInfo", {}, (function(_this) {
        return function(site_info) {
          if (site_info.cert_user_id) {
            document.getElementById("select_user").innerHTML = site_info.cert_user_id;
          }
          return _this.site_info = site_info;
        };
      })(this));
      return this.loadMessages();
    };

    return ZeroChat;

  })(ZeroFrame);

  window.Page = new ZeroChat();

}).call(this);
