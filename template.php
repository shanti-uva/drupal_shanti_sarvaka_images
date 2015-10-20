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
		drupal_add_js(drupal_get_path('theme', 'sarvaka_images') . '/js/contrib/grid.js', array('group'=>JS_LIBRARY, 'weight'=>9990));
		drupal_add_js(drupal_get_path('theme', 'sarvaka_images') . '/js/contrib/jquery.row-grid.js', array('group'=>JS_LIBRARY, 'weight'=>9980));
		drupal_add_js(drupal_get_path('theme', 'sarvaka_images') . '/js/contrib/photoswipe.js', array('group'=>JS_LIBRARY, 'weight'=>9970));
		drupal_add_js(drupal_get_path('theme', 'sarvaka_images') . '/js/contrib/photoswipe-ui-default.js', array('group'=>JS_LIBRARY, 'weight'=>9990));
		// drupal_add_css(drupal_get_path('theme', 'sarvaka_images') . '/css/flex-images.css');
		drupal_add_css(drupal_get_path('theme', 'sarvaka_images') . '/css/grid-components.css');
		drupal_add_css(drupal_get_path('theme', 'sarvaka_images') . '/css/photoswipe.css');
		drupal_add_css(drupal_get_path('theme', 'sarvaka_images') . '/css/pswp-default-skin.css');
		$view = $vars['view'];
		$results = $view->result;
		$rows = '<div id="og-grid" class="og-grid">';
		foreach ($results as $res) {
			$file = file_load($res->fid);
			$file_ext = ($file->type == 'document') ? '.jpg' : sarvaka_images_get_image_extension($file);
			$furi = str_replace('sharedshelf://', 'public://media-sharedshelf/', check_plain($file->uri)) . $file_ext;
			$thumb_path = image_style_url('media_thumbnail', $furi) ; 		// Thumb path for grid
			$large_path = image_style_url('media_large', $furi) ;					// Large path for popup
			$huge_path = image_style_url('media_lightbox_large', $furi) ;	// Huge path for lightbox
			// Get dimensions for huge image and append to url with "::" separators (url::width::height)
			$hugepts = explode('/sites/', $huge_path);
			$hugepts = explode('?', $hugepts[1]);
			$huge_info = image_get_info('sites/' . $hugepts[0]);
			$huge_path .= '::' . $huge_info['width'] . '::' . $huge_info['height']; 
		    $info_bundle = array('bundle' => $file->type);
		    $wrapper = entity_metadata_wrapper('file', $file, $info_bundle);
			$ftitle = $file->filename;
			$creator = sarvaka_images_metadata_process($wrapper->field_sharedshelf_creator->value());
			if(empty($creator)) {$creator = "Not available";}
			$date = sarvaka_images_metadata_process($wrapper->field_sharedshelf_date->value());
			if(empty($date)) {$date = "Not available";} else { $date = date('F j, Y', strtotime($date)); }
			$photographer = sarvaka_images_metadata_process($wrapper->field_sharedshelf_photographer->value());
			if(empty($photographer)) {$photographer = "Not available";}
			$place = sarvaka_images_metadata_process($wrapper->field_sharedshelf_place->value());
			if(empty($place)) {$place = "Not available";}
			
			$fdesc = $wrapper->field_sharedshelf_description->value(array('sanitize' => TRUE));
			if (empty($fdesc)) {$fdesc = t("No description currently available.");}
			if (strlen($fdesc) > 500) {
				$fdesc = substr($fdesc, 0, 400);
				$fdesc = substr($fdesc, 0, strrpos($fdesc, ' ')) . "...";
			}
			$furl = url('file/' . $file->fid);
			$rows .= '<div class="item">
		    		<a href="' . $furl . '" data-largesrc="' . $large_path . '" data-hugesrc="' . $huge_path . '" data-title="' . $ftitle . '" data-description="' . $fdesc . '" 
			    	data-creator="' . $creator . '" data-photographer="' . $photographer . '" data-date="' . $date . '" data-place="' . $place . '"
			    > <img src="' . $thumb_path . '" alt="' . $ftitle . '" />
			    </a>
		    </div>';
		}
		$rows .= '</div>';
		$vars['rows'] = $rows;
	}
}

function sarvaka_images_metadata_process($mdinfo) {
	if (is_array($mdinfo)) {
		if(count($mdinfo) > 0) {
			return $mdinfo[0];
		} else {
			return "";
		}
	} else {
		return $mdinfo;
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

/**
 * Implements hook_preprocess_file_entity
 * 
 * 	   (Not used yet.)
function sarvaka_images_preprocess_file_entity(&$vars) {
	dpm($vars, 'vars in file pp');
	//$vars['content_attributes'][] = "clearfix";
}

 */
 
/**
 * Implements hook preprocess field
 * 		Hide empty fields in image nodes
 */
function sarvaka_images_preprocess_field(&$vars) {
	if ($vars['element']['#bundle'] == 'image' && count($vars['element']['#items']) == 1 && empty($vars['element'][0]['#markup'])) {
		$vars['classes_array'][] = "hidden";
	}
}

/**
 * Implements preprocess search result
 * 		Removes snippet and info (for now) and adds thumb url
 */
 
$done = FALSE;

function sarvaka_images_preprocess_search_result(&$vars) {
	$vars['snippet'] = '';
	$vars['info'] = '';
	$vars['title_full'] = $vars['title'];
	$vars['title'] = truncate_utf8($vars['title'], 40, FALSE, TRUE);
	$file = file_load($vars['result']['fields']['entity_id']);
	$uri = str_replace('sharedshelf://', 'public://media-sharedshelf/', $file->uri);
	$surl = image_style_path('media_thumbnail', $uri . '.jpg');
	$turl = file_create_url($surl);
	$vars['thumb_url'] = $turl;
}
