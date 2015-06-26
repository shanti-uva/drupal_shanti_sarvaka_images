<?php

/**
 * @file
 * template.php
 */
 
 /**
  *   This is the template.php file for a child sub-theme of the Shanti Sarvaka theme.
  *   Use it to implement custom functions or override existing functions in the theme. 
  */ 
  
/**
 * Impelments hook_preprocess_views_view
 * 
 * Used to adjust markup and add js/css for the image grid on the home page.
 */
function sarvaka_images_preprocess_views_view(&$vars) {
	//dpm($vars, 'vars in view preprocess 2');
	if ($vars['view']->name == 'media_sharedshelf_my_images') {
		drupal_add_js(drupal_get_path('theme', 'sarvaka_images') . '/js/contrib/jquery.row-grid.js', array('group'=>JS_THEME, 'weight'=>9970));
		drupal_add_js(drupal_get_path('theme', 'sarvaka_images') . '/js/contrib/grid-init.js', array('group'=>JS_THEME, 'weight'=>9980));
		drupal_add_js(drupal_get_path('theme', 'sarvaka_images') . '/js/contrib/grid.js', array('group'=>JS_THEME, 'weight'=>9990));
		drupal_add_css(drupal_get_path('theme', 'sarvaka_images') . '/css/grid-components.css', array('group'=>CSS_THEME, 'weight'=>9999));
		$view = $vars['view'];
		$results = $view->result;
		$rows = '<div id="og-grid" class="container og-grid">';
		foreach ($results as $res) {
			$file = file_load($res->fid);
			$furi = str_replace('sharedshelf://', 'public://media-sharedshelf/', check_plain($file->uri)) . sarvaka_images_get_image_extension($file);
			$thumb_path = image_style_url('media_thumbnail', $furi) ;
			$large_path = image_style_url('large', $furi) ;
	
	    $info_bundle = array('bundle' => $file->type);
	    $wrapper = entity_metadata_wrapper('file', $file, $info_bundle);
			$ftitle = $file->filename;
			$fdesc = $wrapper->field_sharedshelf_description->value(array('sanitize' => TRUE));
			if (empty($fdesc)) {$fdesc = t("No description currently available.");}
			if (strlen($fdesc) > 500) {
				$fdesc = substr($fdesc, 0, 500);
				$fdesc = substr($fdesc, 0, strrpos($fdesc, ' ')) . "...";
			}
			$rows .= '<div class="item">
		    <a href="#" data-largesrc="' . $large_path . '" data-title="' . $ftitle . '" data-description="' . $fdesc . '">
	        <img src="' . $thumb_path . '" >
		    </a>
	    </div>';
		}
		$rows .= '</div>';
		$vars['rows'] = $rows;
	}
}

function sarvaka_images_get_image_extension($file) {
	$mimetype = $file->filemime;
	switch ($mimetype) {
      case 'image/jpeg':
        return '.jpg';
        break;

      case 'image/tiff':
        return '.tif';
        break;

      case 'image/png':
        return '.png';
        break;

      case 'image/gif':
        return '.gif';
        break;

      default:
        return '';
    }
}
