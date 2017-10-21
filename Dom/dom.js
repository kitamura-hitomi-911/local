/**
 * Created by hinit on 2017/10/20.
 */

(function(){
	"use strict";
	var _window = window;

	var Dom = (function(){


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
			}
			return ret_ary;
		}

		function slideUp(tgt){
			var html_elm_ary = _getHtmlElementAry(tgt);
			html_elm_ary.forEach(function(html_elm,index,ary){
				var timer_id;
				var base_style = window.getComputedStyle(html_elm);
				var elm_height = html_elm.offsetHeight;
				if(base_style.overflow != 'hidden'){
					html_elm.style.overflow = 'hidden';
				}
				anime();
				function anime(){
					elm_height -= 5;
					if(elm_height <= 0){
						elm_height = 0;
					}
					html_elm.style.height = elm_height + 'px';
					if(elm_height > 0){
						timer_id = setTimeout(anime,5);
					}else{
						html_elm.style.display = 'none';
						html_elm.style.overflow = '';
					}
				}
			});
		}
		function slideDown(tgt){
			var html_elm_ary = _getHtmlElementAry(tgt);
			html_elm_ary.forEach(function(html_elm,index,ary){
				var timer_id;
				var base_style = window.getComputedStyle(html_elm);
				var elm_height = html_elm.offsetHeight;
				var clone_elm = html_elm.cloneNode(true);
				clone_elm.style.cssText = "display:block; height:auto; visibility:hidden;";
				html_elm.parentNode.appendChild(clone_elm);
				var elm_height_goal = clone_elm.offsetHeight;
				html_elm.parentNode.removeChild(clone_elm);
				if(base_style.display == 'none'){
					html_elm.style.display = 'block';
				}else if(base_style.display == 'inline'){
					html_elm.style.display = 'inline-block';
				}
				if(base_style.overflow != 'hidden'){
					html_elm.style.overflow = 'hidden';
				}
				anime();
				function anime(){
					elm_height += 5;
					if(elm_height >= elm_height_goal){
						elm_height = elm_height_goal;
					}
					html_elm.style.height = elm_height + 'px';
					if(elm_height < elm_height_goal){
						timer_id = setTimeout(anime,5);
					}else{
						html_elm.style.height = '';
						html_elm.style.overflow = '';
					}
				}
			});
		}
		function expandAllNode(tgt){
			for(var i=0;i<tgt.childNodes.length;i++){
				// console.log('nodeType',tgt.childNodes[i].nodeType);
				// console.log('nodeName',tgt.childNodes[i].nodeName);
				// console.log('tagName',tgt.childNodes[i].tagName);
				expandAllNode(tgt.childNodes[i]);
			}

		}

		return {
			slideUp:slideUp,
			slideDown:slideDown,
			expandAllNode:expandAllNode
		};
	})();

	_window.Dom = Dom;
}).call(this);
