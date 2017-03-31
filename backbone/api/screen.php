<?php
header("Content-Type: text/javascript; charset=utf-8");
$file_name = $_POST['file_name'];

$action = $_POST['action'];
$model = $_POST['model'];
$model_obj = json_decode($model);

$resp = json_decode($model);

if ($action=='read' && file_exists( "./".$file_name.".json" )) {
	$current_json = file_get_contents("./".$file_name.".json");
	echo $current_json;
} else {
	$text = json_encode($resp);
	$fp = fopen($file_name.'.json', 'wb');

	if ($fp){
	if (flock($fp, LOCK_EX)){
	if (fwrite($fp, $text) === FALSE){
	print('ファイル書き込みに失敗しました');
	}

	flock($fp, LOCK_UN);
	}else{
	print('ファイルロックに失敗しました');
	}
	}

	fclose($fp);

	echo $text;
}
?>