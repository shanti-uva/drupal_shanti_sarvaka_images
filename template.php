<?php

/**
 * @file
 * template.php
 */
 
 /**
  *   This is the template.php file for a child sub-theme of the Shanti Sarvaka theme.
  *   Use it to implement custom functions or override existing functions in the theme. 
  */ 
function sarvaka_images_preprocess_views_view(&$vars) {
	dpm($vars, 'vars in view preprocess');
}
