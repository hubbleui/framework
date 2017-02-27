<div class="col col-12 col-md-3 gutter-md-xl gutter-md-r md lg xl">

	<div class="doc-menu">
		
		<?php foreach ($docs_menu as $title => $links) : ?>

			<?php 
			$title      = preg_replace("/^\d+_/", '', $title);
			$title_slug = trim(strtolower(preg_replace("/[^a-zA-Z0-9 -]/", '', str_replace(' ', '-', $title)))); ?>
		    <div class="title-wrap js-collapse" data-collapse-target="<?php echo $title_slug;?>">
		        <h6><?php echo $title; ?></h6>
		        <span class="icon glyph-icon glyph-icon-chevron-down"></span>
		    </div>
		    <ul class="list-unstyled collapsed" id="<?php echo $title_slug;?>">
		    <?php foreach ($links as $link) : ?>

		    	<?php 
		    		$link      = preg_replace("/^\d+_/", '', $link);
		    		$link      = ucfirst(str_replace('.html', '', $link));
		    		$link_slug = trim(strtolower(preg_replace("/[^a-zA-Z0-9 -]/", '', str_replace(' ', '-', $link))));
		    	?>
		    	<li><a href="/docs/0.0.01/<?php echo $title_slug;?>/<?php echo $link_slug;?>/"><?php echo $link;?></a></li>
		    <?php endforeach; ?> 
		    </ul>
		 <?php endforeach; ?> 
	</div>
</div>