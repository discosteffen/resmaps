
/*

function load() {
	var mydata = 	var mydata = JSON.stringify(message);
	alert(mydata[0].lon);
	alert(mydata[0].lat);
}


/*
ZeroChat.prototype.sendMessageAndroid = function() {
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
        "lon": document.getElementById("lon").value,
        "lat": document.getElementById("lat").value,
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



/*
$(function() {
  $.getJSON('data/users/' + this.site_info.auth_address + '/data.json', function(data) {
    var tblArr2 = [];

    $.each(message.post, function(i, f) {
       // sets newest post
       var tblRow = "<div>" + f.post_id + "</div>"
  //     tblArr2.push(f.post_id);
  //     dataTitle.push(f.title);
  //     dataBody.push(f.body);

  });

//  document.getElementById('innerLeft').innerHTML = (marked('this is __markdown__'));
// marked(this.getMarkdown(),
//  console.log(tblArr2[0])

 $( ".innerLeft" ).append( "<div id='projectTitle'>" + "<a href='?Post:"+tblArr2[0]+"'>"+ dataTitle[0] +"</a><br/><br/>" + (marked(dataBody[0].substr(0,200))) + " ..."
  + "<br/><br/>" + "<a href='?Post:"+tblArr2[0]+"'>Read more</a>" + "</div><br/>" );
      });
    }); */
