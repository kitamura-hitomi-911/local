var settings = [
	/*
	{
		/**
		/* @type {String} id 設定を表すユニークな id。他と重複しないような名前にすること。
		id:"sample1",
		/**
		/* @type {String} name 設定選択時に表示される文字列。わかりやすいものを
		name:"jsonサンプル1",
		/**
		/* @type {Boolean} [is_delete=false] 設定として無効か否か
		is_delete:true,
		/**
		/* 読み込みファイルに関連する設定
		/* @type {Object} input
		/* @type {Object.<String>} [charset="UTF-8"] 読み込むファイルの文字コード。Shift_JIS or UTF-8 のいずれかを指定可能。
		/* @type {Object.<String|Number>} [linedelim=999999] 読み込むファイルの行の終わりを意味する文字列。
		/* @type {Object.<Number>} [enable_line_from=3] 読み込むファイルの2行め以降の有効な開始行の指定。未指定の場合は 3 （1行めを見出し行、2行めを入力例行を想定）
		/* @type {Object.<Array>} keys 読み込むファイルの項目（key）ごとの設定の配列
		/* @type {Object.<Array>.<String>} excel_name エクセルの見出しの文字列
		/* @type {Object.<Array>.<String>} name 出力時の key 名 ※出力可否の項目のみ必ず "is_be_output" を指定してください。
		/* @type {Object.<Array>.<Boolean>} [is_bool=false] 出力をブーリアン型にするか否か。 true の場合は、〇 が ture、それ以外が false となる。
		/* @type {Object.<Array>.<Boolean>} [is_nl2br=false] 改行コードを <br> にするか否か。
		/* @type {Object.<Array>.<Boolean>} [is_not_output=false] 出力不要か否か。後述の addItem で処理するが個別の key で出力不要の場合に使用する想定。
		/* @type {Object.<Array>.<Function>} [customValue] 出力する値に対しての追加処理
		/*         @param {String} val 元の値
		/*         @return {String} 処理後の値
		/* @type {Object.<Function>} [addItem] 読み込むファイルにない項目の追加処理
		/*         @param {Object} line その行が持つ key value のオブジェクト
		/*         @return {Object} 追加する key value を持つオブジェクト
		input:{
			charset:"Shift_JIS",
			linedelim:'999999',
			enable_line_from:3,
			keys:[
				{
					excel_name:'ID',
					name:'id',
					is_bool:true,
					is_nl2br:true,
					is_not_output:true,
					customValue:function(val){
						return '★'+val;
					}
				},
				// ... 以下、必要な項目の指定を記載。
			]
			addItem:function(line){
				var ret_obj = {};
				ret_obj.item = {
					alt:line.item1 || '',
					src:line.item2 || '',
					target:line.item3 || ''
				};
				return ret_obj;
			}
		},
		/**
		/* 出力に関連する設定
		/* @type {Object} output
		/* @type {Object.<String>} type 出力タイプ "json" もしくは "html"
		/* @type {Object.<String>} name type が json の場合は指定必須。ダウンロードファイル名。拡張性は含めない
		/* @type {Object.<String>} template type が html の場合は指定必須。行単位のHTMLテンプレート、{ } がテンプレートリテラルの @{ } として処理される。line.<key名> で各行の変数を使用可。
		output:{
			type:"json",
			name:'sample1'
		}
	},
	*/
	{
		id:"sample1",
		name:"jsonサンプル1",
		input:{
			charset:"Shift_JIS",
			keys:[
				{
					excel_name:'ID',
					name:'id'
				},
				{
					excel_name:'タイトル',
					name:'title',
					is_nl2br:true,
					customValue:function(val){
						return '★'+val;
					}
				},
				{
					excel_name:'配信有無',
					name:'is_live',
					is_bool:true
				},
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
			keys:[
				{
					excel_name:'ID',
					name:'id'
				},
				{
					excel_name:'タイトル',
					name:'title',
					is_nl2br:true,
				},
				{
					excel_name:'配信有無',
					name:'is_live',
					is_bool:true
				},
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
			charset:"Shift_JIS",
			keys:[
				{
					excel_name:'ID',
					name:'id'
				},
				{
					excel_name:'タイトル',
					name:'title',
					is_nl2br:true,
					customValue:function(val){
						return '★'+val;
					}
				},
				{
					excel_name:'配信有無',
					name:'is_live',
					is_bool:true
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
				{
					excel_name:'出力可否',
					name:'is_be_output'
				}
			],
			addItem:function(line){
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
			charset:"Shift_JIS",
			keys:[
				{
					excel_name:'ID',
					name:'id'
				},
				{
					excel_name:'タイトル',
					name:'title',
					is_nl2br:true,
					customValue:function(val){
						return '★'+val;
					}
				},
				{
					excel_name:'配信有無',
					name:'is_live',
					is_bool:true
				},
				{
					excel_name:'出力可否',
					name:'is_be_output'
				}
			]
		},
		output:{
			type:"html",
			template:`<tr id="{line.id}"><td class="title">{line.title}</td><td class="title">{line.is_live?'〇':''}</td></tr>`
		}
	}
];