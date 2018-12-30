var settings = [
	{
		id:"test",
		name:"テスト",
		input:{
			charset:"utf8",
			keys:[
				{
					"ID":'id',
					"タイトル":"title",
					"配信有無":"is_live"
				}
			],
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