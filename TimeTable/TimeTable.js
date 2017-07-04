/**
 * Created by hinit on 2017/07/05.
 */

window.jQuery && (function($, _){
	"use strict";
	var TimeTable = function(op){
		if(!op){op = {};}
		if(!op.programs || !op.column_tgt_ids || !op.column_key || !op.column_values){
			return;
		}
		// プログラムデータ
		this.data = {};
		this.dataIndexById = {};
		// 列情報
		this.column = {
			$elm:[],
			key:'',
			values:[]
		};
		// タイムテーブル情報
		this.time_table = {
			start_hour:10,
			end_hour:17,
			def_length_of_time:1
		};
		// レイアウト情報
		this.height_of_hour = 200;
		// ステータス
		this.is_disp = false;
		// テンプレート情報
		this.tmpl = {};
		this.init(op);
	};
	TimeTable.prototype.init = function(op){
		this.setFormatData(op.programs);
		this.column.$elm = _.map(op.column_tgt_ids,function(element, index, list){
			var $tgt = $('#'+element);
			return $tgt.length?$tgt:null;
		});
		this.column.key = op.column_key;
		this.column.values = op.column_values;
		this.time_table.start_hour = op.time_table_start_hour||this.time_table.start_hour;
		this.time_table.end_hour = op.time_table_end_hour||this.time_table.end_hour;
		this.def_length_of_time = op.time_table_def_length_of_time || this.time_table.def_length_of_time;
		this.height_of_hour = op.height_of_hour || this.height_of_hour;
		this.tmpl = _.map(op.tmpl_ids,function(element, index, list){
			return _.template($('#'+element).text());
		});
		this.embedPrograms();
		this.setPosition();
		return;
	};
	TimeTable.prototype.setFormatData = function(programs){
		this.data = programs;
		this.dataIndexById = _.indexBy(programs,'ID');
		// column別の配列にする
		// 並び順を時間順にする
		// 時間の重なりを調整する
		return;
	};
	TimeTable.prototype.embedPrograms = function(){
		// HTMLを埋め込む

	};
	TimeTable.prototype.setPosition = function(){
		// 縦位置を調整
	};
	TimeTable.prototype.getProgramData = function(id){
		return this.dataIndexById[id]||null;
	};
	TimeTable.prototype.setHashEvent = function(){
		// hashコントローラーに対しての処理
	};
	window.TimeTable = TimeTable;
}).call(this, jQuery, _);
