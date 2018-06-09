Vue.component('form-input',{
	props:{
		form_data:{
			type:Object,
			require: true,
			validator:function (val) {
				return val.name && 'err_msg' in val && 'value' in val;
			}
		}
	},
	data:function(){
		return {
		}
	},
	methods:{
		updateValue:function(e){
			console.log('updateValue',e);

			//インスタンスのデータを更新
			this.$emit('update-form-data',{name:this.form_data.name,value:e.target.value});
		}
	},
	template:'#tmpl-form-input'
});
Vue.component('form-radio',{
	props:{
		form_data:{
			type:Object,
			require: true,
			validator:function (val) {
				return val.name && 'err_msg' in val && 'value' in val;
			}
		}
	},
	data:function(){
		return {
		}
	},
	methods:{
		updateValue:function(e){
			console.log('updateValue',e);

			if(e.target.checked){
				//インスタンスのデータを更新
				this.$emit('update-form-data',{name:this.form_data.name,value:e.target.value});
			}

		}
	},
	template:'#tmpl-form-radio'
});
Vue.component('form-checkbox',{
	props:{
		form_data:{
			type:Object,
			require: true,
			validator:function (val) {
				return val.name && 'err_msg' in val && 'value' in val && Array.isArray(val.value);
			}
		}
	},
	data:function(){
		return {
		}
	},
	methods:{
		updateValue:function(e){
			console.log('updateValue',e);

			//インスタンスのデータを更新
			this.$emit('update-form-data',{name:this.form_data.name,value:e.target.value,checked:e.target.checked});
		}
	},
	template:'#tmpl-form-checkbox'
});
Vue.component('form-select',{
	props:{
		form_data:{
			type:Object,
			require: true,
			validator:function (val) {
				return val.name && 'err_msg' in val && 'value' in val;
			}
		}
	},
	data:function(){
		return {
			selected_label:''
		}
	},
	created:function(){
		// propsからうけとる情報からのlabel初期値セット
		this._updateLabel();
	},
	methods:{
		_updateLabel:function(){
			var that = this;
			this.form_data.list.forEach(function(option){
				if(that.form_data.value == option.value){
					that.selected_label = option.label;
				}
			});
		},
		updateValue:function(e){
			console.log('updateValue',e);
			//インスタンスのデータを更新
			this.$emit('update-form-data',{name:this.form_data.name,value:e.target.value});
			// ラベルの更新
			this._updateLabel();
		}
	},
	template:'#tmpl-form-select'
});

Vue.component('form-textarea',{
	props:{
		form_data:{
			type:Object,
			require: true,
			validator:function (val) {
				return val.name && 'err_msg' in val && 'value' in val;
			}
		}
	},
	data:function(){
		return {
		}
	},
	methods:{
		updateValue:function(e){
			console.log('updateValue',e);

			//インスタンスのデータを更新
			this.$emit('update-form-data',{name:this.form_data.name,value:e.target.value});
		}
	},
	template:'#tmpl-form-textarea'
});

Vue.component('form-item',{
	props:{
		form_data: {
			type: Object,
			require: true,
			validator:function(val){
				return ['text', 'password', 'number','radio','checkbox','select','textarea'].indexOf(val.type) !== -1 && val.item_name;
			}
		}
	},
	data:function(){
		return {
			component_name:'form-input'
		}
	},
	created:function(){
		var component_of = {
			text:'form-input',
			password:'form-input',
			number:'form-input',
			radio:'form-radio',
			checkbox:'form-checkbox',
			select:'form-select',
			textarea:'form-textarea'
		};
		this.component_name = component_of[this.form_data.type] || this.component_name;
		return;
	},
	methods:{
		updateFormData:function(obj){
			console.log('form-item の updateFormData',obj);
			//インスタンスのデータを更新
			this.$emit('update-form-data',obj);
		}
	},
	template:'#tmpl-form-item'
});