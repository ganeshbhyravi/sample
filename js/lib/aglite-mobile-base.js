if (typeof aglite == 'undefined') {
	var aglite = {};
}
aglite.JSON = new(function () {
    var useHasOwn = !! {}.hasOwnProperty;

    // crashes Safari in some instances
    //var validRE = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;
    var pad = function (n) {
        return n < 10 ? "0" + n : n;
    };

    var m = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"': '\\"',
        "\\": '\\\\'
    };

    var encodeString = function (s) {
        if (/["\\\x00-\x1f]/.test(s)) {
            return '"' + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                var c = m[b];
                if (c) {
                    return c;
                }
                c = b.charCodeAt();
                return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + s + '"';
    };

    var encodeArray = function (o) {
        var a = ["["],
            b, i, l = o.length,
            v;
        for (i = 0; i < l; i += 1) {
            v = o[i];
            switch (typeof v) {
            case "undefined":
            case "function":
            case "unknown":
                break;
            default:
                if (b) {
                    a.push(',');
                }
                a.push(v === null ? "null" : aglite.JSON.encode(v));
                b = true;
            }
        }
        a.push("]");
        return a.join("");
    };

    this.encodeDate = function (o) {
        //return '"' + o.getFullYear() + "-" + pad(o.getMonth() + 1) + "-" + pad(o.getDate()) + "T" + pad(o.getHours()) + ":" + pad(o.getMinutes()) + ":" + pad(o.getSeconds()) + '"';
        return 'new Date(' + o.getTime() + ')';
    };

    this.encode = function (o) {
        if (typeof o == "undefined" || o === null) {
            return "null";
        } else if ($.isArray(o)) {
            return encodeArray(o);
        } else if ($.isDate(o)) {
            return aglite.JSON.encodeDate(o);
        } else if (typeof o == "string") {
            return encodeString(o);
        } else if (typeof o == "number") {
            return isFinite(o) ? String(o) : "null";
        } else if (typeof o == "boolean") {
            return String(o);
        } else {
            var a = ["{"],
                b, i, v;
            for (i in o) {
                if (!useHasOwn || o.hasOwnProperty(i)) {
                    v = o[i];
                    switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }
                        a.push(this.encode(i), ":", v === null ? "null" : this.encode(v));
                        b = true;
                    }
                }
            }
            a.push("}");
            return a.join("");
        }
    };

    this.decode = function (json) {
       	return eval("(" + json + ")");
    };
})();

