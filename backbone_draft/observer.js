/**
 * Created by hinit on 2017/06/16.
 */

var ObserverModel = Backbone.Model.extend({
	onChangeEvent:null,
	initialize: function(attrs, options) {
		if(!options){
			options = {};
		}
		if(options.parent){
			this.parent = options.parent;
		}
		if(options.onChangeEvent){
			this.onChangeEvent = options.onChangeEvent;
			this.on('change',this.onChange);
		}
	},
	onChange:function(model){
		if(_.isFunction(this.onChangeEvent)){
			var parent = this.parent||this;
			this.onChangeEvent.call(parent,model);
		}
	}
});
var ObserverModels = {
	matchStage:ObserverModel.extend({
		defaults: {
			group_id:null,
			stage: null
		}
	}),
	currentMatch:ObserverModel.extend({
		defaults: {
			round: null,
			group_id: null
		}
	}),
	matchUserNum:ObserverModel.extend({
		defaults: {
			group_id:null,
			num:null
		}
	})
};
var test = {
	kari:'aa'
};
var that = test;
var observerModels = {
	matchStage:{
		A:new ObserverModels.matchStage({group_id:'A'},{onChangeEvent:function(model){console.log(this,model.get('group_id'),'matchStage');},parent:that}),
		B:new ObserverModels.matchStage({group_id:'B'},{onChangeEvent:function(model){console.log(this,model.get('group_id'),'matchStage');},parent:that}),
		F:new ObserverModels.matchStage({group_id:'F'},{onChangeEvent:function(model){console.log(this,model.get('group_id'),'matchStage');},parent:that})
	},
	currentMatch:new ObserverModels.currentMatch(null,{onChangeEvent:function(model){console.log(this,model,'currentMatch');},parent:that}),
	matchUserNum:{
		A:new ObserverModels.matchUserNum({group_id:'A'},{onChangeEvent:function(model){console.log(this,model.get('group_id'),'matchUserNum');},parent:that}),
		B:new ObserverModels.matchUserNum({group_id:'B'},{onChangeEvent:function(model){console.log(this,model.get('group_id'),'matchUserNum');},parent:that}),
		F:new ObserverModels.matchUserNum({group_id:'F'},{onChangeEvent:function(model){console.log(this,model.get('group_id'),'matchUserNum');},parent:that})
	}
};
