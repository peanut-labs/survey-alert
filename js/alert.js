// Generated by CoffeeScript 1.7.1
(function() {
  var PeanutLabsAlert, Util,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Util = (function() {
    function Util() {}

    Util.extend = function(a, b) {
      var key;
      for (key in b) {
        if (b.hasOwnProperty(key)) {
          a[key] = b[key];
        }
      }
      return a;
    };

    return Util;

  })();

  PeanutLabsAlert = (function() {
    var API_URL, DEFAULTS, EL_ID;

    function PeanutLabsAlert() {
      this.handleAlert = __bind(this.handleAlert, this);
    }

    EL_ID = 'PL_Alert';

    API_URL = '/publisher/api/v1/campaigns_summary';

    DEFAULTS = {
      server: 'http://api.peanutlabs.com',
      alertWidth: 450,
      positionVertical: 'bottom',
      positionHorizontal: 'right',
      colorBg: '333333',
      colorFg: 'ffffff',
      colorFont: 'ffffff',
      colorBorder: '000000',
      colorLink: 'ffffff',
      hideAfter: 15,
      debugEnabled: false,
      iframeURL: ''
    };

    PeanutLabsAlert.prototype.initialize = function(options) {
      options || (options = {});
      this.ops = this.options = Util.extend(DEFAULTS, options);
      if (this.validated()) {
        return this.sendRequest();
      }
    };

    PeanutLabsAlert.prototype.validated = function() {
      if (!(this.ops.userId.indexOf('-') >= 0)) {
        this.printDebug('Invalid Parameter: userId');
        return false;
      }
      if (!(this.ops.iframeURL.indexOf('http') >= 0)) {
        this.printDebug('Invalid Parameter: iframeURL');
        return false;
      }
      return true;
    };

    PeanutLabsAlert.prototype.sendRequest = function() {
      var head, script;
      script = document.createElement('script');
      script.src = this.getAPIUrl();
      head = document.getElementsByTagName('head')[0];
      return head.appendChild(script);
    };

    PeanutLabsAlert.prototype.getAPIUrl = function() {
      return "" + this.options.server + API_URL + "?user_id=" + this.options.userId + "&jsonp=PeanutLabsAlert.handleAlert";
    };

    PeanutLabsAlert.prototype.canShowAlert = function(data) {
      return (data.surveys.status === 'profiled' && data.surveys.count > 0) || (data.surveys.status === 'profiler_available');
    };

    PeanutLabsAlert.prototype.handleAlert = function(data) {
      data.surveys || (data.surveys = {});
      this.response = data;
      return this.showAlert();
    };

    PeanutLabsAlert.prototype.getContent = function() {
      var content;
      content = {};
      if (this.response.surveys.status === 'profiled') {
        content = {
          title: "You have surveys waiting for you!",
          body: "You qualify for " + this.response.surveys.count + " surveys. Earn up to " + this.response.surveys.total_reward + " " + this.response.surveys.currency_name + "!",
          footer: ''
        };
      } else {
        content = {
          title: 'Profile and earn!',
          body: 'Earn Mo money'
        };
      }
      return content;
    };

    PeanutLabsAlert.prototype.showAlert = function() {
      var content, div, style;
      style = document.createElement('style');
      style.innerHTML = this.getStyles();
      document.getElementsByTagName('head')[0].appendChild(style);
      div = document.createElement('div');
      div.id = EL_ID;
      div.style.zIndex = 100000;
      div.style.position = 'fixed';
      div.style.padding = '0px';
      div.style.paddingLeft = '10px';
      div.style.paddingTop = '0px';
      div.style.width = "" + this.ops.alertWidth + "px";
      div.style[this.ops.positionVertical] = 0;
      div.style[this.ops.positionHorizontal] = 0;
      div.onmouseover = (function(_this) {
        return function() {
          return clearTimeout(_this.hideTimer);
        };
      })(this);
      div.onmouseout = (function(_this) {
        return function() {
          return _this.scheduleHideAlert();
        };
      })(this);
      content = this.getContent();
      div.innerHTML = this.alertTplNew(content.title, content.body, content.footer);
      document.getElementsByTagName('body')[0].appendChild(div);
      div.className = 'notification';
      document.getElementById('Peanut_id_hide').onclick = (function(_this) {
        return function() {
          return _this.hideAlert();
        };
      })(this);
      this.hidden = false;
      return this.animateIn(div, -1 * this.ops.alertWidth, 10, (function(_this) {
        return function() {
          return _this.scheduleHideAlert();
        };
      })(this));
    };

    PeanutLabsAlert.prototype.animate = function(el, from, to, direction, doneAnimating) {
      var new_from;
      if ((direction === 'in' && from >= to) || (direction === 'out' && to >= from)) {
        if (doneAnimating) {
          doneAnimating();
        }
        return;
      }
      el.style[this.ops.positionHorizontal] = "" + from + "px";
      if (direction === 'in') {
        new_from = from + 25;
      } else {
        new_from = from - 25;
      }
      return setTimeout(((function(_this) {
        return function() {
          return _this.animate(el, new_from, to, direction, doneAnimating);
        };
      })(this)), 25);
    };

    PeanutLabsAlert.prototype.animateIn = function(el, from, to, doneAnimating) {
      return this.animate(el, from, to, 'in', doneAnimating);
    };

    PeanutLabsAlert.prototype.animateOut = function(el, from, to, doneAnimating) {
      return this.animate(el, from, to, 'out', doneAnimating);
    };

    PeanutLabsAlert.prototype.scheduleHideAlert = function() {
      return this.hideTimer = setTimeout(((function(_this) {
        return function() {
          return _this.hideAlert();
        };
      })(this)), this.ops.hideAfter * 1000);
    };

    PeanutLabsAlert.prototype.hideAlert = function() {
      var el;
      clearTimeout(this.hideTimer);
      el = this.getAlertElement();
      return this.animateOut(el, 0, -400, ((function(_this) {
        return function() {
          return el.parentNode.removeChild(el);
        };
      })(this)));
    };

    PeanutLabsAlert.prototype.getAlertElement = function() {
      return document.getElementById(EL_ID);
    };

    PeanutLabsAlert.prototype.getStyles = function() {
      return "   #PL_Alert {\n    background-color: rgba(237,239,242,.70);\n    -webkit-border-radius: 4px;\n    -webkit-box-shadow: 0 2px 5px rgba(0,0,0,.1), inset 0 -1px 0 rgba(255,255,255,.15), 0 0 6px rgba(0,0,0,.08), 0 0 0 1px rgba(35,47,64,.5);\n    background-image: -webkit-linear-gradient(90deg, rgba(218,223,230,.45) 0%, rgba(218,223,230,0) 100%);\n    color: rgba(67,76,89,.9);\n    text-shadow: 0 1px 0 rgba(255,255,255,.85);\n    font: 12px/1.5 \"Lucida Grande\", \"Lucida Sans Unicode\", \"Lucida Sans\", \"DejaVu Sans\", Verdana, sans-serif;\n    position: absolute;\n    overflow:hidden;\n   }\n   \n   #PL_Alert > div {\n    border: none;\n    background-color: rgba(255,255,255,.15);\n    -webkit-border-radius: 4px;\n    -webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,.55);\n    background: -webkit-linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.75) 100%);\n    height: 100%;\n    width:100%;\n    display: table;\n   }\n   \n   #PL_Alert >div >div {\n    border: none;\n    background-color: rgba(255,255,255,.15);\n    -webkit-border-radius: 4px;\n    -webkit-box-shadow: inset 0 -3px 2px rgba(58,71,89,.04);\n    overflow: hidden;\n    position: relative;\n    display: table-row;\n   }\n\n   #PL_Alert :hover {\n    border-color: rgba(0,0,0,1);\n    background-color: rgba(237,239,242,1);\n    cursor:pointer;\n   }\n\n   #PL_Alert :hover .close {\n    display: block;\n   }\n\n   #PL_Alert_icon {\n    padding: 15px;\n    display: table-cell;\n    vertical-align: top;\n    text-align: center;\n    min-width: 48px;\n    width: auto;\n    min-height: 100%;\n    height: 100%;\n    border-bottom-left-radius: 4px;\n    border-bottom-right-radius: 0;\n    border-top-left-radius: 4px;\n    border-top-right-radius: 0px;\n    background-repeat: no-repeat;\n    background-position: center center;\n    background-color: rgba(26,57,102,.05);\n    -webkit-box-shadow: 1px 0 0 rgba(255,255,255,.35), inset -1px 0 0 rgba(58,71,89,.1);\n    background-image: none !important;\n   }\n\n   #PL_Alert_icon img {\n    min-width: 48px;\n    min-height: 48px;\n    max-width: 256px;\n    max-height: 256px;\n    vertical-align: top;\n    margin: 0;\n    padding: 0;\n    float: left;\n    border-radius: 3px;\n   }\n\n   #PL_Alert_content {\n    display: table-cell;\n    vertical-align: top;\n    padding: 10px 15px;\n   }\n   #PL_Alert_content_title {\n    color: rgba(67,76,89,.9);\n    font-size: 12px;\n    margin: 5px 0 0 0px;\n   }\n   PL_Alert_content_body {\n    margin: 5px 10px 5px 0px;\n   }\n  /* a, a:visited {\n    font-weight: bold;\n    color: rgba(67,76,89,.9);\n    text-decoration: none;\n   }\n   a:hover {\n    color: rgba(0,0,0,0.81);\n   }\n   .trigger {\n    color: white !important;\n    font-size: 30px !important;\n   }\n   .close {\n    position: absolute;\n    right: 8px;\n    top: 6px;\n    font-size: 12px;\n    color: #000000;\n    z-index: 999;\n    display: none;\n   }*/";
    };

    PeanutLabsAlert.prototype.alertTplNew = function(title, body, footer) {
      var html;
      return html = "<a class=\"close\" href=\"javascript: void(0);\" id=\"Peanut_id_hide\">X</a>\n<div>\n  <div>\n  	<span id=\"PL_Alert_icon\"> <img width=\"128\" alt=\"icon\" src=\"ipad.png\"></span>\n    	<div id=\"PL_Alert_content\">\n        <h1 id=\"PL_Alert_content_title\">" + title + "</h1>\n        <p id=\"PL_Alert_content_body\">" + body + " <a href=\"#\">Click here</a></p>\n      </div>\n  </div>\n</div>";
    };

    PeanutLabsAlert.prototype.alertTpl = function(title, body, footer) {
      var html;
      return html = "<div style=\"z-index:1000; float:right; display:block; width:350px; background:#" + this.ops.colorBg + "; border:4px solid#" + this.ops.colorBorder + "; font-family:Verdana, Geneva, sans-serif; font-size:13px; padding:0px;\">\n  <div style=\" padding-left:5px; padding-right:5px; padding-top:2px; padding-bottom:7px; width:343px; float:left; background-color:#" + this.ops.colorBorder + ";\">\n    <div id=\"Title_container\" style=\"float:left;\">\n      <a style=\"text-decoration:none; color:#" + this.ops.colorFg + ";\" target=\"_blank\" href=\"" + this.ops.iframeURL + "\">\n        <b>" + title + "</b>\n      </a>\n    </div>\n    <div style=\"float:right;\">\n      <div style=\"float:right; width:17px\">\n        <b>\n          <a style=\"text-decoration: none; color:#" + this.ops.colorFg + ";\" id=\"Peanut_id_hide\" href=\"javascript: void(0);\">\n              &nbsp;X&nbsp;&nbsp;&nbsp;\n          </a>\n        </b>\n      </div>\n    </div>\n  </div>\n  <div style=\" border:0px solid#" + this.ops.colorBorder + "; font-size:16px; background-color:#" + this.ops.colorBg + "; float:right; padding:10px; width:330px;\">\n    <div style=\"padding-right:10px; background-color:#" + this.ops.colorBg + "; float:left;\">\n      <a style=\"text-decoration:none; color:#" + this.ops.colorBg + ";\" class=\"go\" href=\"#\">\n      </a>\n    </div>\n    <a id=\"Body_container\" style=\"text-decoration: none; color:#" + this.ops.colorLink + ";\" target=\"_blank\" href=\"" + this.ops.iframeURL + "\">\n     " + body + "\n    </a>\n    <div style=\"float:left; font-size:10px; font-weight:bold; color:#" + this.ops.colorFont + "\">\n     " + footer + "\n    </div>\n  </div>\n</div>";
    };

    PeanutLabsAlert.prototype.printDebug = function(msg) {
      if (!this.ops.debugEnabled) {
        return;
      }
      return console.log("Debug Msg: " + msg);
    };

    return PeanutLabsAlert;

  })();

  window.PeanutLabsAlert = new PeanutLabsAlert();

}).call(this);
