/**
 * @namespace {Array.<object>} settings
 * @property {string} id 設定を表すユニークな id。他と重複しないような名前にすること。
 * @property {string} name 設定選択時に表示される文字列。
 * @property {boolean} [is_delete=false] 設定として無効か否か
 *
 * @property {Object} input 読み込みファイルに関連する設定
 * @property {string} [input.charset] 読み込むファイルがテキストの場合のみ。読み込むファイルの文字コード。Shift_JIS or UTF-8 のいずれかを指定可能。未指定の場合は Excel ファイル扱いになる。
 * @property {string|number} [input.linedelim=999999] 読み込むファイルがテキストの場合のみ。読み込むファイルの行の終わりを意味する文字列。
 * @property {string} [input.quote='"'] 読み込むファイルがテキストの場合のみ。 " or ' のいずれかを指定可能
 * @property {number} [input.enable_line_from=3] 読み込むファイルの2行め以降の有効な開始行の指定。未指定の場合は 3 （1行めを見出し行、2行めを入力例行を想定）
 * @property {string} [input.sheet_name] 読み込むファイルがExcelの場合のみ。対象のシート名を指定。未指定の場合は1つめのシートが選択される
 *
 * @property {Array.<Object>} input.items 読み込むファイルの項目ごとの設定の配列
 * @property {string} input.items[].excel_name エクセルの見出しの文字列
 * @property {string} input.items[].name 出力時の key 名 ※出力可否の項目のみ必ず "is_be_output" を指定してください。
 * @property {boolean} [input.items[].is_bool=false] 出力をブーリアン型にするか否か。 true の場合は、〇 が ture、それ以外が false となる。
 * @property {boolean} [input.items[].is_nl2br=false] 改行コードを <br> にするか否か。
 * @property {string} [input.items[].as_date] 指定されていたら、この日時フォーマットで formatDate する。
 * @property {boolean} [input.items[].is_not_output=false] 該当の項目が出力不要か否か。後述の addItem で処理するが個別の key で出力不要の場合に使用する想定。
 * @property {Function} [input.items[].customValue] 出力する値に対しての追加処理
 *                      @param {string} val 元の値
 *                      @return {String} 処理後の値
 * @property {Function} [input.items[].removeLine] 条件を満たした場合は該当行は出力対象外にする
 *                      @param {string} val 元の値
 *                      @return {boolean} true の場合は該当行は出力されない
 * @property {Function} [input.items[].addItem] 読み込むファイルにない項目の追加処理
 *                      @param {Object} line 該当行の key value のオブジェクト
 *                      @return {Object} 該当行に追加する key value を持つオブジェクト
 *
 * @property {Object} [output = {type:'json','name':id}] 出力に関連する設定
 * @property {string} [type='json'] 出力タイプ "json" もしくは "html"
 * @property {string} [name=id] type が json の場合のダウンロードファイル名。拡張子は含めない。
 * @property {string} template type が html の場合は指定必須。行単位のHTMLテンプレート、{ } がテンプレートリテラルの @{ } として処理される。line.<key名> で各行の変数を使用可。
 */
var settings = [
	{
		id:"excel_sample",
		name:"excel → jsonサンプル",
		input:{
			items:[
				{
					excel_name:'ID',
					name:'id'
				},
				{
					excel_name:'タイトル',
					name:'title',
					is_nl2br:true
				},
				{
					excel_name:'カテゴリ',
					name:'cat',
					customValue:function(val){
						return 'カテゴリ'+val;
					}
				},
				{
					excel_name:'配信有無',
					name:'is_live',
					is_bool:true
				},
				{
					excel_name:'日時',
					name:'date',
					as_date:'YYYY/MM/DD hh:mm:ss'
				},
				{
					excel_name:'出力可否',
					name:'is_be_output'
				}
			]
		}
	},
	{
		id:"sample1",
		name:"tsv(UTF-8) → jsonサンプル1",
		input:{
			charset:"UTF-8",
			items:[
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
					is_bool:true,
					removeLine:function(val){
						return (val !== '〇');
					}
				},
				{
					excel_name:'出力可否',
					name:'is_be_output'
				}
			]
		}
	},
	{
		id:"sample2",
		name:"tsv(Shift_JIS) → jsonサンプル2",
		input:{
			charset:"Shift_JIS",
			items:[
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
		}
	},
	{
		id:"sample3",
		name:"tsv(Shift_JIS) → jsonサンプル3 高度",
		input:{
			charset:"Shift_JIS",
			items:[
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
		}
	},
	{
		id:"sample4",
		name:"tsv(Shift_JIS) → HTMLソースサンプル",
		input:{
			charset:"Shift_JIS",
			items:[
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