$.widget( "mtvui.scanDeviceDialog", {
    open: function() {
        var self = this;
        var dlg = this.element;
        self._update();
        dlg.show(); // show it first, then the operation depends on .offset() will work
        self._reset();
        dlg.find('button').first().focus();
    },
    close: function() {
        this.element.hide();
        this._reset();
        this._trigger( "close", this);
    },
    _setOption: function( key, value ) {
        this.options[ key ] = value;
        this._update();
    },
    _update: function () {
        var dlg = this.element;
        var changed = false;
        $.each(this.options.devList, function (k, v) {
            var item = dlg.find("ul>li[data-id=" + v.id +"]");
            item.find("img").attr("src", v.newIcon || v.icon);
            item.find("p").text(v.newName || v.name);
            if ((v.newName && v.newName != v.name)
                || (v.newIcon && v.newIcon != v.icon))
                changed = true;
        });
        if (changed)
            this._btnObj('done').removeClass('disabled');
        else
            this._btnObj('done').addClass('disabled');
    },
    _reset: function () {
        this.options.newName = null;
        this.options.newIcon = null;
    },
    _btnObj: function (arg) {
        var btnNames = {"close":0, "scan":1, "done":2};
        return this.element.find(".foot button").eq(btnNames[arg]);
    },
    _create: function() {
        var list = this.options.devList;
        if (!list || list.length <= 0) {
            devDom.html("<li />"); // empty item
            return;
        }
        var self = this;
        var dlg = this.element;
        var body = dlg.find(".body");
        var foot = dlg.find(".foot");
        var devDom = body.find("ul");
        var getColMax = function(len) {
            const COLMAX = 4;// cards per row
            return Math.min(len, COLMAX);
        };
        devDom.html("");
		var g_mtvObj = new MtvObj();
        $.each(list, function (k, v) {
			if (v.name == "BLU_RAY" || v.name == "DVD" || v.name == "HDD_DVDR" || v.name == "RECORDER" 
				|| v.name == "VCR" || v.name == "PC" || v.name == "GAME" || v.name == "DIG_STB"){
				v.name = g_mtvObj.getLangString(v.name);
			}
            var item = $('<li data-id="'
                         + v.id + '"><img src="'
                         + v.icon + '" style="width:64px; height:64px"><p>'
                         + v.name + '</p></li>');
            item.appendTo(devDom);
        });
        dlg.on('keydown', function (evt) {
            var key = evt.which || evt.keyCode;
            if (key == KeyEvent.DOM_VK_BACK) {
                self.close();
                return false;
            }
            if ($.inArray(key, [KeyEvent.DOM_VK_UP,
                                KeyEvent.DOM_VK_DOWN,
                                KeyEvent.DOM_VK_LEFT,
                                KeyEvent.DOM_VK_RIGHT,
                                KeyEvent.DOM_VK_RETURN,
                                KeyEvent.DOM_VK_ENTER,
                                KeyEvent.DOM_VK_BACK,
                                KeyEvent.DOM_VK_RED,
                                KeyEvent.DOM_VK_YELLOW,
                                KeyEvent.DOM_VK_GREEN,
                                KeyEvent.DOM_VK_BLUE]) >= 0)
                return false; // don't pass thess key to main
            return true;
        }),
        foot.on('keydown', function (evt) {
            var key = evt.which || evt.keyCode;
            var active  = foot.find(".active, :focus");
            var btns = foot.find("button:not(.disabled)");
            var idx = $.inArray(active.get(0), btns);
            var colMax = getColMax(btns.length);
            if (idx < 0)    // not posiable
                return true;

            if (key == KeyEvent.DOM_VK_UP) idx -= colMax;
            else if (key == KeyEvent.DOM_VK_DOWN)  return true;
            else if (key == KeyEvent.DOM_VK_LEFT)  idx--;
            else if (key == KeyEvent.DOM_VK_RIGHT) idx++;
            else
                return true;

            if (idx >= btns.length || idx < 0)
                return true;
            btns.eq(idx).focus();
            return false;
        });
        this._btnObj('scan').on('keydown', function (evt) { // scan
            var key = evt.which || evt.keyCode;
            if ($.inArray(key, [KeyEvent.DOM_VK_RETURN,KeyEvent.DOM_VK_ENTER]) >= 0) {
                // make a copy of the devList
                var oList = $.map(self.options.devList, function (v) { return $.extend({}, v);});
                var cecList = ipsCECObj.updateDeviceList(oList);
                // update the cName/cIcon as newName/newIcon
                for (var i = 0; i < cecList.length; i++) {
                    var v = self.options.devList[i];
                    v["newName"] = cecList[i]["cName"];
                    v["newIcon"] = cecList[i]["cIcon"];;
                }
                self._update();
                return false;
            }
            return true;
        });
        this._btnObj('close').on('keydown', function (evt) { // close
            var key = evt.which || evt.keyCode;
            if ($.inArray(key, [KeyEvent.DOM_VK_RETURN,KeyEvent.DOM_VK_ENTER]) >= 0) {
                self.close();
                return false;
            }
            return true;
        });
        this._btnObj('done').on('keydown', function (evt) { // done
            var key = evt.which || evt.keyCode;
            if ($.inArray(key, [KeyEvent.DOM_VK_RETURN,KeyEvent.DOM_VK_ENTER]) >= 0) {
                $.each(self.options.devList, function (k, v) {
                    v.name = v["newName"] || v["aName"] || v["name"];
                    v.icon = v["newIcon"] || v["aIcon"] || v["icon"];
                });
                self._trigger( "finish", self.element, self.options );
                self.close();
                self._reset(); // reset the data
                return false;
            }
            return true;
        });
    }
});
