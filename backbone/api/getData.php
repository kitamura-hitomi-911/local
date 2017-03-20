<?php
$file_name = $_GET['file_name'];
echo file_get_contents("./".$file_name.".json");
?>