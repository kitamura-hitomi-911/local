
/* model */
var Player = Backbone.Model.extend({
	defaults:{
		id:null,
		name:null,
		rank:null
	}
});

/* collection */
var Players = Backbone.Collection.extend({
	model:Player
});

var players = new Players([{id:1,name:'kari',rank:1},{id:2,name:'kari2',rank:2}]);

/* view */
var V_players = Backbone.View.extend({
	tagName:'div',
	template:_.template($('#tmpl-players').text()),
	initialize: function() {
		var that = this;
		this.render();
		this.collection.models.forEach(function(model){
			that.add(model);
			return;
		});

		this.listenTo(this.collection, 'add', this.add);
		// this.listenTo(this.collection, 'change', this.change);
	},
	render:function(){
		var html = this.template();
		this.$el.empty().html(html);
		return this;
	},
	add:function(model){
		var item = new V_players_item ({ model: model });
		item.render();
		this.$el.find('ul').append(item.el);
	},
	change:function(model){
		console.log('collection のほうのrender');
	}
});

var V_players_item = Backbone.View.extend({
	tagName:'li',
	template:_.template($('#tmpl-players-item').text()),
	initialize: function() {
		this.listenTo(this.model, 'change', this.change);
		// this.model.bind("change", this.render);
	},
	render:function(){
		var html = this.template(this.model.attributes);
		this.$el.empty().html(html);
		return this;
	},
	change:function(){
		console.log('modelのほうのrender');
		this.render();
	}
});



/* viewインスタンス */
var v_players = new V_players({
	el:'#app',
	collection: players
});
console.log(v_players);


console.log(players);