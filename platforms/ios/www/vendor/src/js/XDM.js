(function() {
  "use strict";
  var minXDM = {
    response: function() {},
    go: function(
      _method = "GET",
      uri = "category",
      _data = {},
      _response
    ) {
      this.win = Core.restIframe.contentWindow;
      this.response = _response;
      this.win.postMessage(
        {
          method: _method,
          param: uri,
          data: _data
        },
        "*"
      );
    }
  };
  function listener(_e) {
    minXDM.response(_e);
  }
  if (window.addEventListener) {
    window.addEventListener("message", listener, false);
  } else {
    window.attachEvent("onmessage", listener);
  }
  window["minXDM"] = minXDM;
})();
