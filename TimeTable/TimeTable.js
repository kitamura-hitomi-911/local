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
		this.timetable = {
			start_num:10,
			end_num:17,
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
		this.column.$elm = _.map(op.column_tgt_ids,function(element, index, list){
			var $tgt = $('#'+element);
			return $tgt.length?$tgt:null;
		});
		this.column.key = op.column_key;
		this.column.values = op.column_values;
		this.timetable.start_num = op.time_table_start_num||this.timetable.start_num;
		this.timetable.end_num = op.time_table_end_num||this.timetable.end_num;
		this.def_length_of_time = op.time_table_def_length_of_time || this.timetable.def_length_of_time;
		this.height_of_hour = op.height_of_hour || this.height_of_hour;
		this.tmpl = _.map(op.tmpl_ids,function(element, index, list){
			return _.template($('#'+element).text());
		});
		this.setFormatData(op.programs);
		this.embedPrograms();
		this.setPosition();
		return;
	};
	TimeTable.prototype.setFormatData = function(programs){
		var that = this;
		// IDでのインデックスを作っておく
		this.dataIndexById = _.indexBy(programs,'ID');

		// 時間を数値化をいれる
		_.each(programs,function(program){
			program.start_num = that._timeToDecimal(program.start_time);
			program.end_num = program.end_time?that._timeToDecimal(program.end_time):program.start_num*1+that.timetable.def_length_of_time*1;
			if(program.end_num > that.timetable.end_num){
				program.end_num = that.timetable.end_num;
			}
		});

		// column別の配列にする
		_.each(this.column.values,function(val){
			that.data[val] = _.filter(programs,function(program){
				return program[that.column.key]==val?true:false;
			});
		});

		// 並び順を時間順にする
		_.each(this.column.values,function(val){
			that.data[val] = _.sortBy(that.data[val],function(program){
				return program.start_num;
			});
		});

		// 時間の重なりを調整する
		_.each(this.column.values,function(val){
			for(var i=0;i<that.data[val].length;i++){

			}
		});

		return;
	};
	// HTMLを埋め込む
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
	// HH:MM表記を十進法の数値化
	TimeTable.prototype._timeToDecimal = function(time){
		if(!time){return;}
		var ret = null;
		var tmp = time.split(':');
		if(tmp.length == 2){
			var hour = tmp[0];
			var minute = tmp[1]/60;
			ret = hour*1 + minute*1;
		}
		return ret;
	};

	window.TimeTable = TimeTable;
}).call(this, jQuery, _);
