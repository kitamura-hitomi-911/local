/**
 * Created by hinit on 2017/06/30.
 */

window.jQuery && (function($, _){
	var checkForm = {
		$tgt_form:null,
		err_msg:{
			text_empty:'入力してください',
			checked_empty:'選択してください',
			selected_empty:'選択してください'
		},
		init:function(op){
			var op = op || {};
			this.$tgt_form = $('#'+op.tgt_form_id);
			if(!this.$tgt_form.length){
				console.log('処理対象のformがありません');
			}
			return;
		},
		check:function(){
			var that = this;
			// 初期化
			var err_flg = false;
			this.$tgt_form.find('p.error').remove();
			this.$tgt_form.find('dl.error').removeClass('error');
			// テキストエリア
			var err_flg = (function(){
					var err_flg = false;
					var err_msg = [];
					var $tgt_elm = that.$tgt_form.find('dl.edit.text');
					var $tgt_input = $tgt_elm.length ? $tgt_elm.find('input') : null;
					if($tgt_input.length){
						var val = $tgt_input.val();
						// 未入力チェック
						if($tgt_elm.hasClass('required') && !val){
							err_flg = true;
							err_msg.push(that.err_msg.text_empty);
						}
						if(err_flg){
							$tgt_elm.addClass('error').find('dd').append('<p class="error">'+err_msg.join('<br>')+'</p>');
						}
					}
					return err_flg;
			})()||err_flg;

			// ラジオボタン
			var err_flg = (function(){
					var err_flg = false;
					var err_msg = [];
					var $tgt_elm = that.$tgt_form.find('dl.edit.radio');
					var $tgt_input = $tgt_elm.length ? $tgt_elm.find('input') : null;
					if($tgt_input.length){
						var checked = $tgt_elm.find('input:checked');
						// 未入力チェック
						if($tgt_elm.hasClass('required') && !checked.length){
							err_flg = true;
							err_msg.push(that.err_msg.checked_empty);
						}
						if(err_flg){
							$tgt_elm.addClass('error').find('dd').append('<p class="error">'+err_msg.join('<br>')+'</p>');
						}
					}
					return err_flg;
				})()||err_flg;

			// チェックボックス
			var err_flg = (function(){
					var err_flg = false;
					var err_msg = [];
					var $tgt_elm = that.$tgt_form.find('dl.edit.checkbox');
					var $tgt_input = $tgt_elm.length ? $tgt_elm.find('input') : null;
					if($tgt_input.length){
						var checked = $tgt_elm.find('input:checked');
						// 未入力チェック
						if($tgt_elm.hasClass('required') && !checked.length){
							err_flg = true;
							err_msg.push(that.err_msg.checked_empty);
						}
						if(err_flg){
							$tgt_elm.addClass('error').find('dd').append('<p class="error">'+err_msg.join('<br>')+'</p>');
						}
					}
					return err_flg;
				})()||err_flg;

			// セレクトボックス
			var err_flg = (function(){
					var err_flg = false;
					var err_msg = [];
					var $tgt_elm = that.$tgt_form.find('dl.edit.selectbox');
					var $tgt_input = $tgt_elm.length ? $tgt_elm.find('select') : null;
					if($tgt_input.length){
						var selected = $tgt_input.find('option:selected');
						// 未選択チェック
						if($tgt_elm.hasClass('required') && !selected.val()){
							err_flg = true;
							err_msg.push(that.err_msg.selected_empty);
						}
						if(err_flg){
							$tgt_elm.addClass('error').find('dd').append('<p class="error">'+err_msg.join('<br>')+'</p>');
						}
					}
					return err_flg;
				})()||err_flg;

			// テキストエリア
			var err_flg = (function(){
					var err_flg = false;
					var err_msg = [];
					var $tgt_elm = that.$tgt_form.find('dl.edit.textarea');
					var $tgt_input = $tgt_elm.length ? $tgt_elm.find('textarea') : null;
					if($tgt_input.length){
						var val = $tgt_input.val();
						// 未選択チェック
						if($tgt_elm.hasClass('required') && !val){
							err_flg = true;
							err_msg.push(that.err_msg.text_empty);
						}
						if(err_flg){
							$tgt_elm.addClass('error').find('dd').append('<p class="error">'+err_msg.join('<br>')+'</p>');
						}
					}
					return err_flg;
				})()||err_flg;
			return !err_flg;
		},
		submit:function(){
			if(this.check()){
				this.$tgt_form.submit();
			}else{
				// エラーメッセージのある位置までスクロール
				var $first_error_elm = this.$tgt_form.find('dl.error:eq(0)');
				if($first_error_elm.length){
					var first_error_elm_offset_top = $first_error_elm.offset().top;
					var current_scroll_top = document.documentElement.scrollTop || document.body.scrollTop;
					if(first_error_elm_offset_top < current_scroll_top){
						$('html,body').animate({scrollTop: first_error_elm_offset_top}, 500, 'swing');
					}
				}
			}
			return;
		}
	};
	window.checkForm = checkForm;
}).call(this, jQuery, _);
