/**
 * Created by hinit on 2017/06/30.
 */

window.jQuery && (function($, _){
	"use strict";
	/**
	 * セレクトメニューとラベル要素の連動、jqueryプラグインとして使用想定
	 * @param obj
	 *   obj.tgt_elm       : jQueryオブジェクト（必須、jQueryプラグインから必ず渡される）
	 *   obj.select_exp    : tgt_elm 内の select要素 のセレクタ文字列（任意）
	 *   obj.select_p_exp  : tgt_elm 内の セレクトされている内容の表示用要素のセレクタ文字列（任意）
	 *   obj.changeCallback: セレクト変更時のコールバック関数（任意、デフォルトはnull）
	 *                       parent を指定したい場合は {fn:コールバック関数,parent:親} という形で渡す
	 *   obj.is_exec_change_callback_at_init @type {boolean}
	 *                     : changeCallback が指定されている場合、初期化時にも処理するか否か（任意、デフォルトはfalse）
	 * @constructor
	 */
	var SetLabelOfSelectBox = function(obj){
		if(!obj || !obj.tgt_elm) return;
		this.tgt_elm = obj.tgt_elm;
		// セレクト
		this.tgt_select = this.tgt_elm.find(obj.select_exp || 'select');
		// セレクトされている内容の表示用
		this.tgt_select_p = obj.select_p_exp?this.tgt_elm.find(obj.select_p_exp):this.tgt_select.prev('p');
		// セレクト変更後のコールバック
		this.changeCallback = obj.changeCallback || null;
		// セレクト変更後のコールバックをinit時にも処理するか
		this.is_exec_change_callback_at_init = obj.is_exec_change_callback_at_init || false;
		// セレクトされている要素
		this.current_select = null;
		if(this.tgt_select.length){
			this.init();
		}
	};
	SetLabelOfSelectBox.prototype.init = function(){
		var that = this;
		// 初期処理
		this.current_select = this.tgt_select.find('option:selected');
		this.setLabel();
		if(this.is_exec_change_callback_at_init){
			this.onChangeEvent();
		}
		// プルダウン変更時処理
		this.tgt_select.change(function(){
			that.current_select = $(this).find('option:selected');
			that.setLabel();
			that.onChangeEvent();
			return;
		});
	};
	SetLabelOfSelectBox.prototype.setLabel=function(){
		this.tgt_select_p.text(this.current_select.text());
		return;
	};
	SetLabelOfSelectBox.prototype.onChangeEvent=function(){
		var that = this;
		if(this.changeCallback){
			if(typeof(this.changeCallback) == "function"){
				this.changeCallback(this.current_select);
			}else if(typeof(this.changeCallback.fn) == "function"){
				var parent = this.changeCallback.parent || this;
				this.changeCallback.fn.call(parent,this.current_select);
			}
		}
	};
	$.fn.setLabelOfSelectBox = function(op) {
		if(!op){
			op = {};
		}
		return this.each(function(){
			var $this = $(this);
			if(!$this.length){return;}
			op.tgt_elm = $this;
			new SetLabelOfSelectBox(op);
		});
	};

}).call(this, jQuery, _);
