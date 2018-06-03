/**
 * Created by hinit on 2017/06/30.
 */

(function(){
	"use strict";
	/**
	 * セレクトメニューとラベル要素の連動
	 * @param obj
	 *   obj.tgt_elm       : HTMLエレメント
	 *   obj.select_exp    : tgt_elm 内の select要素 のセレクタ文字列（任意）
	 *   obj.select_p_exp  : tgt_elm 内の セレクトされている内容の表示用要素のセレクタ文字列（任意）
	 *   obj.changeCallback: セレクト変更時のコールバック関数（任意、デフォルトはnull）
	 *                       1つめの引数には現在選択中のoptionが渡される。
	 *                       parent や 追加で2つめの引数を指定したい場合は {fn:コールバック関数,parent:親,params:オブジェクト} という形で渡す
	 *   obj.is_exec_change_callback_at_init @type {boolean}
	 *                     : changeCallback が指定されている場合、初期化時にも処理するか否か（任意、デフォルトはfalse）
	 * @constructor
	 */
	var SetLabelOfSelectBox = function(obj){
		if(!obj || !obj.tgt_elm) return;

		this.tgt_elm = obj.tgt_elm;
		// セレクト
		this.tgt_select = this.tgt_elm.querySelector(obj.select_exp || 'select');
		// セレクトされている内容の表示用
		this.tgt_select_p = obj.select_p_exp?this.tgt_elm.querySelector(obj.select_p_exp):this.tgt_select.previousElementSibling;
		// セレクト変更後のコールバック
		this.changeCallback = obj.changeCallback || null;
		// セレクト変更後のコールバックをinit時にも処理するか
		this.is_exec_change_callback_at_init = obj.is_exec_change_callback_at_init || false;
		// セレクトされている要素
		this.current_select = null;
		console.log(this);
		if(this.tgt_select.length){
			this.init();
		}

	};
	SetLabelOfSelectBox.prototype.init = function(){
		var that = this;
		// 初期処理
		this.current_select = this.tgt_select.options[this.tgt_select.selectedIndex];
		this.setLabel();
		if(this.is_exec_change_callback_at_init){
			this.onChangeEvent();
		}
		// プルダウン変更時処理
		this.tgt_select.addEventListener('change', function(){
			that.current_select = that.tgt_select.options[that.tgt_select.selectedIndex];
			that.setLabel();
			that.onChangeEvent();
			return;
		});
	};
	SetLabelOfSelectBox.prototype.setLabel=function(){
		this.tgt_select_p.textContent = this.current_select.textContent;
		return;
	};
	SetLabelOfSelectBox.prototype.onChangeEvent=function(){
		var that = this;
		if(this.changeCallback){
			if(typeof(this.changeCallback) == "function"){
				this.changeCallback(this.current_select);
			}else if(typeof(this.changeCallback.fn) == "function"){
				var parent = this.changeCallback.parent || this;
				var params = this.changeCallback.params || {};
				this.changeCallback.fn.call(parent,this.current_select,params);
			}
		}
	};
	SetLabelOfSelectBox.prototype.reinit = function(){
		this.current_select = this.tgt_select.options[this.tgt_select.selectedIndex];
		this.setLabel();
	};
	var setLabelOfSelectBox = function(obj){
		if(!obj || !obj.tgt_elm) return;
		var tgt_elms = _getHtmlElementAry(obj.tgt_elm);

		tgt_elms.forEach(function(tgt_elm){
			var op = {
				tgt_elm:tgt_elm
			};
			if(obj.changeCallback){
				op.changeCallback = obj.changeCallback;
			}
			new SetLabelOfSelectBox(op);
		});

		function _getHtmlElementAry(tgt){
			var i=0;
			var ret_ary = [];
			var toString = Object.prototype.toString;
			if(toString.call(tgt) == '[object HTMLCollection]'){
				for(i = 0; i < tgt.length; i++){
					ret_ary.push(tgt[i]);
				}
			}else if(toString.call(tgt) == '[object NodeList]'){
				for(i = 0; i < tgt.length; i++){
					if(tgt[i].nodeType==1){
						ret_ary.push(tgt[i]);
					}
				}
			}else if(toString.call(tgt).match(/^\[object HTML/)){
				ret_ary.push(tgt);
			}else{
				console.log('HTMLエレメントが渡されていません');
			}
			return ret_ary;
		}

	};

	window.setLabelOfSelectBox = setLabelOfSelectBox;

}).call(this);
