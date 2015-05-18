# Starter Kit for a Sub-Theme of the Shanti Sarvaka Theme

This folder should be used to create a sub-theme for the Shanti Sarvaka theme. 
The folder should be copied into the sites .../sites/all/themes/ folder and renamed from sarvaka_images to the name of the sub-theme
Within this folder there are several files that have sarvaka_images as part of the name.
Each instance of "sarvaka_images" should be replaced with your sub-theme's name.

The following items should replace "sarvaka_images" with the sub-theme's name:

* Name of the sarvaka_images folder
* sarvaka_images.info (as well as settings in this file for the following files and the file names themselves):
* shanti-main-sarvaka_images.css
* shanti-search-sarvaka_images.css
* shanti-main-sarvaka_images.js
* shanti-search-sarvaka_images.js
* Name of form alter function (sarvaka_images_form_system_theme_settings_alter) in theme-settings.php


# Custom Theme Colors
Drupal Sub themes of Sarvaka Theme should add the following CSS to the top of their custom CSS (shanti-main-xxx.css) file as below. 
Change the Mediabase's color shown here to the subtheme's custom color:

/* BEGIN subtheme colors */
.titlearea,
.carousel-control,
.breadcrumb .icon,
.nav-justified>li.active a,
.nav-justified>li.active a:hover,
.nav-justified>li.active a:focus{ background:#32ccca;}
.nav-justified>li.active:before{ color:#32ccca;}
/* END subtheme colors */
