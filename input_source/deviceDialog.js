$.widget( "mtvui.deviceDialog", {
    open: function() {
        var self = this;
        var dlg = this.element;
        self._update();
        dlg.show(); // show it first, then the operation depends on .offset() will work
        self._reset();
        //dlg.find('[tabindex]').first().focus();
		mtvuiUtil.makeMarquee($(".body .cardtext"));
        dlg.find('button').first().focus();
    },
    close: function() {
        this.element.hide();
        this._reset();
        this._trigger( "close", this);
    },
    _create: function() {
        this._initDeviceList();
        this._update();
    },
    _setOption: function( key, value ) {
        this.options[ key ] = value;
        this._update();
    },
    _update: function () {
        dlg = this.element;
        dlg.find(".head .name").text(this.options.oName || this.options.name);
        dlg.find(".head .icon img").attr("src", this.options.oIcon || this.options.icon);
        var g_mtvObj = new MtvObj();
		if ((this.options.newName || this.options.name) == "BLU_RAY" || (this.options.newName || this.options.name) == "DVD" 
			|| (this.options.newName || this.options.name) == "HDD_DVDR" || (this.options.newName || this.options.name) == "RECORDER" 
			|| (this.options.newName || this.options.name) == "VCR" || (this.options.newName || this.options.name) == "PC" 
			|| (this.options.newName || this.options.name) == "GAME" || (this.options.newName || this.options.name) == "DIG_STB"){
			dlg.find(".head .input-text").val(g_mtvObj.getLangString(this.options.newName || this.options.name));
		} else { 
			dlg.find(".head .input-text").val(this.options.newName || this.options.name);
		}
        // set the "Done" button status
        if ((this.options.newName && this.options.newName != this.options.name)
            || (this.options.newIcon && this.options.newIcon != this.options.icon)) {
            this._btnObj('done').removeClass('disabled');
            this._btnObj('reset').removeClass('disabled');
        }
        else {
            this._btnObj('done').addClass('disabled');
            // set the "Reset" button status
            if ((this.options.name && this.options.name != this.options.oName)
                || (this.options.icon && this.options.icon != this.options.oIcon))
                this._btnObj('reset').removeClass('disabled');
            else
                this._btnObj('reset').addClass('disabled');
        }
    },
    _reset: function () {
        var self = this;
        var dlg = this.element;
        dlg.find('li.marked').removeClass("marked");
        dlg.find(".marked").hide();
        // try to initial highlight item
        var active = $.grep(this.element.find("ul li"), function (v) {
            return $(v).find("img").attr("src") == self.options.icon;
        });
        if (active.length > 0) {
            $(active[0]).addClass("marked");
            dlg.find(".marked").show()
                .offset($(active[0]).offset());
        }
        this.options.newName = null;
        this.options.newIcon = null;
    },
    _btnObj: function (arg) {
        var btnNames = {"close":0, "reset":1, "done":2};
        return this.element.find(".foot button").eq(btnNames[arg]);
    },
    _initDeviceList: function() {
        if (typeof this.options.getDeviceList) {
            var self = this;
            var dlg = this.element;
            var head = dlg.find(".head");
            var body = dlg.find(".body");
            var foot = dlg.find(".foot");
            var devDom = body.find("ul");
            var getColMax = function(len) {
                const COLMAX = 4;// cards per row
                return Math.min(len, COLMAX);
            };
            devDom.html("");
			var g_mtvObj = new MtvObj();
            $.each(this.options.getDeviceList(), function (k, v) {
                item = $('<li tabindex=0><img src="'
                         + v.icon + '"><div class="cardtext"><span>'
                         + g_mtvObj.getLangString(v.name) + '</span></div></li>');
                item.appendTo(devDom);
            });
            devDom.children("li").on('keydown', function (evt) {
                key = evt.which || evt.keyCode;
                if ($.inArray(key, [KeyEvent.DOM_VK_RETURN, KeyEvent.DOM_VK_ENTER]) >= 0) {
                    var btnDone = self._btnObj('done');
                    /* if ($(evt.target).hasClass("marked")) {
                        // press "RC_OK" on marked item, apply the change.
						$(evt.target).find("cardtext").removeClass("active");
                        btnDone.trigger(evt);
                        return false;
                    } */
                    dlg.find('li.marked').removeClass("marked");
                    dlg.find(".marked").show()
                        .offset($(evt.target).offset());
                    $(evt.target).addClass("marked");
                    //self.options.newName = $(evt.target).find("p").text().trim();
					if ($(evt.target).offset().top == 244 && $(evt.target).offset().left == 312)
						self.options.newName = "DVD";
					else if ($(evt.target).offset().top == 244 && $(evt.target).offset().left == 462)
						self.options.newName = "BLU_RAY";
					else if ($(evt.target).offset().top == 244 && $(evt.target).offset().left == 612)
						self.options.newName = "HDD_DVDR";
					else if ($(evt.target).offset().top == 244 && $(evt.target).offset().left == 762)
						self.options.newName = "RECORDER";
					else if ($(evt.target).offset().top == 344 && $(evt.target).offset().left == 312)
						self.options.newName = "VCR";
					else if ($(evt.target).offset().top == 344 && $(evt.target).offset().left == 462)
						self.options.newName = "GAME";
					else if ($(evt.target).offset().top == 344 && $(evt.target).offset().left == 612)
						self.options.newName = "PC";
					else if ($(evt.target).offset().top == 344 && $(evt.target).offset().left == 762)
						self.options.newName = "DIG_STB";
                    self.options.newIcon = $(evt.target).find("img").attr("src");
                    self._update();
                    return false;
                }
                return true;
            });
            dlg.on('keydown', function (evt) {
                key = evt.which || evt.keyCode;
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
            head.on('keydown', function (evt) {
                var key = evt.which || evt.keyCode;
                if (key == KeyEvent.DOM_VK_DOWN || key == KeyEvent.DOM_VK_RIGHT) {
					$(document).ready(function(){
						$(".input-text").change(function(){
							txtItem = head.find(".input-text");
							self.options.newName = txtItem.val().trim();
							self._update();
						});
					});
                    body.find("[tabindex]").first().addClass("active");
					body.find("[tabindex]").first().focus();
                    return false;
                }
                return true;
            });
            body.on('keydown', function (evt) {
                var key = evt.which || evt.keyCode;
                var active  = body.find("li.active");
                var cards = body.find("[tabindex]");
                var idx = $.inArray(active.get(0), cards);
                var colMax = getColMax(cards.length);
                if (idx < 0)    // not posiable
                    return true;
				cards.eq(idx).removeClass("active");
                if (key == KeyEvent.DOM_VK_UP)         idx -= colMax;
                else if (key == KeyEvent.DOM_VK_DOWN)  idx += colMax;
                else if (key == KeyEvent.DOM_VK_LEFT)  idx--;
                else if (key == KeyEvent.DOM_VK_RIGHT) idx++;
                else
                    return true;

                if (idx >= cards.length) {
                    var col = idx % colMax;
                    var btns = foot.find('button:not(.disabled)');
                    idx = Math.min(col, btns.length - 1);
                    btns.eq(idx).focus();
                }
                else if (idx < 0)
                    head.find("[tabindex]").first().focus();
                else{					
                    cards.eq(idx).addClass("active");
					cards.eq(idx).focus()
				}
                return false;
            });
            foot.on('keydown', function (evt) {
                var key = evt.which || evt.keyCode;
                var active  = foot.find(".active, :focus");
                var btns = foot.find("button:not(.disabled)");
                var idx = $.inArray(active.get(0), btns);
                var colMax = getColMax(btns.length);
                if (idx < 0)    // not posiable
                    return true;

                if (key == KeyEvent.DOM_VK_UP) {
                    var cards = body.find('[tabindex]');
                    colMax = getColMax(cards.length); // colMax for cards now
                    var rowCnt = Math.ceil(cards.length / colMax);
                    var col = cards.length - (rowCnt - 1) * colMax; // col in last row
                    idx = Math.min(idx, col - 1);
                    cards.eq(idx + (rowCnt - 1) * colMax).addClass("active");
					cards.eq(idx + (rowCnt - 1) * colMax).focus();
                    return false;
                }
                else if (key == KeyEvent.DOM_VK_DOWN)  return true;
                else if (key == KeyEvent.DOM_VK_LEFT)  {
                    idx--;
                    if (idx < 0) {
                        body.find('[tabindex]').last().addClass("active");
						body.find('[tabindex]').last().focus();
                        return false;
                    }
                }
                else if (key == KeyEvent.DOM_VK_RIGHT) idx++;
                else
                    return true;

                if (idx >= 0 && idx < btns.length)
                    btns.eq(idx).focus();
                return false;
            });
            this._btnObj('reset').on('keydown', function (evt) { // reset
                var key = evt.which || evt.keyCode;
                if ($.inArray(key, [KeyEvent.DOM_VK_RETURN,KeyEvent.DOM_VK_ENTER]) >= 0) {
                    var opts = self.options; // store the options
                    self.options.newName = self.options.name = self.options.oName;
                    self.options.newIcon = self.options.icon = self.options.oIcon;
                    self._reset();
                    self._update();
                    self._btnObj('reset').addClass('disabled');
                    self._btnObj('done').removeClass('disabled');
                    self._btnObj('done').focus();
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
                    self.options.name = self.options.newName || self.options.name;
                    self.options.icon = self.options.newIcon || self.options.icon;
                    self._trigger( "finish", self.element, self.options );
                    self.close();
                    self._reset(); // reset the data
                    return false;
                }
                return true;
            });
        }
    }
});
