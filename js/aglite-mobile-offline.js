aglite.Mobile.OffLine = {
	clearFoot: function(){
		$('#ag-footer').html('');
	},
	doLogin: function() {
		var loginCallback = $('#loginBtn').data('loginCallBack');
		$('#loginBtn').addClass('ui-disabled')
		var userName = document.getElementById('userNameTxt').value;
		var password = document.getElementById('passwordTxt').value;
		var obj = {
			success: false
		};
		
		if (!(userName) || !(password)) {
			aglite.Mobile.Messages.error('error','Please enter both username and password!');
			//$('#loginBtn').button('enable');
			$('#loginBtn').removeClass('ui-disabled')
			return;
		}
		$.support.cors = true;
		aglite.Mobile.showLoadMask();
		jQuery.ajax({
			url: contextPath + '/j_spring_security_check',
			type: 'POST',
			//async: true,
			data: {
				j_username: userName,
				j_password: password,
				browserTZ:new Date().getTimezoneOffset(),
				browserTZDST:new Date().isDST(),
				browserTZName:DateUtil.getTimezoneName(),
				force:$('#force').val()
			},
			//dataType: 'json',
			success: function (data, textStatus, jqXHR) {
				var response = jQuery.decode(jqXHR.responseText);
				var obj = jQuery.extend({}, response);
				aglite.Mobile.goBack();
				if (loginCallback) {
					aglite.Mobile.showLoadMask();
					loginCallback.fire();
					return;
				}
				/*if (obj.success) {
					goBack();
					
				} else {
					goBack();
					if (obj.warnings && obj.warnings[0] === 'ALREADY-LOGGED-IN') {
						var message = 'User \'' + document.getElementById('userNameTxt').value + '\' is already logged in.<br/>Click \'OK\' to terminate the existing session and login.';
						$('#confirmDialog').html(message);
						jQuery.mobile.changePage("#dialog");
					} else {
						aglite.Mobile.Messages.error('error',obj.errors? obj.errors : obj);
					}
					//$('#loginBtn').button('enable');
					$('#loginBtn').removeClass('ui-disabled')
				}*/
			},
			error: function (response, textStatus, errorThrown) {
				response = jQuery.decode(response.responseText);
				var obj = jQuery.extend({}, response);
				if (obj.redirectURL) {
						//Util.redirectURL(obj.redirectURL);
				} else {
					//aglite.Mobile.Messages.error('error',obj);
					aglite.Mobile.Messages.error('error',obj.errors? obj.errors : obj);
				}
				 //$('#loginBtn').button('enable');
				 $('#loginBtn').removeClass('ui-disabled')
			}
		});
	},
	createAndShowLoginPage: function(loginCallBack) {
		if ($('#login').length == 0) {
			var html = '<div data-role="page" id="login" data-theme="b" data-add-back-btn="true"><div data-role="header" data-position="fixed" data-theme="b"><h3>Login To AgClinical online application</h3></div><div data-role="content" class="content"><center><table style="width:90%;"><tbody align="center"><tr><td><div style="width:85%;" align="center"><div data-role="fieldcontain" class="ui-hide-label" style="border-bottom-width: 0;"><label for="userNameTxt" class="ui-hidden-accessible">User Name:</label><input type="text" name="name" id="userNameTxt" value=""  placeholder="User Name"/></div><div data-role="fieldcontain" class="ui-hide-label" style="border-bottom-width: 0;"><label for="passwordTxt" class="ui-hidden-accessible">Password: </label><input type="password" name="passwordTxt" id="passwordTxt" value=""  placeholder="Password"/><input id="force" type="hidden" value="false" /></div><a data-role="button" data-theme="b" data-inline="true" class="ag-btn" id="loginBtn">&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;</a><br/></div></td></tr></tbody></table></center></div><div data-role="footer" data-position="fixed"></div></div>';
			$('body').append(html);
			$('#userNameTxt, #passwordTxt').textinput();	
			$.mobile.initializePage();
			$('#loginBtn').click(aglite.Mobile.OffLine.doLogin);
		}
		$.mobile.changePage("#login", "page", false, true);
		aglite.Mobile.hideLoadMask();
		//$('#login div[data-role="content"]').page().show();
		$('#login div[data-role="content"]').show();
		$('#loginBtn').removeClass('ui-disabled').data('loginCallBack', null);
		if (loginCallBack) {
			$('#loginBtn').data('loginCallBack', loginCallBack);
		}
		aglite.Mobile.OffLine.clearFoot();
	},
	invokeServiceMethod: function(config) {
		$.support.cors = true;
		var argConfig = $.extend(true, {}, config);
		var config = config || {};
		config.offline = true;
		var createLoginCallback = $.Callbacks();
		var loginCallback = $.Callbacks();
		var callbackCallback = $.Callbacks();
		var invokeCallback = function() {
			callbackCallback.fire(argConfig);
		}
		callbackCallback.add(aglite.Mobile.invokeServiceMethod);
		loginCallback.add(invokeCallback);
		createLoginCallback.add(aglite.Mobile.OffLine.createAndShowLoginPage);
		config.loginCallback = loginCallback;
		config.createLoginCallback = createLoginCallback;
		aglite.Mobile.invokeServiceMethod(config);
	},
	invokeDynamicService: function(config) {
		$.support.cors = true;
		var argConfig = $.extend(true, {}, config);
		var config = config || {};
		config.offline = true;
		var createLoginCallback = $.Callbacks();
		var loginCallback = $.Callbacks();
		var callbackCallback = $.Callbacks();
		var invokeCallback = function() {
			callbackCallback.fire(argConfig);
		}
		callbackCallback.add(aglite.Mobile.invokeDynamicService);
		loginCallback.add(invokeCallback);
		createLoginCallback.add(aglite.Mobile.OffLine.createAndShowLoginPage);
		config.loginCallback = loginCallback;
		config.createLoginCallback = createLoginCallback;
		aglite.Mobile.invokeDynamicService(config);
	},
	logout: function() {
		aglite.Mobile.invokeServiceMethod({
			version: platformVersion,
		    methodName:'logoutService.logout',
		    callback: function(){
				aglite.Mobile.Messages.alert('Message', 'Logged out successfully!');
			}
		});
	}
};
AgliteMobileOffLine = aglite.Mobile.OffLine;
aglite.Mobile.Storage = function(){
	var DATA_BASE_NAME = "AGLITE-DB";
	var CREATE_TABLE = "CREATE TABLE IF NOT EXISTS AGL_STORAGE (KEY unique, DATA)";
	var SELECT_ALL_QUERY = "SELECT * FROM AGL_STORAGE";
	var SELECT_QUERY = "SELECT * FROM AGL_STORAGE WHERE KEY=?";
	var SELECT_LIKE_QUERY = "SELECT * FROM AGL_STORAGE WHERE KEY LIKE ?";
	var INSERT_QUERY = "INSERT INTO AGL_STORAGE (KEY, DATA) VALUES (?, ?)";
	var DELETE_QUERY = "DELETE FROM AGL_STORAGE WHERE KEY=?";
	var DELETE_ALL_QUERY = "DELETE FROM AGL_STORAGE";
	var DELETE_LIKE_QUERY = "DELETE FROM AGL_STORAGE WHERE KEY LIKE ?";
	var type = 0;
	var entityKeySeparator = "-";
	var dbConnection = null;
	function installDB(tx) {
        tx.executeSql(CREATE_TABLE);
    }
	function errorCB(err) {
        console.log("Error processing SQL: "+err.code);
    }
	function _esureTableExists() {
		var db = getConnection();
        db.transaction(installDB, errorCB);
	};
	function getConnection() {
		if (!dbConnection) {
			dbConnection = window.openDatabase(DATA_BASE_NAME, "1.0", DATA_BASE_NAME, 200000);
		}
		return dbConnection;
	}
	function executeQuery(db, query, params, successCallback, errorCallBack) {
		db.transaction(function(tx){
			tx.executeSql(query, (params || []), function(tx, results) {
				var len = results.rows.length;
				var data = [];
				for (var i=0; i<len; i++){
					data.push({key: results.rows.item(i).KEY, data: (results.rows.item(i).DATA? $.decode(results.rows.item(i).DATA) : {})});
				}
				if (typeof successCallback == 'function') {
					successCallback.call(this, data);
				}
			}, errorCallBack);
		}, errorCallBack);
	}
	function _listAllFromDB(successCallback, errorCallBack) {
		executeQuery(getConnection(), SELECT_ALL_QUERY, [], successCallback, errorCallBack);
	}
	function _listAllLikeFromDB(likeCondition, successCallback, errorCallBack) {
		executeQuery(getConnection(), SELECT_LIKE_QUERY, [likeCondition], successCallback, errorCallBack);
	}
	function _listByIdFromDB(id, successCallback, errorCallBack) {
		executeQuery(getConnection(), SELECT_QUERY, [id], successCallback, errorCallBack);
	}
	function _addItemToDB(key, value) {
		executeQuery(getConnection(), INSERT_QUERY, [key, value]);
	}
	function _deleteItemFromDB(key) {
		executeQuery(getConnection(), DELETE_QUERY, [key]);
	}
	function _deleteAllItemsFromDB() {
		executeQuery(getConnection(), DELETE_ALL_QUERY, []);
	}
	function _deleteItemsLikeFromDB(likeCondition) {
		executeQuery(getConnection(), DELETE_LIKE_QUERY, [likeCondition]);
	}
	
	function _setItem(key, value) {
		if (type == aglite.Mobile.Storage.LOCAL_STORAGE) {
			window.localStorage.setItem(key, value);
		} else {
			_addItemToDB(key, value);
		}
	}
	function _getItem(key) {
		return window.localStorage.getItem(key);
	}
	function _removeItem(key) {
		if (type == aglite.Mobile.Storage.LOCAL_STORAGE) {
			window.localStorage.removeItem(key);
		} else {
			_deleteItemFromDB(key);
		}
	}
	function _clearItems() {
		window.localStorage.clear();
	}
	function _init(_type) {
		type = _type;
		if (type == aglite.Mobile.Storage.STORAGE) {
			_esureTableExists();
		}
	}
	function getAllItemsStartsWith(entityName) {
		var data = [];
		var prefix = getKey(entityName, "");
		for(var key in window.localStorage) {
		  if (typeof key != 'function' && key.indexOf(prefix) == 0) {
			 data.push($.decode(window.localStorage[key]));
		  }
		}
		return data;
	}
	function removeAllItemsStartsWith(entityName) {
		var keys = [];
		var prefix = getKey(entityName, "");
		if (type == aglite.Mobile.Storage.LOCAL_STORAGE) {
			for(var key in window.localStorage) {
			  if (typeof key != 'function' && key.indexOf(prefix) == 0) {
				 keys.push(key);
			  }
			}
			for(var i=0; i<keys.length; i++) {
				_removeItem(keys[i]);
			}
		} else {
			_deleteItemsLikeFromDB(prefix + '%');
		}
	}
	function getKey(entityName, uniqueValue) {
		return entityName + entityKeySeparator + uniqueValue;
	}
	function findAllBySearch(entityName, searchConfig) {
		searchConfig = searchConfig || {};
		var results = aglite.Mobile.Storage.findAll(entityName);
		if (!searchConfig.filterFn || typeof searchConfig.filterFn != 'function') {
			searchConfig.filterFn = filterFunction;
		}
		return searchConfig.filterFn.apply(this, [results, searchConfig]);
	}
	
	function filterFunction(records, searchConfig) {
		var filterParams = searchConfig.filterParams;
		var filterComposition = searchConfig.filterComposition || aglite.Mobile.Storage.CONDITION_OR;
		var filterRecords = [];
		filterParams = filterParams || {};
		for(var i=0, l=records.length; i<l; i++) {
			var trueCount = 0, j=0, record = records[i];
			for(var key in filterParams) {
				if (typeof key === 'function' || $.isEmpty(filterParams[key])) {
					continue;
				}
				j++;
				if (!$.isEmpty(record[key]) && String(record[key]).toLowerCase().indexOf(String(filterParams[key]).toLowerCase()) != -1) {
					trueCount++;
				}
				if (filterComposition == aglite.Mobile.Storage.CONDITION_OR && trueCount > 0) {
					break;
				}
			}
			if ((filterComposition == aglite.Mobile.Storage.CONDITION_OR && trueCount > 0)
				|| (filterComposition == aglite.Mobile.Storage.CONDITION_AND && trueCount == j)) {
				filterRecords.push(record);
			} 
		}
		return filterRecords;
	}
	
	return {
		init: function(_type) {
			_init(_type);
		},
		setItem: function(key, value) {
			_setItem(key, value);
		},
		getItem: function(key) {
			return _getItem(key);
		},
		removeItem: function(key) {
			_removeItem(key);
		},
		saveOrUpdate: function(entityName, uniqueIdValue, data) {
			_setItem(getKey(entityName, uniqueIdValue), $.encode(data));
		},
		findByID: function(entityName, uniqueIdValue, successCallback, errorCallBack) {
			if (type == aglite.Mobile.Storage.LOCAL_STORAGE) {
				var d = _getItem(getKey(entityName, uniqueIdValue));
				if (d) {
					return $.decode(d);
				}
				return null;
			} else {
				_listByIdFromDB(getKey(entityName, uniqueIdValue), successCallback, errorCallBack);
			}
		},
		findAll: function(entityName, successCallback, errorCallBack) {
			if (type == aglite.Mobile.Storage.LOCAL_STORAGE) {
				return getAllItemsStartsWith(entityName);
			} else {
				_listAllLikeFromDB(getKey(entityName, "%"), successCallback, errorCallBack);
			}
		},
		findAllWithFilter: function(entityName, searchConfig) {
			return findAllBySearch(entityName, searchConfig);
		},
		deleteEntity: function(entityName, uniqueIdValue) {
			_removeItem(getKey(entityName, uniqueIdValue));
		},
		deleteAll: function(entityName) {
			removeAllItemsStartsWith(entityName);
		}
	};
}();
aglite.Mobile.Storage.CONDITION_OR = 0;
aglite.Mobile.Storage.CONDITION_AND = 1;
aglite.Mobile.Storage.LOCAL_STORAGE = 0;
aglite.Mobile.Storage.STORAGE = 1;
aglite.Mobile.Storage.init(aglite.Mobile.Storage.LOCAL_STORAGE);
AgMobileStorage = aglite.Mobile.Storage;
