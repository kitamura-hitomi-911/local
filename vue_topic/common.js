/**
 * Created by hinit on 2018/03/23.
 */



!(function(){
	"use strict";

	window.requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame;

	/**
	 * stringかどうか？
	 * @param obj
	 * @returns {boolean}
	 */
	function isString(obj) {
		return (typeof (obj) === "string" || obj instanceof String);
	}
	window.isString = isString;

	/**
	 * 日時フォーマット
	 * @param {Date | string} date フォーマットしたい日時情報
	 * @param format
	 * @returns {*}
	 */
	function formatDate (date, format) {
		if(isString(date)){
			date = new Date(date);
		}
		if(!format) format = window.date_format ? window.date_format : 'YYYY年MM月DD日(WD)';
		var weekdaylist = ["日", "月", "火", "水", "木", "金", "土"];
		format = format.replace(/YYYY/g, date.getFullYear());
		format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
		format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
		format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
		format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
		format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
		format = format.replace(/WD/g, weekdaylist[date.getDay()]);
		if(format.match(/S/g)){
			var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
			var length = format.match(/S/g).length;
			for(var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
		}
		return format;
	};

	var supportsPassive = function(){
		var _supportsPassive = false;
		try {
			var opts = Object.defineProperty({}, 'passive', {
				get: function() {
					_supportsPassive = true;
				}
			});
			window.addEventListener("test", null, opts);
		} catch (e) {}
		return _supportsPassive;
	}();



	/**
	 * addEventListener のoptionパラメータオブジェクト対応・未対応を吸収
	 * @param target
	 * @param type
	 * @param handler
	 * @param options
	 */
	function addEventListenerWithOptions(target, type, handler, options) {
		var optionsOrCapture = options;
		if (!supportsPassive) {
			// 非対応ブラウザでは、他のオプションは全て捨て
			// { capture: bool } の値を useCapture の値として採用する
			optionsOrCapture = options.capture;
		}
		//
		target.addEventListener(type, handler, optionsOrCapture);
	}

	window.hashChangeController = {
		hashChangeEvents:[],
		hashChangeEventsByHash:{},
		init:function(){
			var that= this;
			window.addEventListener('hashchange', function(){that.runHashChangeEvents();}, false);
			return;
		},
		setEvent:function(obj){
			if(!obj || !obj.fn){return;}
			var hash = this._getHash();
			obj.parent = obj.parent||window;
			this.hashChangeEvents.push({fn:obj.fn,parent:obj.parent});
			// セットされたタイミングで処理
			if(obj.first){
				if(!isNaN(obj.first)){
					setTimeout(function(){
						obj.fn.call(obj.parent,hash);
					},obj.first);
				}else{
					obj.fn.call(obj.parent,hash);
				}
			}
			return;
		},
		setEventByHash:function(obj_ary){
			if(!obj_ary || !obj_ary.length){return;}
			var that = this;
			var hash = this._getHash();
			obj_ary.forEach(function(obj){
				if(!obj.fn || !obj.hash){return;}
				obj.parent = obj.parent||window;
				that.hashChangeEventsByHash[obj.hash] = {fn:obj.fn,parent:obj.parent};
				if(hash == obj.hash){
					obj.fn.call(obj.parent,hash);
				}
			});
			return;
		},
		runHashChangeEvents:function(){
			var self = hashChangeController;
			var hash = this._getHash();
			this.hashChangeEvents.each(function(event_obj){
				event_obj.fn.call(event_obj.parent,hash);
			});
			if(this.hashChangeEventsByHash[hash]){
				this.hashChangeEventsByHash[hash].fn.call(this.hashChangeEventsByHash[hash].parent,hash);
			}
			return;
		},
		_getHash:function(){
			var ret_hash = '';
			if(location.search){
				var tmp_search = (location.search.replace('?','')).split('=');
				if(tmp_search[0] == '_escaped_fragment_'){
					ret_hash = '!'+tmp_search[1];
				}
			}
			if(!ret_hash){
				ret_hash = location.hash?(location.hash).replace('#',''):'';
			}
			return ret_hash;
		}
	};
	hashChangeController.init();
	hashChangeController.setEvent({fn:function(hash){console.log(hash);}})

	/**
	 * スムーススクロール
	 * @param {HTML element | string} tgt
	 * @param {string} [easing]
	 * @returns {boolean}
	 */
	window.smoothScroll = function(tgt,easing) {
		var tgt_elm;
		if(!tgt){
			return false;
		}
		if(isString(tgt)){
			if(tgt.match(/^#\S+$/)){
				tgt_elm = document.getElementById(tgt.replace(/^#/,''));
			}else{
				tgt_elm = document.querySelector(tgt);
			}
		}else if(tgt.nodeType && obj.nodeType ===1){
			tgt_elm = tgt;
		}
		if(!tgt_elm){
			return;
		}

		var _scroll_tgt;
		var _start_pos = document.documentElement.scrollTop || document.body.scrollTop;
		var _end_pos = tgt_elm.getBoundingClientRect().top + _start_pos;
		var _distance = _end_pos - _start_pos;
		var _speed = Math.abs(_distance) > 1333 ? 2000 : 1500;
		var _easing = easing || 'easeOutQuad';
		var _ua = window.navigator.userAgent.toLowerCase();

		console.log(tgt_elm,_start_pos,_end_pos);

		if ('scrollingElement' in document) {
			_scroll_tgt = document.scrollingElement;
		}else if (_ua.indexOf('msie') > -1 || _ua.indexOf('trident') > -1 || _ua.indexOf('firefox') > -1) {
			_scroll_tgt = document.getElementsByTagName('html')[0];
		}else{
			_scroll_tgt = document.getElementsByTagName('body')[0];
		}

		var _start_time = getTime();
		( function loop(){
			var _last_time = getTime();
			var _elapsed_time = Math.floor(_last_time - _start_time);
			var _percentage = ( _elapsed_time / parseInt(_speed, 10) );
			_percentage = ( _percentage > 1 ) ? 1 : _percentage;
			var _current_position = _start_pos + ( _distance * easingPattern(_easing, _percentage) );

			if( _percentage == 1  || _elapsed_time > 10000){
				document.scrollingElement.scrollTop = _current_position;
			}else{
				document.scrollingElement.scrollTop = _current_position;
				requestAnimationFrame( loop );
			}
		} )();

		function getTime(){
			var now = window.performance && (
				performance.now ||
				performance.mozNow ||
				performance.msNow ||
				performance.oNow ||
				performance.webkitNow );
			return ( now && now.call( performance ) ) || ( new Date().getTime() );
		}
		function easingPattern ( type, time ) {
			var pattern;
			if ( type === 'easeInQuad' ) pattern = time * time; // accelerating from zero velocity
			if ( type === 'easeOutQuad' ) pattern = time * (2 - time); // decelerating to zero velocity
			if ( type === 'easeInOutQuad' ) pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
			if ( type === 'easeInCubic' ) pattern = time * time * time; // accelerating from zero velocity
			if ( type === 'easeOutCubic' ) pattern = (--time) * time * time + 1; // decelerating to zero velocity
			if ( type === 'easeInOutCubic' ) pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
			if ( type === 'easeInQuart' ) pattern = time * time * time * time; // accelerating from zero velocity
			if ( type === 'easeOutQuart' ) pattern = 1 - (--time) * time * time * time; // decelerating to zero velocity
			if ( type === 'easeInOutQuart' ) pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
			if ( type === 'easeInQuint' ) pattern = time * time * time * time * time; // accelerating from zero velocity
			if ( type === 'easeOutQuint' ) pattern = 1 + (--time) * time * time * time * time; // decelerating to zero velocity
			if ( type === 'easeInOutQuint' ) pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
			return pattern || time; // no easing, no acceleration
		};

		return false;
	};


	/**
	 * メディアクエリ関連の処理
	 * @return {object.<function,function>}
	 *               setEvents ブレイクポイントで切り替わるときに発動するイベントを登録する,
	 *               getCurrentDevice 設定された メディアクエリ から算出されるデバイスの文字列をかえす
	 */
	var responsiveController = (function(breakpoint_settings){
		// MediaQueryList オブジェクト
		var mql = {};
		// ブレイクポイント切り替え時に発動するイベント
		var events = [];
		// ブレイクポイントの設定
		var _breakpoint_settings = breakpoint_settings && Array.isArray(breakpoint_settings) && breakpoint_settings.length && breakpoint_settings[0].device ? breakpoint_settings : [
			{device:'sp',width:0},
			{device:'pad',width:768},
			{device:'pc',width:980}
		];
		// MediaQueryList が リスナーを使えるか
		var matchMediaAddListenerSupported = !!(window.matchMedia && window.matchMedia( 'all' ).addListener);
		console.log('matchMediaAddListenerSupported',matchMediaAddListenerSupported); // TODO: 対応環境を確認したら削除

		// MediaQueryList オブジェクトの生成＆リスナーセット
		_breakpoint_settings.forEach(function(setting){
			if(isFinite(setting.width) && setting.width > 0){
				mql[setting.device] = window.matchMedia('screen and (min-width: '+setting.width+'px)');
				if(matchMediaAddListenerSupported){
					mql[setting.device].addListener(checkBreakPoint);
				}
			}
		});

		// MediaQueryList オブジェクトのリスナーから呼ばれる
		function checkBreakPoint(mql){
			events.forEach(function(event){
				var devide = getCurrentDevice();
				event.fn.call(event.parent,devide,event.params);
			});
		}

		function getCurrentDevice(){
			var _device = _breakpoint_settings[0].device;
			_breakpoint_settings.forEach(function(setting){
				if(mql[setting.device] && mql[setting.device].matches){
					_device = setting.device;
				}
			});
			return _device;
		}

		return {
			/** @function setEvents
			 * ブレイクポイントで切り替わるときに発動するイベントを登録する
			 * @this responsiveController
			 * @param {function|object.<fn,parent,params,first>} event
			 */
			setEvents:function(event){
				if(typeof event === 'function' ){
					events.push({
						parent:window,
						fn:event,
						params:{}
					});
				}else if(typeof event.fn === 'function'){
					events.push({
						parent:event.parent||window,
						fn:event.fn,
						params:event.params||{}
					});
					/* first が指定されていたら、イベントセット時にも処理する*/
					if(event.first){
						var devide = getCurrentDevice();
						var delay = isFinite(event.first)?event.first:0;
						setTimeout(function(){
							event.fn.call(event.parent,devide,event.params);
						},delay);
					}
				}
				return;
			},
			/** @function getCurrentDevice
			 * ブレイクポイントの設定から、現在のデバイスの文字列をかえす
			 * @this responsiveController
			 * @return {string}
			 */
			getCurrentDevice:getCurrentDevice
		};
	})();


	var wrapperController = (function(){
		var wrapper_elm = document.getElementById('wrapper');
		var wrapper_elm_style = wrapper_elm && wrapper_elm.nodeType && wrapper_elm.nodeType ===1 ? wrapper_elm.style : null;
		var pre_scroll_top = 0;
		return {
			fixed:function(){
				if(!wrapper_elm_style){
					console.log('対象のwrapperがありません');
					return;
				}
				pre_scroll_top = document.documentElement.scrollTop || document.body.scrollTop;
				wrapper_elm_style.position = 'fixed';
				wrapper_elm_style.top = (-1 * pre_scroll_top) + 'px';
				scrollTo( 0, 0);
			},
			cancelFixed:function(){
				if(!wrapper_elm_style){
					console.log('対象のwrapperがありません');
					return;
				}
				wrapper_elm_style.position = '';
				wrapper_elm_style.top ='';
				scrollTo( 0, pre_scroll_top);
			}
		};
	})();
	window.wrapperController = wrapperController;


	// フィルター設定
	Vue.filter('addFigure', function (value) {
		return String(value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	});
	Vue.filter('formatDate', formatDate);

	// カスタムディレクティブ
	Vue.directive('formatDateHtml', {
		bind: function (el, binding, vnode) {
			var format = el.dataset && el.dataset.format?el.dataset.format:null;
			el.innerHTML = formatDate(binding.value, format);
		}
	})

	window.responsiveController = responsiveController;

}).call(this);
