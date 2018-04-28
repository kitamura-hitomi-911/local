/**
 * Created by hinit on 2018/03/23.
 */

!(function(){
	"use strict";

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

	console.log(supportsPassive);
	/**
	 *
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
	/**
	 * popup もしくは fullpanel の表示を制御する vueインスタンス
	 * @type {Vue}
	 */
	var vm_modal = new Vue({
		el: '#modal',
		data:{
			/**
			 * @type {object} component 使用するローカルコンポーネント
			 * @type {boolean} is_active DOMにレンダリングするかどうかのフラグ
			 * @type {boolean} is_show DOMのレンダリングが完了したかどうかのフラグ → 表示するための class が適用される
			 * @type {string} type popup もしくは fullpanel
			 * @type {boolean} is_fixid_type メディアクエリから算出されるデバイスでtypeを切り替えないか否か
			 * @type {object} vars template内で使用する変数
			 * 以下はtype が fullpanel のときだけ使用
			 * @type {boolean} is_adjusting 表示調整中か否か → transition の設定が一時的にnoneになる
			 * @type {number} pos_y .fullpanelの top の値
			 * @type {number} tmp_pos_y .fullpanel open時のスクロール位置
			 */
			component:null,
			is_active:false,
			is_show:false,
			type:'',
			is_fixid_type:false,
			vars:{},
			is_adjusting:false,
			pos_y:0,
			tmp_pos_y:0
		},
		computed: {
			/**
			 * $el に適用される classを算出
			 * @return {object}
			 */
			class_obj:function(){
				var obj = {};
				obj['is-popup-show'] = this.type==='popup' && this.is_show ? true:false;
				obj['is-fullpanel-show'] = this.type==='fullpanel' && this.is_show ? true:false;
				obj['is-fullpanel-adjusting'] = this.type==='fullpanel' && this.is_adjusting ? true:false;
				obj[this.type] = true;
				obj[this.type+'-'+this.tmpl_name] = this.tmpl_name ? true : false;
				return obj;
			},
			/**
			 * $el に適用される styleを算出
			 * @return {object}
			 */
			style_obj:function(){
				var obj = {};
				if(this.type === 'fullpanel'){
					obj = {
						top:this.pos_y+'px',
						'min-height': window.innerHeight + 'px'
					};
				}
				return obj;
			},
			/**
			 * component.template が x-template で指定されている場合は テンプレートネームを返す
			 * @return {string}
			 */
			tmpl_name:function(){
				return this.component && this.component.template && typeof this.component.template === 'string'?this.component.template.replace(/^#(tmpl-)?/,''):'';
			}
		},
		template: "#tmpl-modal",
		mounted: function () {
			/* responsiveController にブレイクポイント切り替え時に呼んでほしいイベントをセット */
			responsiveController.setEvents({
				fn:this.onChangeDevice,
				parent:this
			});
		},
		methods: {
			/**
			 * デバイス変更時のtype切り替え処理
			 * @param {string} device
			 */
			onChangeDevice:function(device){
				if(!this.is_fixid_type && this.is_active && this.is_show){
					var _type = this._getTypeFromDevice(device);
					if(this.type !== _type){
						this.hideAnime();
						this.type = _type;
						this.showAnime();
					}
				}
				return;
			},
			/**
			 * 現在のデバイスに対する modalのtypeを返す
			 * @param {string} [device] 未指定の場合はresponsiveControllerに現在のデバイスを問い合わせする
			 * @return {string} fullpanel か popup のいずれか
			 * @private
			 */
			_getTypeFromDevice:function(device){
				var _device = device || responsiveController.getCurrentDevice();
				var _device2type = {
					sp:'fullpanel',
					pad:'popup',
					pc:'popup'
				}

				return _device2type[_device]||'popup';
			},
			/**
			 * modalをopenする
			 * @param {object | HTML element} obj
			 *
			 * ＜objが 連想配列objectの場合＞
			 * @param {object.<string,object,object,string>}
			 *                                    obj.tmpl x-templateのID名 ※
			 *                                    obj.component data.componentに適用される ※
			 *                                    [obj.vars] data.varsに適用される
			 *                                    [obj.type] 指定された場合、data.is_fixed_typeが trueになり data.type に適用される
			 *                                    ※ tmpl と component はどちらかが必須、両方指定された場合はcomponentが優先される
			 * ＜obj が HTML element の場合＞
			 * @param {object.dataset.<string,string,string>}
			 *                                    obj.dataset.tmpl x-templateのID名
			 *                                    [obj.dataset.vars] data.varsに変換するための文字列
			 *                                    [obj.dataset.type] 指定された場合、data.is_fixed_typeが trueになり data.type に適用される
			 */
			open:function(obj){
				if(!obj){
					console.error('パラメータが不足しています');
					return false;
				}
				var _component;
				var _tmpl;
				var _vars;
				var _type;
				if(obj.component_name && Vue.component(obj.component_name)){
					_component = obj.component_name;
					_type = obj.type ||'';
				}else if(obj.component){
					_component = obj.component;
					_type = obj.type ||'';
				}else{
					if(obj.nodeType && obj.nodeType ===1 && obj.dataset && (obj.dataset.tmpl || obj.dataset.vars)){
						_tmpl = obj.dataset.tmpl || '';
						_vars = obj.dataset.vars ? makeArgsObj(obj.dataset.vars):{};
						_type = obj.dataset.type ||'';
						if(!_tmpl && (!_vars.title || !_vars.lead)){
							console.error('デフォルトテンプレートを使用する場合はtitleとleadパラメータが必須です');
							return;
						}
					}else{
						_tmpl = obj.tmpl||'';
						_vars = obj.vars||null;
						_type = obj.type ||'';
						if(!_tmpl && (!_vars.title || !_vars.lead)){
							console.error('デフォルトテンプレートを使用する場合はtitleとleadパラメータが必須です');
							return;
						}
					}
					_component = {
						template:'#'+(_tmpl||'tmpl-modal-base'),
						props:{
							type:String,
							vars:Object
						},
						methods: {
							close:function(){
								this.$emit('close');
								return false;
							}
						}
					};
				}
				console.log(_component);
				if(Vue.component(_component) || _component.template){
					this.vars = _vars;
					this.component = _component;
					this.is_fixid_type = _type?true:false;
					this.type = _type?_type:this._getTypeFromDevice();
					this.is_active = true;
					if(this.type === 'fullpanel'){
						// 現在のスクロール位置をとっておく
						this.tmp_pos_y = (document.documentElement.scrollTop || document.body.scrollTop);
						// 初期位置は画面外
						this.pos_y = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
					}
				}
				/**
				 * パラメータ文字列をパラメータオブジェクトに変換
				 * @param {string} vars_text
				 * @param {string} [separator1=='&&']
				 * @param {string} [separator2=='==']
				 * @return {object}
				 */
				function makeArgsObj(vars_text,separator1,separator2){
					return (vars_text||'').split((separator1||'&&')).reduce(function(obj,v){
						var _pair = v.split((separator2||'=='));
						obj[_pair[0]] = _pair[1]||'';
						return obj;
					},{});
				}

				return;
			},
			/**
			 * modalを閉じる
			 */
			close:function(){
				this.hideAnime(this.resetData);
			},
			/**
			 * dataの値を初期値に戻す
			 */
			resetData:function(){
				var data_def = {
					component:'',
					is_active:false,
					is_show:false,
					type:'',
					is_fixid_type:false,
					vars:{},
					is_adjusting:false,
					pos_y:0,
					tmp_pos_y:0
				};
				for(var i in data_def){
					this[i] = data_def[i];
				}
			},
			/**
			 * modal表示アニメーション
			 */
			showAnime:function(){
				var that = this;
				if(this.type === 'fullpanel'){
					this.is_show = true;
					this.pos_y = (document.documentElement.scrollTop || document.body.scrollTop);
					// TODO: CSS 側のアニメーション時間を待っての処理、500ms をどこに持つべき？（ hideAnime も同じく）
					setTimeout(function(){
						that.is_adjusting = true;
						// TODO: fullpanel表示後に非表示にする対象をどこに情報を持つべき？（ hideAnime も同じく）
						document.getElementsByClassName('l-wrapper')[0].style.display = "none";
						that.pos_y = 0;
						scrollTo( 0, 0);
					},500);
				}else{
					this.is_show = true;
					this._stopScroll();
				}
			},
			/**
			 * modal非表示アニメーション
			 * @param {function} callback アニメーション終了後のコールバック関数
			 */
			hideAnime:function(callback){
				var that = this;
				if(this.type === 'fullpanel'){
					document.getElementsByClassName('l-wrapper')[0].style.display = "block";
					this.pos_y = this.tmp_pos_y;
					scrollTo( 0, this.tmp_pos_y);
					// 位置調整のDOM処理に続いて非表示アニメーションをいれると表示がちらつくので、200msを待ってから処理
					setTimeout(function(){
						that.is_adjusting = false;
						that.pos_y = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
						setTimeout(function(){
							that.is_show = false;
						},500);
						if(callback && typeof callback === 'function' ){
							// TODO: call で呼ぶようにすべき？それとも インスタンス内のメソッドだったら this が固定となっているからよし？
							setTimeout(callback,500);
							//setTimeout(function(){callback.call(that)},500);
						}
					},200);
				}else{
					this._restartScroll();
					this.is_show = false;
					if(callback && typeof callback === 'function' ){
						setTimeout(callback,300);
					}
				}

			},
			_stopScroll:function(){
				console.log('_stopScroll');

				var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
				addEventListenerWithOptions(document,mousewheelevent,this._scrollOff,{once: false ,capture: false ,passive: false });

				if('ontouchstart' in window){
					addEventListenerWithOptions(document,'touchmove',this._scrollOff,{once: false ,capture: false ,passive: false });
				}

				return;
			},
			_restartScroll:function(){
				var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
				document.removeEventListener( mousewheelevent, this._scrollOff, false );
				if('ontouchstart' in window){
					document.removeEventListener('touchmove', this._scrollOff, false);
				}
				return;
			},
			_scrollOff:function(e){
				var target = e.target;
				console.log(e);
				if(!isScrollableElement(target)){
					e.preventDefault();
				}
				// popup-main-innerの内側にいて、 popup-inner が scrollable か
				function isScrollableElement(elm){
					var is_inner_popup_inner_scrollable = false;
					var is_inner_popup_main_inner = false;
					var parent = elm.parentNode;
					for(var i = 0; parent; i++) {
						if(elm.classList.contains('popup-main-inner')){
							is_inner_popup_main_inner = true;
						}
						if(is_inner_popup_main_inner && elm.classList.contains('popup-inner')){
							var _scroll_height = elm.scrollHeight;
							var _apparent_height = elm.offsetHeight;
							var _scroll_top = elm.scrollTop;
							if(_scroll_height > _apparent_height){
								if(_scroll_top === 0){
									elm.scrollTop = 1;
								}else{
									var scrolling_left = _scroll_height - _apparent_height - _scroll_top;
									if(scrolling_left <= 0){
										elm.scrollTop = _scroll_height - _apparent_height - 1;
									}
								}
								is_inner_popup_inner_scrollable = true;
							}
							break;
						}
						elm = parent;
						parent = parent.parentNode;
					}
					return is_inner_popup_inner_scrollable;
				}
			}
		},
	});

	window.responsiveController = responsiveController;
	window.vm_modal = vm_modal;

}).call(this);
