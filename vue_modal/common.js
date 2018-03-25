/**
 * Created by hinit on 2018/03/23.
 */

!(function(){
	"use strict";

	/**
	 * メディアクエリ関連の処理
	 * @return {object.<function,function>}
	 *               setEvents ブレイクポイントで切り替わるときに発動するイベントを登録する,
	 *               getCurrentDevice 設定された メディアクエリ から算出されるデバイスの文字列をかえす
	 */
	var responsiveController = (function(breakpoint_settings){
		var that = this;
		var _breakpoint_settings = breakpoint_settings && Array.isArray(breakpoint_settings) && breakpoint_settings.length ? breakpoint_settings : [
			{device:'sp',width:0},
			{device:'pad',width:768},
			{device:'pc',width:980}
		];
		var mql = {};
		_breakpoint_settings.forEach(function(setting){
			if(isFinite(setting.width) && setting.width > 0){
				mql[setting.device] = window.matchMedia('screen and (min-width: '+setting.width+'px)');
				mql[setting.device].addListener(checkBreakPoint);
			}
		});

		var events = [];
		function checkBreakPoint(mql){
			events.forEach(function(event){
				var devide = getCurrentDevice();
				event.fn.call(event.parent,devide,event.params);
			});
		}

		function getCurrentDevice(){
			var device = 'sp';
			_breakpoint_settings.forEach(function(setting){
				if(mql[setting.device] && mql[setting.device].matches){
					device = setting.device;
				}
			});
			return device;
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
			 * 設定された メディアクエリ から算出されるデバイスの文字列をかえす
			 * @this responsiveController
			 * @return {string}
			 */
			getCurrentDevice:getCurrentDevice
		};
	})();
	/**
	 *
	 * @type {Vue}
	 */
	var vm_modal = new Vue({
		el: '#modal',
		data:{
			/**
			 * @type {object} component 使用するローカルコンポーネント
			 * @type {boolean} is_active DOMにmodalが適用された状態か否か
			 * @type {boolean} is_show 表示準備が完了しているか否か →CSSなどで表示処理されるトリガーとなる
			 * @type {string} type popup もしくは fullpanel
			 * @type {boolean} is_fixid_type メディアクエリから算出されるデバイスでtypeが切り替わらないか否か
			 * @type {object} args template内で使用する変数
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
			args:{},
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
			 *                                    [obj.args] data.argsに適用される
			 *                                    [obj.type] 指定された場合、data.is_fixed_typeが trueになり data.type に適用される
			 *                                    ※ tmpl と component はどちらかが必須、両方指定された場合はcomponentが優先される
			 * ＜obj が HTML element の場合＞
			 * @param {object.dataset.<string,string,string>}
			 *                                    obj.dataset.tmpl x-templateのID名
			 *                                    [obj.dataset.args] data.argsに変換するための文字列
			 *                                    [obj.dataset.type] 指定された場合、data.is_fixed_typeが trueになり data.type に適用される
			 */
			open:function(obj){
				if(!(obj.component || obj.tmpl || (obj.dataset && obj.dataset.tmpl))){
					console.error('パラメータが不足しています');
					return;
				}
				var _component = obj.component ? obj.component :{
					template:obj.tmpl?'#'+obj.tmpl:'#'+obj.dataset.tmpl,
					props:{
						type:String,
						args:Object
					},
					methods: {
						close:function(){
							this.$emit('close');
							return false;
						}
					},
					components:{
						'popup-base': {
							props: {
								type: String,
								args: Object
							},
							template: '#tmpl-modal-base',
							methods: {
								close: function(){
									this.$emit('close');
								}
							}
						}
					}
				};
				var _args = obj.dataset && obj.dataset.args ? makeArgsObj(obj.dataset.args) : (obj.args || {});
				var _type = obj.dataset && obj.dataset.type ? obj.dataset.type : (obj.type || '');

				if(_component.template){
					this.args = _args;
					this.component = _component;
					this.is_fixid_type = _type?true:false;
					this.type = _type?_type:this._getTypeFromDevice();
					this.is_active = true;
					// fullpanelの場合の初期位置
					if(this.type === 'fullpanel'){
						this.tmp_pos_y = (document.documentElement.scrollTop || document.body.scrollTop);
						this.pos_y = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
					}
				}
				/**
				 * パラメータ文字列をパラメータオブジェクトに変換
				 * @param {string} args_text
				 * @return {object}
				 */
				function makeArgsObj(args_text){
					return (args_text||'').split('&&').reduce(function(obj,v){
						var pair = v.split('==');
						obj[pair[0]] = pair[1]||'';
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
					args:{},
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
					setTimeout(function(){
						that.is_adjusting = true;
						document.getElementsByClassName('l-wrapper')[0].style.display = "none";
						that.pos_y = 0;
					},500)
				}else{
					this.is_show = true;
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
					setTimeout(function(){
						that.is_adjusting = false;
						that.pos_y = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
						if(callback && typeof callback === 'function' ){
							// なんでここ.callなしでいけるのか？
							setTimeout(callback,500);
							//setTimeout(function(){callback.call(that)},500);
						}
					},200);
				}else{
					this.is_show = false;
					if(callback && typeof callback === 'function' ){
						setTimeout(callback,500);
					}
				}

			}
		},
	});

	window.responsiveController = responsiveController;
	window.vm_modal = vm_modal;

}).call(this);
