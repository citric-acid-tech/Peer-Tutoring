<?php defined('BASEPATH') OR exit('No direct script access allowed');

// Add custom values by settings them to the $config array.
// Example: $config['smtp_host'] = 'smtp.gmail.com'; 
// @link https://codeigniter.com/user_guide/libraries/email.html

$config['useragent'] = 'Easy!Appointments';
$config['protocol'] = 'smtp'; // or 'smtp'
$config['mailtype'] = 'html'; // or 'text'
$config['smtp_host'] = '';
$config['smtp_user'] = ''; 
$config['smtp_pass'] = '';
$config['smtp_crypto'] = ''; // or 'tls'
$config['smtp_port'] = 25;
