<?php
function dirToArray($dir) {
    $result = array();
    $cdir = scandir($dir);
    foreach ($cdir as $key => $value) {
        if (!in_array($value,array(".","..", ".DS_Store")))  {
            if (is_dir($dir . DIRECTORY_SEPARATOR . $value)){
                $result[$value] = dirToArray($dir . DIRECTORY_SEPARATOR . $value);
            } else {
                $result[] = $value;
            }
        }
    }
    return $result;
}

$docs_menu = dirToArray('pages');
?>


