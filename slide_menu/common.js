/**
 * Created by hinit on 2018/05/03.
 */

!(function(){
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
				pre_scroll_top = (document.documentElement.scrollTop || document.body.scrollTop);
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

	var drawerMenu = (function(){
		var is_open = false;
		var body_elm = document.body;
		return {
			toggle:function(){
				if(is_open){
					body_elm.classList.add('is-drawer-close');
					setTimeout(function(){
						body_elm.classList.remove('is-drawer-open');
						body_elm.classList.remove('is-drawer-close');
						wrapperController.cancelFixed();
					}, 750);
					is_open = false;
				}else{
					body_elm.classList.add('is-drawer-open');
					wrapperController.fixed();
					body_elm.classList.remove('is-drawer-close');
					is_open = true;
				}
			}
		}
	})();
	window.drawerMenu = drawerMenu;
}).call(this);
