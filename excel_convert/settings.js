var settings = [
	{
		id:"sample1",
		name:"jsonサンプル1",
		input:{
			charset:"Shift_JIS",//  Shift_JIS or UTF-8 、未指定なら UTF-8
			linedelim:'999999', // 行の終わり。未指定なら "999999"
			enable_line_from:3, // 2行め以降、有効な行の始まり。未指定なら 3
			is_nl2br:true, // true なら改行コードを <br> にする。未定なら false
			keys:[
				{
					excel_name:'ID',
					name:'id'
				},
				{
					excel_name:'タイトル',
					name:'title',
					is_nl2br:true, // true なら改行コードを <br> にする。未定なら false
					func:function(val){
						return '★'+val;
					}
				},
				{
					excel_name:'配信有無',
					name:'is_live',
					is_bool:true// true なら 〇 を true 、それ以外を false にする
				},
				/* 出力可否の列の name は is_be_output で固定！ */
				{
					excel_name:'出力可否',
					name:'is_be_output'
				}
			]
		},
		output:{
			type:"json",
			name:'sample1'
		}
	},
	{
		id:"sample2",
		name:"jsonサンプル2",
		input:{
			linedelim:'999999', // 行の終わり。未指定なら "999999"
			enable_line_from:3, // 2行め以降、有効な行の始まり。未指定なら 3
			is_nl2br:true, // true なら改行コードを <br> にする。未定なら false
			keys:[
				{
					excel_name:'ID',
					name:'id'
				},
				{
					excel_name:'タイトル',
					name:'title',
					is_nl2br:true, // true なら改行コードを <br> にする。未定なら false
				},
				{
					excel_name:'配信有無',
					name:'is_live',
					func:function(val){
						var ret = false;
						if(val === '〇'){
							ret = true;
						}
						return ret;
					}
				},
				/* 出力可否の列の name は is_be_output で固定！ */
				{
					excel_name:'出力可否',
					name:'is_be_output'
				}
			]
		},
		output:{
			type:"json",
			name:'sample2'
		}
	},
	{
		id:"sample3",
		name:"jsonサンプル3 高度",
		input:{
			charset:"Shift_JIS",//  Shift_JIS or UTF-8 、未指定なら UTF-8
			linedelim:'999999', // 行の終わり。未指定なら "999999"
			enable_line_from:3, // 2行め以降、有効な行の始まり。未指定なら 3
			is_nl2br:true, // true なら改行コードを <br> にする。未定なら false
			keys:[
				{
					excel_name:'ID',
					name:'id'
				},
				{
					excel_name:'タイトル',
					name:'title',
					is_nl2br:true, // true なら改行コードを <br> にする。未定なら false
					func:function(val){
						return '★'+val;
					}
				},
				{
					excel_name:'配信有無',
					name:'is_live',
					is_bool:true// true なら 〇 を true 、それ以外を false にする
				},
				{
					excel_name:'項目１',
					name:'item1',
					is_not_output:true
				},
				{
					excel_name:'項目２',
					name:'item2',
					is_not_output:true
				},
				{
					excel_name:'項目３',
					name:'item3',
					is_not_output:true
				},
				/* 出力可否の列の name は is_be_output で固定！ */
				{
					excel_name:'出力可否',
					name:'is_be_output'
				}
			],
			/**
			 * 複数の項目を組み合わせ等で新な項目追加等
			 * @param {Object} line  すでにその行が持つ key value のオブジェクト
			 * @return {Object} 追加する key value オブジェクト
			 */
			custom_func:function(line){
				var ret_obj = {};
				ret_obj.item = {
					alt:line.item1 || '',
					src:line.item2 || '',
					target:line.item3 || ''
				};
				return ret_obj;
			}
		},
		output:{
			type:"json",
			name:'sample3'
		}
	},
	{
		id:"sample4",
		name:"HTMLソースサンプル",
		input:{
			charset:"Shift_JIS",//  Shift_JIS or UTF-8 、未指定なら UTF-8
			linedelim:'999999', // 行の終わり。未指定なら "999999"
			enable_line_from:3, // 2行め以降、有効な行の始まり。未指定なら 3
			is_nl2br:true, // true なら改行コードを <br> にする。未定なら false
			keys:[
				{
					excel_name:'ID',
					name:'id'
				},
				{
					excel_name:'タイトル',
					name:'title',
					is_nl2br:true, // true なら改行コードを <br> にする。未定なら false
					func:function(val){
						return '★'+val;
					}
				},
				{
					excel_name:'配信有無',
					name:'is_live',
					is_bool:true// true なら 〇 を true 、それ以外を false にする
				},
				/* 出力可否の列の name は is_be_output で固定！ */
				{
					excel_name:'出力可否',
					name:'is_be_output'
				}
			]
		},
		output:{
			type:"html",
			/* 行単位のテンプレート、{ } 内が評価されます。line.<key名> で各行の変数を指定。文は書けませんが式は書けます。 */
			template:`<tr id="{line.id}"><td class="title">{line.title}</td><td class="title">{line.is_live?'〇':''}</td></tr>`
		}
	}
];