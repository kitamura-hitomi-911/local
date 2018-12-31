var settings = [
	{
		id:"test",
		name:"テスト",
		input:{
			charset:"Shift_JIS",//  Shift_JIS or UTF-8 、未指定なら TF-8
			linedelim:'999999', // 行の終わり。未指定なら "999999"
			enable_line_from:'3', // 2行め以降、有効な行の始まり。未指定なら3.
			keys:{
				"ID":'id',
				"タイトル":"title",
				"配信有無":"is_live"
			},
			func_of_:{
				is_live:function(val){
					var ret = false;
					if(val === '〇'){
						ret = true;
					}
					return ret;
				}
			}
		},
		output:{
			type:"json",
			name:'test'
		}
	}
];