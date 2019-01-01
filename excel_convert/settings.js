var settings = [
	{
		id:"sample1",
		name:"サンプル1(Shift_JIS)",
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
		name:"サンプル2(UTF-8)",
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
					name:'title'
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
				}
			]
		},
		output:{
			type:"json",
			name:'sample2'
		}
	}
];