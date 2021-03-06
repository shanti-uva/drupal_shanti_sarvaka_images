<?php

/**
 * @file
 * template.php
 */
 
 /**
  *   This is the template.php file for a child sub-theme of the Shanti Sarvaka theme.
  *   Use it to implement custom functions or override existing functions in the theme. 
  */ 
  
function sarvaka_images_preprocess_page(&$vars) {
    // Remove extra search tabs for pages with "search/site" in the current path
    $cp = current_path();
    if (strpos($cp, 'search/site/') > -1) {
        $vars['tabs']['#primary'] = array();
    }
}

/**
 * Impelments hook_preprocess_views_view
 * 
 * Used to adjust markup and add js/css for the image grid on the home page.
 */
function sarvaka_images_preprocess_views_view(&$vars) {

	$view = $vars['view']; // Get the view
	
	if ($view->name == 'media_sharedshelf_my_images') {
		
		// Load JavaScript
		drupal_add_js(drupal_get_path('theme', 'sarvaka_images') . '/js/contrib/grid.js', array('group'=>JS_LIBRARY, 'weight'=>9990));
		drupal_add_js(drupal_get_path('theme', 'sarvaka_images') . '/js/contrib/jquery.row-grid.js', array('group'=>JS_LIBRARY, 'weight'=>9980));
		drupal_add_js(drupal_get_path('theme', 'sarvaka_images') . '/js/contrib/photoswipe.js', array('group'=>JS_LIBRARY, 'weight'=>9970));
		drupal_add_js(drupal_get_path('theme', 'sarvaka_images') . '/js/contrib/photoswipe-ui-default.js', array('group'=>JS_LIBRARY, 'weight'=>9960));
		drupal_add_js(drupal_get_path('theme', 'sarvaka_images') . '/js/contrib/jquery.actual.min.js', array('group'=>JS_LIBRARY, 'weight'=>9950));
		
		// Load Page JS Settings
		$countsettings = array(
			'sarvaka_image_gallery' => array(
				'total_items' => $view->query->pager->total_items,
				'items_per_page' => $view->query->pager->options['items_per_page'],
				'page_number' => $view->query->pager->current_page,
				'item_count' => count($view->result),
			),
		);
		drupal_add_js($countsettings, 'setting');
		
		// Load CSS
		drupal_add_css(drupal_get_path('theme', 'sarvaka_images') . '/css/grid-components.css');
		drupal_add_css(drupal_get_path('theme', 'sarvaka_images') . '/css/photoswipe.css');
		drupal_add_css(drupal_get_path('theme', 'sarvaka_images') . '/css/pswp-default-skin.css');
		
		// Process Results
		$results = $view->result;
		$rows = '<div id="og-grid" class="og-grid clearfix">';
		
		// Iterate through results, get info about each file, and build item html 

		foreach ($results as $res) {
			$file = file_load($res->fid); // Load file
			$furl = url('file/' . $file->fid); // Url to file's page
			// Get image paths for various sizes (thumb, large, huge)
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
			
			// Get details about file from metadata_wrapper
		    $info_bundle = array('bundle' => $file->type);
		    $wrapper = entity_metadata_wrapper('file', $file, $info_bundle);
			$ftitle = $file->filename;
			// Creator
			$creator = sarvaka_images_metadata_process($wrapper->field_sharedshelf_creator->value());
			if(empty($creator)) {$creator = "Not available";}
			// Date
			$date = sarvaka_images_metadata_process($wrapper->field_sharedshelf_date->value());
			if(empty($date)) {$date = "Not available";} else { $date = date('F j, Y', strtotime($date)); }
			$photographer = sarvaka_images_metadata_process($wrapper->field_sharedshelf_photographer->value());
			// Photographer
			if(empty($photographer)) {$photographer = "Not available";}
			// Place
			$place = sarvaka_images_metadata_process($wrapper->field_sharedshelf_place->value());
			if(empty($place)) {$place = "Not available";}
			// SSID
			$ssid = sarvaka_images_metadata_process($wrapper->field_sharedshelf_ssid->value());
			
			// Description
			$fdesc = $wrapper->field_sharedshelf_description->value(array('sanitize' => TRUE));
			if (empty($fdesc)) {$fdesc = t("No description currently available.");} 
				// Trim Description 
			if (strlen($fdesc) > 750) { // Trim to 750 characters
				$fdesc = substr($fdesc, 0, 750);
				$fdesc = substr($fdesc, 0, strrpos($fdesc, ' ')) . "...";
			}
			// Type of file (from mimetype)
			$dtype = substr($file->filemime, strpos($file->filemime, '/') + 1); // Take last part of mimetype
			// Create HTML
			$rows .= '<div class="item">
		    		<a href="' . $furl . '" data-largesrc="' . $large_path . '" data-hugesrc="' . $huge_path . '" data-title="' . $ftitle . '" data-description="' . $fdesc . '" 
			    	data-creator="' . $creator . '" data-photographer="' . $photographer . '" data-date="' . $date . '" data-place="' . $place . '" data-type="' . $dtype . '" 
			    	data-ssid="' . $ssid . '" > <img src="' . $thumb_path . '" alt="' . $ftitle . '" />
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
        return '.png'; // Shared Shelf Gifs get saved as PNGs in Drupal (?)
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
 * Implements hook breadcrumb alter
 *    for search pages just make the breadcrumb search
 */
function sarvaka_images_menu_breadcrumb_alter(&$active_trail, $item) {
	if ($item['path'] == 'search/site/%') {
		$active_trail = array(); // remove default breadcrumbs which are messed up
		drupal_set_title(t("Search for “@term”", array('@term' => $item['page_arguments'][1])));
		return;
	}
 }

/**
 * Implements preprocess search results
 */
function sarvaka_images_preprocess_search_results(&$vars) {
	$vars['query_params'] = $vars['query']->getParams();
}
	
/**
 * Implements preprocess search result
 * 		Removes snippet and info (for now) and adds thumb url
 */

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

