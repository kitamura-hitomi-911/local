<?php

$file_name = $_POST['file_name'];

$action = $_POST['action'];
$model = $_POST['model'];
$model_obj = json_decode($model);

$current_json = file_get_contents("./".$file_name.".json");
$current_json_obj = json_decode($current_json);

$resp = array('list'=>array());

foreach ($current_json_obj->list as &$item) {
	if($item -> id === $model_obj -> id){
		$resp['list'][] = $model_obj;
	}else{
		$resp['list'][] = $item;
	}
}

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
?>