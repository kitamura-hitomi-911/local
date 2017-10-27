var vm = new Vue({
	el: '#app',
	data:function() {
		return {
			memo: {
				id: 1,
				text: '',
				date: '',
				tags: ''
			}
		}
	},
	template: '\
	<div>\
		<editor-view @add="add"></editor-view>\
		<list-item :memo="memo"></list-item>\
	</div>\
	',
	methods: {
		add:function(newMemo) {
			Object.assign(this.memo, newMemo);
		}
	}
});