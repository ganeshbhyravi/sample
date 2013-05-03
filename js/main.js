agClinical = {};
agClinical.util = {
	main:null,
	siteSetupList: [],
	version: 'agclinical-3.1.1.0',
	encodeVersion: 'agclinical_3__1__1__0',
	contextPath: 'http://vmesx39tac3:8886/agweb',
	platformVersion: 'aglite-3.1.1.25',
	
	showSiteList: function(nextPage) {
		var start = nextPage && nextPage.start? nextPage.start : 0;
		var limit = nextPage && nextPage.limit? nextPage.limit : 5;
		var html = '<div id="sitesListWrap" data-role="collapsible" data-collapsed="false" data-theme="b" data-content-theme="d">'
		+ '<h3>Sites List</h3><ul data-role="listview" id="sitesList">';
		var sites = AgMobileStorage.findAll("SiteSetup");
		var end = Math.min(sites.length, (start + limit));
		//var sites = sites.splice(start, end);
		var sitesExists = false;
		for(var i=start; i<end; i++) {
			sitesExists = true;
			html += '<li><a data-userId="' + sites[i].recordId + '" data-transition="slide" href="javascript:AgClinicalMobileUtil.editSiteDetails('+sites[i].recordId+')">' + sites[i].siteName + '<span style="font-size:9px;"> (<span style="font-weight:bold;font-size:11px;">Program:</span> ' + sites[i].programName + '<span style="font-weight:bold;font-size:11px;">, Study:</span> ' + sites[i].studyTitle + ' <span style="font-weight:bold;font-size:11px;">, Country:</span> ' + sites[i].countryName + ')</span>' + '</a></li>';
		}
		if (!sitesExists) {
			html += '<li>No Sites are downloaded!</li>';
		}
		html += '</ul></div><center><a data-role="button" data-theme="b" data-inline="true" class="ag-btn" href="javascript:void(0);" id="cancelbtn"  onclick = "AgClinicalMobileUtil.showHomePage()">Cancel</a></center>'
		AgClinicalMobileUtil.getMain().html(html).find('#sitesList').listview().listview('refresh');
		AgClinicalMobileUtil.getMain().find('#sitesListWrap').collapsible();
		AgClinicalMobileUtil.getMain().find('#cancelbtn').button();
		AgClinicalMobileUtil.clearFoot();
		new aglite.Mobile.PagingToolbar(parseInt(sites.length, 10), parseInt(start, 10), parseInt(limit, 10), AgClinicalMobileUtil.showEmpList);
	},
	
	showOnlineSiteList: function(start, limit) {
		var siteList = AgClinicalMobileUtil.siteSetupList.pageData;
		var html =	'<div data-role="collapsible" data-collapsed="false" data-theme="b" data-content-theme="d" id="sitelist"><h3>Sites To Download:</h3><fieldset data-role="controlgroup" id="onlineSiteList">';
		for(var i=0; i<siteList.length; i++) {
			html += '<input data-theme="c" type="checkbox" id="checkbox-' + siteList[i].recordId+ '" recordid="' + siteList[i]. recordId + '"  class="sitenames"/>' +
					'<label for="checkbox-' + siteList[i]. recordId+ '">' + siteList[i].siteName + '<span style="font-size:9px;"> (<span style="font-weight:bold;font-size:11px;">Program:</span> ' + siteList[i].programName + '<span style="font-weight:bold;font-size:11px;">, Study:</span> ' + siteList[i].studyTitle + ' <span style="font-weight:bold;font-size:11px;">, Country:</span> ' + siteList[i].countryName + ')</span></label>'
		}
		if (siteList.length == 0) {
			html += '<li>No Sites are available to download!</li>';
		}
		html += '</fieldset></div><center><a data-role="button" data-theme="b" data-inline="true" class="ag-btn" href="javascript:void(0);" id="downloadbtn"  onclick = "AgClinicalMobileUtil.downloadSelectedSites()">Download</a>&nbsp;&nbsp;&nbsp;<a data-role="button" data-theme="b" data-inline="true" class="ag-btn" href="javascript:void(0);" id="cancelbtn"  onclick = "AgClinicalMobileUtil.gotToAdminPage()">Cancel</a></center>';
		//AgClinicalMobileUtil.getMain().html(html).find('#onlineSiteList').checkboxradio().checkboxradio('refresh');
		AgClinicalMobileUtil.getMain().html(html).find('.sitenames').checkboxradio().checkboxradio('refresh');
		AgClinicalMobileUtil.getMain().find('#sitelist').collapsible();
		AgClinicalMobileUtil.getMain().find('#downloadbtn,#cancelbtn').button();
		AgliteMobileOffLine.clearFoot();
		new aglite.Mobile.PagingToolbar(parseInt(AgClinicalMobileUtil.siteSetupList.noOfRecords, 10), parseInt(start, 10), parseInt(limit, 10), AgClinicalMobileUtil.getSiteListFromServer);
	},
	showSiteListForUpload: function(nextPage) {
		var start = nextPage && nextPage.start? nextPage.start : 0;
		var limit = nextPage && nextPage.limit? nextPage.limit : 5;
		var html = '<div id="sitesListWrap" data-role="collapsible" data-collapsed="false" data-theme="b" data-content-theme="d">'
		+ '<h3>Sites List</h3><ul data-role="listview" id="sitesList">';
		var siteList = AgMobileStorage.findAll("SiteSetup");
		var end = Math.min(siteList.length, (start + limit));
		//var sites = sites.splice(start, end);
		var html =	'<div data-role="collapsible" data-collapsed="false" data-theme="b" data-content-theme="d" id="sitelist"><h3>Sites To Download:</h3><fieldset data-role="controlgroup" id="onlineSiteList">';
		var isExists = false;
		for(var i=start; i<end; i++) {
			isExists = true;
			html += '<input data-theme="c" type="checkbox" id="checkbox-' + siteList[i].recordId+ '" recordid="' + siteList[i]. recordId + '"  class="sitenames"/>' +
					'<label for="checkbox-' + siteList[i]. recordId+ '">' + siteList[i].siteName + '<span style="font-size:9px;"> (<span style="font-weight:bold;font-size:11px;">Program:</span> ' + siteList[i].programName + '<span style="font-weight:bold;font-size:11px;">, Study:</span> ' + siteList[i].studyTitle + ' <span style="font-weight:bold;font-size:11px;">, Country:</span> ' + siteList[i].countryName + ')</span></label>'
		}
		if (!isExists) {
			html+= '<span class="ag-about-label">No Sites are available to upload!</span>';
		}
		html += '</fieldset></div><center><a data-role="button" data-theme="b" data-inline="true" class="ag-btn" href="javascript:void(0);" id="downloadbtn"  onclick = "AgClinicalMobileUtil.uploadSelectedSites()">Upload</a>&nbsp;&nbsp;&nbsp;<a data-role="button" data-theme="b" data-inline="true" class="ag-btn" href="javascript:void(0);" id="cancelbtn"  onclick = "AgClinicalMobileUtil.gotToAdminPage()">Cancel</a></center>';
		//AgClinicalMobileUtil.getMain().html(html).find('#onlineSiteList').checkboxradio().checkboxradio('refresh');
		AgClinicalMobileUtil.getMain().append(html).find('.sitenames').checkboxradio().checkboxradio('refresh');
		AgClinicalMobileUtil.getMain().find('#sitelist').collapsible();
		AgClinicalMobileUtil.getMain().find('#downloadbtn,#cancelbtn').button();
		AgliteMobileOffLine.clearFoot();
		new aglite.Mobile.PagingToolbar(parseInt(siteList.length, 10), parseInt(start, 10), parseInt(limit, 10), AgClinicalMobileUtil.showSiteListForUpload);
	},
	downloadSelectedSites: function() {
		var selectedList = AgClinicalMobileUtil.getMain().find('.sitenames:checked');
		if (selectedList.length == 0) {
			aglite.Mobile.Messages.warn('Alert', 'Please select site(s) to download!');
			return;
		}
		var recordIds = {};
		selectedList.each(function(){
			recordIds[$(this).attr('recordid')] = ($(this).attr('recordid'));
		});
		var siteList = AgClinicalMobileUtil.siteSetupList.pageData;
		var siteListTobeDownloaded = [];
		for(var i=0; i<siteList.length; i++) {
			if (!$.isEmpty(recordIds[siteList[i].recordId])) {
				siteListTobeDownloaded.push(siteList[i]);
			}
		}
		AgClinicalMobileUtil.saveOrUpdateSitesDetails(siteListTobeDownloaded);
		aglite.Mobile.Messages.alert('Message', 'Selected Site(s) are downloaded successfully!');
	},
	uploadSelectedSites: function() {
		var selectedList = AgClinicalMobileUtil.getMain().find('.sitenames:checked');
		if (selectedList.length == 0) {
			aglite.Mobile.Messages.warn('Alert', 'Please select site(s) to upload!');
			return;
		}
		var uploadableSiteDetails = {};
		selectedList.each(function(){
			var siteDetails = AgMobileStorage.findByID("SiteSetup", Number($(this).attr('recordid')));
			uploadableSiteDetails[$(this).attr('recordid')] = {siteDescription: siteDetails.siteDescription, siteTitle:siteDetails.siteTitle};
		});
		AgliteMobileOffLine.invokeDynamicService({
			serviceName:'updatesitedetails',
			version: AgClinicalMobileUtil.version,
			params:[uploadableSiteDetails],
			callback: function(data, status, response) {
				if (data.errors && data.errors.length > 0) {
					aglite.Mobile.Messages.error('Error', data.errors.join(","));
					return;
				}
				if (data.infos && data.infos.length > 0) {
					var uploadedDetails = uploadableSiteDetails;
					aglite.Mobile.hideLoadMask();
					aglite.Mobile.Messages.alert('Info', data.infos.join(","),null, function(){
						for(var key in uploadedDetails) {
							if (typeof key != 'function' && typeof uploadedDetails[key] != 'function') {
								AgMobileStorage.deleteEntity('SiteSetup', Number(key));
							}
						}
						AgClinicalMobileUtil.showHomePage();
					});
					return;
				}
			}
		});
	},
	saveOrUpdateSitesDetails: function(siteList) {
		for(var i=0; i<siteList.length; i++) {
			aglite.Mobile.Storage.saveOrUpdate('SiteSetup', siteList[i].recordId, siteList[i]);
		}
	},
	updateSiteDetails: function(site) {
		aglite.Mobile.Storage.saveOrUpdate('SiteSetup', site.recordId, site);
	},
	getSiteListFromServer: function(nextPage) {
		var start = nextPage && nextPage.start? nextPage.start : 0;
		var limit = nextPage && nextPage.limit? nextPage.limit : 5;
		aglite.Mobile.showLoadMask();
		AgliteMobileOffLine.invokeDynamicService({
			serviceName:'sitelist',
			version: AgClinicalMobileUtil.version,
			params:[{start:start,limit:limit,sortField:'recordId',sortDirection:'ASC', entityClassName:'SiteSetup'}],
			callback: function(data, status, response) {
				if (data.data) {
					//AgClinicalMobileUtil.showEmpList(nextPage);
					aglite.Mobile.showLoadMask();
					AgClinicalMobileUtil.siteSetupList = data.data;
					AgClinicalMobileUtil.showOnlineSiteList(start, limit);
					aglite.Mobile.hideLoadMask();
				}
			}
		});
		aglite.Mobile.showLoadMask();
	},
	editSiteDetails: function(siteRecordId) {
		AgMobileStorage.setItem('selRecordId', siteRecordId);
		window.location = './editsite.html';
	},
	populateSiteDetails: function() {
		var siteRecordId = AgMobileStorage.getItem('selRecordId');
		if (!siteRecordId) return;
		var siteDetails = AgMobileStorage.findByID('SiteSetup', siteRecordId);
		$('#programName').html(siteDetails['programName']);
		$('#studyTitle').html(siteDetails['studyTitle']);
		$('#countryName').html(siteDetails['countryName']);
		$('#siteName').html(siteDetails['siteName']);
		$('#siteStatus').html(siteDetails['siteStatus']);
		$('#siteTitle').val(siteDetails['siteTitle']);
		$('#siteDescription').val(siteDetails['siteDescription']);
	},
	saveSiteDetails: function() {
		var siteRecordId = AgMobileStorage.getItem('selRecordId');
		if (!siteRecordId) return;
		var siteDetails = AgMobileStorage.findByID('SiteSetup', siteRecordId);
		siteDetails['siteTitle'] = $('#siteTitle').val();
		siteDetails['siteDescription'] = $('#siteDescription').val();
		AgMobileStorage.saveOrUpdate('SiteSetup', siteRecordId, siteDetails);
		aglite.Mobile.Messages.alert('Message', 'Site Details are saved successfully!', 'Ok', function(){
			AgClinicalMobileUtil.showSiteListPage();
		});
	},
	showSiteListPage: function() {
		AgMobileStorage.removeItem('selRecordId');
		window.location = './site-list.html';
	},
	getMain: function() {
		if (!AgClinicalMobileUtil.main) {
			AgClinicalMobileUtil.main = $('#main-base');
		}
		return AgClinicalMobileUtil.main;
	},
	clearFoot: function(){
		$('#ag-footer').html('');
	},
	showHomePage: function() {
		window.location = './home.html';
	},
	gotToAdminPage: function() {
		window.location = './admin.html';
	},
	attachOptionWindow: function(page) {
		var settingsBt = page.find('#settingsBt');
		settingsBt.unbind('vclick', AgClinicalMobileUtil.createOptions);
		settingsBt.bind('vclick', AgClinicalMobileUtil.createOptions);
	},
	createOptions: function() {
		var t = $(this);
		var page = $(":jqmData(role='page'):visible");
		if (!t.data('created')) {
			var listView = '<ul data-role="listview" data-theme="c" data-dividertheme= "b" class="hidden-listview ag-float-window" id="settings" data-type="window">'
				+ '<li><a href="./about.html">About</a></li>' 
				+ '<li><a id="logout">Logout</a></li>' 
				+ '</ul>';
			listView = $(listView);
			var content = page.find('div[data-role="content"]');
			content.append(listView);
			listView.listview();
			listView.listview('refresh');
			t.data('created', 'true');
			listView.find('#logout').bind('vclick', AgliteMobileOffLine.logout);
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
	isNotValidPageForEvents: function(e){
		return (e.target.id == 'login' || e.target.id == 'about');
	}
};
AgClinicalMobileUtil = agClinical.util;
