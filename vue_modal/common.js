/**
 * Created by hinit on 2018/03/23.
 */

!(function(){
	"use strict";

	/**
	 * メディアクエリ関連の処理
	 * @returns {object.<function,function>}
	 *               setEvents ブレイクポイントで切り替わるときに発動するイベントを登録する,
	 *               getCurrentDevice 設定された メディアクエリ から算出されるデバイスの文字列をかえす
	 */
	var responsiveController = (function(){
		var that = this;
		var mql = window.matchMedia('screen and (min-width: 768px)');
		var events = [];
		function checkBreakPoint(mql){
			events.forEach(function(event){
				var devide = getCurrentDevice();
				event.fn.call(event.parent,devide,event.params);
			});
		}

		function getCurrentDevice(){
			return mql.matches?'pc':'sp';
		}

		mql.addListener(checkBreakPoint);

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
			 * @returns {string} ->sp(768px未満) か pc(768px以上)のいずれか
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
			 * @type {boolean} is_adjusting 見えないところで表示調整中か否か → transition の設定が一時的にnoneになる
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
			 * .popup もしくは .fullpanel に適用される classを算出
			 * @returns {object}
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
			 * .popup もしくは .fullpanel に適用される styleを算出
			 * @returns {object}
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
			 * @returns {string}
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
			 * @param {string} device sp(768px未満) か pc(768px以上)のいずれか
			 */
			onChangeDevice:function(device){
				if(!this.is_fixid_type && this.is_active && this.is_show){
					this.hideAnime();
					this.type = this._getTypeFromDevice();
					this.showAnime();
				}
				return;
			},
			/**
			 * responsiveControllerに現在のデバイスを問い合わせて、modalのtypeを返す
			 * @returns {string} fullpanel か popup のいずれか
			 * @private
			 */
			_getTypeFromDevice:function(){
				return responsiveController.getCurrentDevice() === 'sp'?'fullpanel':'popup';
			},
			/**
			 * modalをopenする
			 * @param {object | HTML element} obj
			 *
			 * ＜objが 連想配列objectの場合＞
			 * @param {object.<string,object,object,string>}
			 *                                    obj.tmpl x-templateのID名 ※
			 *                                    obj.component data.componentに適用される ※
			 *                                    obj.args data.argsに適用される
			 *                                    [obj.type] 指定された場合、data.is_fixed_typeが trueになり data.type に適用される
			 *                                    ※ tmpl と component はどちらかが必須、両方指定された場合はcomponentが優先される
			 * ＜obj が HTML element の場合＞
			 * @param {object.dataset.<string,string,string>}
			 *                                    obj.dataset.tmpl x-templateのID名
			 *                                    obj.dataset.args data.argsに変換するための文字列
			 *                                    [obj.dataset.type] 定された場合、data.is_fixed_typeが trueになり data.type に適用される
			 */
			open:function(obj){
				var _component = {
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
				var _args;
				var _type;
				if(obj && obj.nodeName ){
					/* onclickによる呼び出し、objはHTML要素 */
					_component.template = obj.dataset.tmpl ? '#'+ obj.dataset.tmpl:'';
					_args = function(args_text){
						return (args_text||'').split('&&').reduce(function(obj,v){
							var pair = v.split('==');
							obj[pair[0]] = pair[1]||'';
							return obj;
						},{});
					}(obj.dataset.args);
					_type = obj.dataset.type || '';
				}else{
					/* JS内からの呼び出し */
					if(obj.tmpl){
						_component.template = '#'+ obj.tmpl;
					}else if(obj.component){
						_component = obj.component;
					}
					_args = obj.args || {};
					_type = obj.type || '';
				}
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
				return;
			},
			/**
			 * modalを閉じる
			 */
			close:function(){
				this.hideAnime(this.reset);
			},
			/**
			 * dataの値を初期値に戻す
			 */
			reset:function(){
				console.log('reset',this);
				this.component = '';
				this.is_active = false;
				this.is_show = false;
				this.type = '';
				this.args = {};
				this.is_fixid_type = false;
				this.is_adjusting = false;
				this.pos_y = 0;
				this.tmp_pos_y = 0;
			},
			/**
			 * 表示アニメーション
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
			 * 非表示アニメーション
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
