<?php include 'logic/vars.php'; ?>
<?php 
foreach ($docs_menu as $dir => $links) {
	$dir_name   = preg_replace("/^\d+_/", '', $dir);
	$dir_slug   = trim(strtolower(preg_replace("/[^a-zA-Z0-9 -]/", '', str_replace(' ', '-', $dir_name))));
	foreach ($links as $link) {
		$file_path   = "pages/$dir/$link";
		$link        = str_replace('.html', '', $link);
		$link        = preg_replace("/^\d+_/", '', $link);
		$link_slug   = trim(strtolower(preg_replace("/[^a-zA-Z0-9 -]/", '', str_replace(' ', '-', $link))));
		$export_path = "export/$dir_slug/$link_slug.html";
		$content     = file_get_contents($file_path);
		if ($content) {
			if(!file_exists(dirname($export_path))) mkdir(dirname($export_path), 0777, true);
			ob_start();
			include 'header/header.php' ; 
			include 'content/content.php';
			include 'footer/footer.php'; 
        	$html = ob_get_clean();
        	file_put_contents($export_path, $html);
		}
	}
}
?>