(function ($) {
    $.encode = aglite.JSON.encode;
    $.decode = aglite.JSON.decode;
	$.isEmpty = function (v, allowBlank) {
        return v === null || v === undefined || (!allowBlank ? v === "" : false);
    };
    $.isDate = function (v) {
        return Object.prototype.toString.apply(v) === '[object Date]';
    };
    $.isObject = function (v) {
        return !!v && Object.prototype.toString.call(v) === '[object Object]';
    };
    $.format = function () {
        var s = arguments[0];
        for (var i = 0; i < arguments.length - 1; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }
        return s;
    };
	$.extend(Date.prototype, {
		isDST : function() {
			return new Date(this.getFullYear(), 0, 1).getTimezoneOffset() != this.getTimezoneOffset();
		}
	});
})(jQuery);
$.fn.center = function () {
    this.css("position", "absolute");
    this.css("top", ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px");
    this.css("left", ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px");
    return this;
};
DateUtil = function () {
	function _getTimezoneName() {
	    tmSummer = new Date(Date.UTC(2012, 6, 30, 0, 0, 0, 0));
	    so = -1 * tmSummer.getTimezoneOffset();
	    tmWinter = new Date(Date.UTC(2012, 12, 30, 0, 0, 0, 0));
	    wo = -1 * tmWinter.getTimezoneOffset();
	
		if (-720 == so && -720 == wo) return 'Etc/GMT-12';
	    if (-660 == so && -660 == wo) return 'Pacific/Midway';
	    if (-600 == so && -600 == wo) return 'Pacific/Tahiti';
	    if (-570 == so && -570 == wo) return 'Pacific/Marquesas';
	    if (-540 == so && -600 == wo) return 'America/Adak';
	    if (-540 == so && -540 == wo) return 'Pacific/Gambier';
	    if (-480 == so && -540 == wo) return 'US/Alaska';
	    if (-480 == so && -480 == wo) return 'Pacific/Pitcairn';
	    if (-420 == so && -480 == wo) return 'US/Pacific';
	    if (-420 == so && -420 == wo) return 'US/Arizona';
	    if (-360 == so && -420 == wo) return 'US/Mountain';
	    if (-360 == so && -360 == wo) return 'America/Guatemala';
	    if (-360 == so && -300 == wo) return 'Pacific/Easter';
	    if (-300 == so && -360 == wo) return 'US/Central';
	    if (-300 == so && -300 == wo) return 'America/Bogota';
	    if (-240 == so && -300 == wo) return 'US/Eastern';
	    if (-240 == so && -240 == wo) return 'America/Caracas';
	    if (-240 == so && -180 == wo) return 'America/Santiago';
	    if (-180 == so && -240 == wo) return 'Canada/Atlantic';
	    if (-180 == so && -180 == wo) return 'America/Montevideo';
	    if (-180 == so && -120 == wo) return 'America/Sao_Paulo';
	    if (-150 == so && -210 == wo) return 'America/St_Johns';
	    if (-120 == so && -180 == wo) return 'America/Godthab';
	    if (-120 == so && -120 == wo) return 'America/Noronha';
	    if (-60 == so && -60 == wo) return 'Atlantic/Cape_Verde';
	    if (0 == so && -60 == wo) return 'Atlantic/Azores';
	    if (0 == so && 0 == wo) return 'GMT';
	    if (60 == so && 0 == wo) return 'Europe/London';
	    if (60 == so && 60 == wo) return 'Africa/Algiers';
	    if (60 == so && 120 == wo) return 'Africa/Windhoek';
	    if (120 == so && 60 == wo) return 'Europe/Amsterdam';
	    if (120 == so && 120 == wo) return 'Africa/Harare';
	    if (180 == so && 120 == wo) return 'Europe/Athens';
	    if (180 == so && 180 == wo) return 'Africa/Nairobi';
	    if (240 == so && 180 == wo) return 'Europe/Moscow';
	    if (240 == so && 240 == wo) return 'Asia/Dubai';
	    if (270 == so && 210 == wo) return 'Asia/Tehran';
	    if (270 == so && 270 == wo) return 'Asia/Kabul';
	    if (300 == so && 240 == wo) return 'Asia/Baku';
	    if (300 == so && 300 == wo) return 'Asia/Karachi';
	    if (330 == so && 330 == wo) return 'Asia/Calcutta';
	    if (345 == so && 345 == wo) return 'Asia/Katmandu';
	    if (360 == so && 300 == wo) return 'Asia/Yekaterinburg';
	    if (360 == so && 360 == wo) return 'Asia/Colombo';
	    if (390 == so && 390 == wo) return 'Asia/Rangoon';
	    if (420 == so && 360 == wo) return 'Asia/Almaty';
	    if (420 == so && 420 == wo) return 'Asia/Bangkok';
	    if (480 == so && 420 == wo) return 'Asia/Krasnoyarsk';
	    if (480 == so && 480 == wo) return 'Australia/Perth';
	    if (540 == so && 480 == wo) return 'Asia/Irkutsk';
	    if (540 == so && 540 == wo) return 'Asia/Tokyo';
	    if (570 == so && 570 == wo) return 'Australia/Darwin';
	    if (570 == so && 630 == wo) return 'Australia/Adelaide';
	    if (600 == so && 540 == wo) return 'Asia/Yakutsk';
	    if (600 == so && 600 == wo) return 'Australia/Brisbane';
	    if (600 == so && 660 == wo) return 'Australia/Sydney';
	    if (630 == so && 660 == wo) return 'Australia/Lord_Howe';
	    if (660 == so && 600 == wo) return 'Asia/Vladivostok';
	    if (660 == so && 660 == wo) return 'Pacific/Guadalcanal';
	    if (690 == so && 690 == wo) return 'Pacific/Norfolk';
	    if (720 == so && 660 == wo) return 'Asia/Magadan';
	    if (720 == so && 720 == wo) return 'Pacific/Fiji';
	    if (720 == so && 780 == wo) return 'Pacific/Auckland';
	    if (765 == so && 825 == wo) return 'Pacific/Chatham';
	    if (780 == so && 780 == wo) return 'Pacific/Enderbury'
	    if (840 == so && 840 == wo) return 'Pacific/Kiritimati';
	    return 'US/Pacific';
	}
    return {
		getTimezoneName: function() {
			return _getTimezoneName();
		}
    };
}();

aglite.Mobile = {
	contentHeight: null,
	loadPage: function(loc) {
		window.location = loc;
	},
	logout: function() {
		aglite.Mobile.invokeServiceMethod({
			version: platformVersion,
		    methodName:'logoutService.logout',
		    callback: aglite.Mobile.goToLoginPage,
		    exceptionHandler:aglite.Mobile.goToLoginPage, 
		});
	},
	goToLoginPage: function() {
		window.location = contextPath + '/pages/login?' + mobileReqKey + '=t'; 
	},
	createSettings: function() {
		var t = $(this);
		var page = $(":jqmData(role='page'):visible");
		if (!t.data('created')) {
			var listView = '<ul data-role="listview" data-theme="c" class="hidden-listview ag-float-window" id="settings" data-type="window">'
				+ '<li><a href="?' + mobileReqKey + '=t&menuName=' + menuName + '&pageName=alertList&pageVersion=' + platformVersion + '" data-transition="slide">Alerts</a></li>'
				+ '<li><a href="?' + mobileReqKey + '=t&menuName=' + menuName + '&pageName=taskList&pageVersion=' + platformVersion + '" data-transition="slide">Tasks</a></li>'
				+ '<li><a href="?' + mobileReqKey + '=t&menuName=' + menuName + '&pageName=userDetails&pageVersion=' + platformVersion + '" data-transition="slide">User Details</a></li>'
				+ '<li><a href="?' + mobileReqKey + '=t&menuName=' + menuName + '&pageName=about&pageVersion=' + platformVersion + '" data-transition="slide">About</a></li>' 
				+ '<li><a id="logout">Logout</a></li>' 
				+ '</ul>';
			listView = $(listView);
			var content = page.find('div[data-role="content"]');
			content.append(listView);
			listView.listview();
			listView.listview('refresh');
			t.data('created', 'true');
			listView.find('#logout').bind('vclick', aglite.Mobile.logout);
			listView.find('a').live('vclick', function() {
				if (listView.is(':visible')) {
					listView.toggle('slow');
				}
			});
		}
		var listView = page.find('#settings');	
		var o = t.offset();
		listView.css({top:(o.top + t.outerHeight() + 15), left: (o.left - listView.outerWidth() + t.outerWidth() + 15)});
		aglite.Mobile.showOrHideWindow(listView);
	},
	hideWindows: function() {
		$('body').live('vmousedown', function(e){
			var page = $(":jqmData(role='page'):visible");
			//Need to find is it clicked on window
			var isOutsideClick = false;
			var openWindows = page.find('[data-type="window"]:visible');
			openWindows.each(function(){
				if (e.target != this) {
					isOutsideClick = true;
				};
			});
			page.find('[data-type="window"]').data('outsideclick', false);
			if (isOutsideClick) {
				openWindows.data('outsideclick', true);
				openWindows.hide('slow');
			}
		});
	},
	showOrHideWindow: function(w) {
		if (w.data('outsideclick')) {
			w.data('outsideclick', false);
		} else {
			w.toggle('slow');
		}
	},
	addLink: function() {
		var t = $(this);
		var menuName = t.data('menuname');
		var menuAction = t.data('menuaction');
		t.attr('href', '?' + mobileReqKey + '=t&menuName='+ menuName +'&pageName='+ (menuAction? menuAction : ''));
	},
	createLink: function(page) {
		var prevMenuBtn = page.find('#prevMenuBt');
		//var homeBtn = page.find('#homeBt');
		var settingsBt = page.find('#settingsBt');
		settingsBt.bind('vclick', aglite.Mobile.createSettings);
		if (prevMenus.length == 0) {
			prevMenuBtn.addClass('ui-disabled');
			//homeBtn.addClass('ui-disabled');
		} else {
			prevMenuBtn.removeClass('ui-disabled');
			//homeBtn.removeClass('ui-disabled');
		}
		prevMenuBtn.bind('vclick', aglite.Mobile.showPrevMenu);
		var content = page.find('[data-role="content"]');
		var hidDiv = $('<div style="display:none;position:absolute;z-index:1001;" data-theme="c" data-type="window"/>');
		var listItem = '<ul data-role="listview" id="prevMenu" data-theme="c" class="ag-float-window"> ';
		for(var i=0; i<prevMenus.length; i++) {
			listItem += '<li><a data-menuName="' + prevMenus[i].menuName + '" data-menuAction="' + prevMenus[i].menuAction + '" data-transition="slide">' + prevMenus[i].label + '</a></li>';
		}
		listItem += '</ul>';
		var listView = $(listItem);
		hidDiv.append(listView);
		content.append(hidDiv);
		listView.listview();
		listView.listview('refresh');
		//var tempMenuKey = menuKey;
		//menuKey = (currentMenu == 'home'? "" : currentMenu);
		listView.find('a').each(aglite.Mobile.addLink);
		//menuKey = tempMenuKey;
	},
	showPrevMenu: function() {
		var t = $(this);
		var prevMenu = $(":jqmData(role='page'):visible").find('#prevMenu').parent();
		var t = $(this);
		//var w = $('#settings').width();
		var o = t.offset();
		prevMenu.css({top:(o.top + t.outerHeight() + 15), left: (o.left + 15)});
		aglite.Mobile.showOrHideWindow(prevMenu);
	},
	deNormalize: function(params) {
		var flatObj = {};
	    if (!$.isArray(params)) return params;
	    for(var i=0; i<params.length; i++) {
	    	flatObj[String(i)] = $.isObject(params[i])? $.encode(params[i]) : params[i];
	    }
	    return flatObj;
	},
	invokeDynamicService: function (config) {
		var params = {};
		if (!config.params) {
			config.params = [params];
		}
		params = config.params = aglite.Mobile.deNormalize(config.params);
		params['$SERVICENAME'] = config.serviceName;
		delete config.serviceName;
		params['$VERSION'] = config.version || pageOwnerVersion || platformVersion;
		config.version = platformVersion;
		config.methodName = 'platformUiService.invokeDynamicService';
		aglite.Mobile.invokeServiceMethod(config);
	},
	setDefualtParams: function(config) {
		if (!config.version) {
			config.version = pageOwnerVersion || platformVersion;
		}
		if (!config.params) {
			config.params = [];
		}
		if (!$.isArray(config.params)) {
			config.params = [config.params];
		}
		config.jsonString = $.encode(config.params);
		delete config.params;	
	},
	invokeServiceMethod: function(config) {
		var argConfig = {createLoginCallback: config.createLoginCallback, loginCallback: config.loginCallback, offline: config.offline};
		aglite.Mobile.setDefualtParams(config);
		delete config.offline;
		delete config.createLoginCallback;
		delete config.loginCallback;
		var callback = config.callback;
		delete config.callback;
		var exceptionHandler = config.exceptionHandler;
		delete config.exceptionHandler;
		jQuery.ajax({
			url: contextPath + '/pages/main/agl-service',
			type: 'POST',
			data: config,
			dataType: 'json',
			success: function (data, status, response) {
			   if (callback) {
			   	callback.apply(this, [data, status, response]);
			   }
		   },
		   error: function (doc, status, response) {
			   if (doc && doc.status == 400 && doc.responseText == 'INVALID-REQUEST') {
					if (argConfig.offline && argConfig.createLoginCallback) {
						argConfig.createLoginCallback.fire(argConfig.loginCallback);
						return;
					}
					aglite.Mobile.goToLoginPage();
					return;
			   }
			   if (exceptionHandler) {
			   	exceptionHandler.apply(this, [doc, status, response]);
			   } else {
			   	aglite.Mobile.Messages.error('Error', doc && doc.responseText? doc.responseText : response);
			   }
		   }
		});
	},
	handleError: function(event, error) {
		/*event.preventDefault();
		data.deferred.reject( data.absUrl, data.options );*/
		aglite.Mobile.Messages.error('Error', error, '', aglite.Mobile.goBack);
	},
	goBack: function() {
		 history.back();
	},
	formatDate: function(date) {
		var userDateTimeFormat = userDateFormat + userDateTimeSeparator + userTimeFormat;
		return date.format(userDateTimeFormat);
	},
	numberFormat: function(v, format) {
		if (!format) format = userNumberFormat;
		return $.numberFormat(v, format);
	},
	setTitle: function(el, title) {
		title = title || "";
		//document.title = title;
		el = el || $(document);
		el.find('#agl-mobile-header-title').html(title);
	},
	/*renderChart: function(json, contId) {
		if (typeof AnyChart == 'undefined') return;
		AnyChart.renderingType = anychart.RenderingType.SVG_ONLY;
		var chart = new AnyChart();
		chart.setJSData(json);
		chart.width = $('#' + contId).width() || 300;
		chart.height = $('#' + contId).height() || aglite.Mobile.getContentHeight();
		chart.write(contId);
		return chart; 
	},*/
	renderChart: function(dataSeries, options, contId) {
		return Flotr.draw(document.getElementById(contId), dataSeries, options);
	},
	setContentHeight: function(page) {
		contentHeight = ($(window).height() - page.find('[data-role="header"]').height() - page.find('[data-role="footer"]').height());
	},
	getContentHeight: function() {
		return contentHeight;
	},
	showLoadMask: function(theme, msgText, textonly) {
		$.mobile.showPageLoadingMsg(theme || "b", msgText || "Loading..", textonly);
	},
	hideLoadMask: function() {
		$.mobile.hidePageLoadingMsg();
	}
};
aglite.Mobile.Messages = function () {
		var defaultTitle = 'Alert';
		var defaultCss= 'alert';
		var defaultMessage = 'Message';
		var btn = 'Ok';
		var markupTemplate = '<div class="popup_container" style="display: block; opacity: 0.96;">' +
		    '<h1 class="popup_title">{0}</h1>' +
		    '<div class="{1}">' +
		        '<div class="popupMessage">{2}</div>' +
		        '<center>' +
		            '<a class="ag-btn ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c ui-btn-active"' +
		            'data-theme="c" data-role="button" data-inline="true"><span style="padding: 0pt 5px ! important;" class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">{3}</span></span></a>' +
		        '</center>' +
		    '</div>' +
			'</div>';
		function getMarkupTemplate(title, messageType, message, btnText) {
			return $.format(markupTemplate, title || defaultTitle, messageType, message||defaultMessage, btnText||btn);
		}
		
		function _alert(title, message, btnText, callback) {
			_adjust($(getMarkupTemplate(title, 'alert',  message, btnText)), callback);
		}
		function _warn(title, message, btnText, callback) {
			_adjust($(getMarkupTemplate(title, 'warn',  message, btnText)), callback);
		}
		function _error(title, message, btnText, callback) {
			_adjust($(getMarkupTemplate(title, 'error',  message, btnText)), callback);
		}
		function _adjust(el, callback)  {
			el.appendTo( $("body") ).find('a').click(function(){
				$(this).parents('div.popup_container').remove();
				if (callback) {
					callback.apply(this, []);
				}
			});
			//makeItCenter(el);
			el.center();
		}
		function makeItCenter(el) {
			var top = (($(window).height() / 2) - (el.outerHeight() / 2));
			var left = (($(window).width() / 2)- (el.outerWidth() / 2));
			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;
			el.css({
				top: top + 'px',
				left: left + 'px'
			});
		}
		
		return {
			alert: function(title, message, btnText, callback) {
				_alert(title, message, btnText, callback);
			},
			warn: function(title, message, btnText, callback) {
				_warn(title, message, btnText, callback);
			},
			error: function(title, message, btnText, callback) {
				_error(title, message, btnText, callback);
			}
		}
	}();
	aglite.Mobile.PagingToolbar = function(total, start, pageSize, callback) {
		 this.total = total;
		 this.start = start;
		 this.pageSize = pageSize;
		 this.callback = callback;
		 this.init();
	};
	
	aglite.Mobile.PagingToolbar.prototype = {
		 markupHtml: '<div data-role="controlgroup" data-type="horizontal"> <a data-iconpos="notext" title="First" data-role="button" data-icon="{0}" data-theme="{6}" data-inline="true" pos="first"></a> <a data-iconpos="notext" data-role="button" data-icon="{1}" data-theme="{6}" data-inline="true" pos="prev" title="Prev"></a> <a data-iconpos="notext" data-role="button" data-icon="{2}" data-theme="{6}" data-inline="true" pos="next" title="Next"></a> <a data-iconpos="notext" data-role="button" data-icon="{3}" data-theme="{6}" data-inline="true" pos="last" title="Last"></a> <div style="display:inline-block;padding-left: 5px;padding-top: 8px;font-size:11px;">Page {4} of {5}</div></div>',
		 init: function() {
			this.noOfPages = this.total < this.pageSize ? 1 : Math.ceil(this.total/this.pageSize);
			this.activePage = Math.ceil((this.start+this.pageSize)/this.pageSize);
			this.container = $(":jqmData(role='footer'):visible");
			
			this.el = $($.format(this.markupHtml, (this.activePage == 1? "first-d" : "first"),  (this.activePage == 1? "prev-d" : "prev"),
				(this.activePage == this.noOfPages? "next-d" : "next"), (this.activePage == this.noOfPages? "last-d" : "last"), this.activePage
				, this.noOfPages, "a"));
			this.container.append(this.el).trigger('create');
			this.first = this.el.find('[pos="first"]').click($.proxy(this.loadPage, this));
			this.next = this.el.find('[pos="next"]').click($.proxy(this.loadPage, this));
			this.prev = this.el.find('[pos="prev"]').click($.proxy(this.loadPage, this));
			this.last = this.el.find('[pos="last"]').click($.proxy(this.loadPage, this));
			if(this.activePage == 1) {
				this.first.addClass('ui-disabled');
				this.prev.addClass('ui-disabled');
			} else {
				//this.first.click($.proxy(this.loadPage, this));
				//this.prev.click($.proxy(this.loadPage, this));
			}
			if (this.activePage == this.noOfPages) {
				this.next.addClass('ui-disabled');
				this.last.addClass('ui-disabled');
			} else {
				//this.next.click($.proxy(this.loadPage, this));
				//this.last.click($.proxy(this.loadPage, this));
			}
		 },
		 loadPage: function(e) {
			var t = $(e.target);
			var pos = t.parent().parent().attr('pos');
			var nextPage = {};
			if (pos == 'first') {
				nextPage.start = 0;
			} else if (pos == 'prev') {
				nextPage.start = Math.max(0,(this.start - this.pageSize));
			} else if (pos == 'next') {
				nextPage.start = this.start + this.pageSize;
			} else if (pos == 'last') {
                var extra = this.total % this.pageSize;
                nextPage.start = extra ? (this.total - extra) : (this.total-this.pageSize);
			}
			if (!nextPage.start) nextPage.start = 0;
			nextPage.limit = this.pageSize;
			if (typeof this.callback == 'function') {
				this.callback.apply(this, [nextPage]);
			}
		 }
	};	
	
aglite.Mobile.EventManager = function () {
    var eventObj = $({});
	var resizeEvent = null;
	var timer = null;
    return {
        on: function (eventType, data, fn) {
            eventObj.bind(eventType, data, fn);
        },
        fireEvent: function (eventType, extraParameters) {
            eventObj.trigger(eventType, extraParameters);
        },
		un: function(eventType, fn) {
			eventObj.unbind(eventType, fn);
		},
		onWindowResize : function(fn, scope){
			if (!resizeEvent) {
				resizeEvent = new aglite.EventSupport();
				$(window).bind('resize', $.proxy(this.fireWindowResizeWrap, this));
			}
			resizeEvent.addListener('resize', fn, scope);
		},
		fireWindowResizeWrap: function() {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function(me) {if (me) {me.fireWindowResize()}}, 50, this);
		},
		fireWindowResize: function() {
			if (resizeEvent) {
				resizeEvent.fireEvent('resize');
			}
		},
		addListener: function (eventType, data, fn) {
            this.on(eventType, data, fn);
        },
        fire: function (eventType, extraParameters) {
            this.fireEvent(eventType, extraParameters);
        }
    };
}();	