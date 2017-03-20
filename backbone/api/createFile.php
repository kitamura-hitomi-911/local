<?php

$file_name = $_POST['file_name'];
$text = $_POST['text'];



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