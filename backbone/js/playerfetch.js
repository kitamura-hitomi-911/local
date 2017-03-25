/**
 * Created by hinit on 2017/03/25.
 */

self.addEventListener('message', onMessage, false);

function onMessage(e){
	console.log(e.data);
	setInterval(fetchPlayers,1000);
	fetchPlayers();
}

function fetchPlayers(){
	var xhr = new XMLHttpRequest();
	// 同期モードで送信
	xhr.open('GET', '../api/players.json', false);
	xhr.responseType = 'json';
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status == 200) {
			// 受信できたらメッセージを送信
			var res = xhr.response;
			postMessage(res);
		}
	};
	xhr.send(null);
}