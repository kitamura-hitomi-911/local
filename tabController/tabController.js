/**
 * Created by hinit on 2017/07/06.
 */

window.jQuery && (function($, _){
	"use strict";
	window.tabController = {
		$body:null,
		current_tab:'',
		tabs:['day1','day2'],
		init:function(current_tab){
			this.$body = $('body');
			this.current_tab = current_tab || this.getCurrentTabFromHash() || this.tabs[0];;
			this.setTab();
			// hashChangeイベントに渡す
			// this.setOnhashChange();

			return;
		},
		setTab:function(){
			this.$body.removeClass(this.tabs.join(' ')).addClass(this.current_tab);
			return;
		},
		getCurrentTabFromHash:function(hash){
			var ret= '';
			if(hash){
				var hash_tmp = hash.split('-');
				if(_.contains(this.tabs,hash_tmp[0])){
					ret = hash_tmp[0];
				}
			}
			return ret;
		},
		setOnhashChange:function(hash){
			var tab = getCurrentTabFromHash(hash);
			if(tab){
				this.currentTab = tab;
				this.setTab();
			}
		}
	};
}).call(this, jQuery, _);
