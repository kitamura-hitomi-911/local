self.addEventListener('message', onMessage, false);
var previous_obj ={list:[]};

function onMessage(e){
	setInterval(fetchPlayers,1000);
}

function fetchPlayers(){
	var xhr = new XMLHttpRequest();
	// 同期モードで送信
	xhr.open('GET', '../api/players.json', false);
	xhr.responseType = 'json';
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status == 200) {
			var res = xhr.response;
			var previousObjString = JSON.stringify(previous_obj);
			var currentObjString= JSON.stringify(res);
			if(previousObjString !== currentObjString){
				previous_obj = res;
				postMessage(res);
			}
		}
	};
	xhr.send(null);
}