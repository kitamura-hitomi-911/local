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
			tmpl:null,
			is_active:false,
			type:'',
			is_fixid_type:false,
			pos_y:0,
			args:{}
		},
		computed: {
			styleObj:function(){
				var obj;
				if(this.type==='fullpanel'){
					obj = {
						top:this.pos_y+'px',
						display:'block'
					};
				}
				return obj;
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
					this.is_active = false;
					this.type = this._getTypeFromDevice();
					this.is_active = true;
				}
				return;
			},
			/* 現在のデバイスのおけるデフォルトtype */
			_getTypeFromDevice:function(){
				return responsiveController.getCurrentDevice() === 'sp'?'fullpanel':'popup';
			},
			open:function(obj){
				var component = {
					props:{
						type:String,
						args:Object
					},
					methods: {
						close:function(){
							this.$emit('close');
							return false;
						}
					}
				};
				var args;
				var type;
				if(obj && obj.nodeName ){
					/* onclickによる呼び出し、objはHTML要素 */
					component.template = obj.dataset.tmpl ? '#'+ obj.dataset.tmpl:'';
					args = function(args_text){
						return (args_text||'').split('&&').reduce(function(obj,v){
							var pair = v.split('==');
							obj[pair[0]] = pair[1]||'';
							return obj;
						},{});
					}(obj.dataset.args);
					type = obj.dataset.type || '';
				}else{
					/* JS内からの呼び出し */
					if(obj.tmpl){
						component.template = '#'+ obj.tmpl;
					}else if(obj.component){
						component = obj.component;
					}
					args = obj.args || {};
					type = obj.type || '';
				}
				if(component.template){
					this.args = args;
					this.tmpl = component;
					this.is_fixid_type = type?true:false;
					this.type = type?type:this._getTypeFromDevice();
					this.is_active = true;

					// fullpanelの場合の表示処理
					if(this.type === 'fullpanel'){
						this.pos_y = (document.documentElement.scrollTop || document.body.scrollTop)+window.innerHeight;
					}


				}
				return;
			},
			close:function(){
				this.reset();
			},
			reset:function(){
				this.tmpl = '';
				this.is_active = false;
				this.type = '';
				this.is_fixid_type = false;
				this.args = {};
			}
		},
	});

	window.responsiveController = responsiveController;
	window.vm_modal = vm_modal;

}).call(this);
