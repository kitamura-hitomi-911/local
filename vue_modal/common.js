/**
 * Created by hinit on 2018/03/23.
 */

!(function(){
	"use strict";

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
			getCurrentDevice:getCurrentDevice
		};
	})();

	var vm_modal = new Vue({
		el: '#modal',
		data:{
			component:null,
			is_active:false,
			is_show:false,
			type:'',
			is_fixid_type:false,
			args:{},
			/* fullpanelのみ使用*/
			is_adjusting:false,
			pos_y:0,
			tmp_pos_y:0
		},
		computed: {
			class_obj:function(){
				var obj = {};
				obj['is-popup-show'] = this.type==='popup' && this.is_show ? true:false;
				obj['is-fullpanel-show'] = this.type==='fullpanel' && this.is_show ? true:false;
				obj['is-fullpanel-adjusting'] = this.type==='fullpanel' && this.is_adjusting ? true:false;
				obj[this.type] = true;
				obj[this.type+'-'+this.tmpl_name] = true;
				return obj;
			},
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
			tmpl_name:function(){
				return this.component && this.component.template && typeof this.component.template === 'string'?this.component.template.replace(/^#(tmpl-)?/,''):'';
			}
		},
		template: "#tmpl-modal",
		mounted: function () {
			responsiveController.setEvents({
				fn:this.onChangeDevice,
				parent:this
			});
		},
		methods: {
			/* デバイス変更時のtype切り替え処理 */
			onChangeDevice:function(device){
				if(!this.is_fixid_type){
					this.hideAnime();
					this.type = this._getTypeFromDevice();
					this.showAnime();
				}
				return;
			},
			/* 現在のデバイスのおけるデフォルトtype */
			_getTypeFromDevice:function(){
				return responsiveController.getCurrentDevice() === 'sp'?'fullpanel':'popup';
			},
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
			close:function(){
				this.hideAnime(this.reset);
			},
			reset:function(){
				// 初期値に戻す
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
