<?php defined('BASEPATH') OR exit('No direct script access allowed');

function get_flexible_column_label(){
    $ci =& get_instance();
    $ci->load->database();
    return $ci->db->select('value')
        ->from('ea_settings')
        ->where('name', 'flexible_column_label')
        ->get()->row_array()['value'];
}
