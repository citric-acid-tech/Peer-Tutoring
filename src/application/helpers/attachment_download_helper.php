<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @return String get the url of the attachment from database according to the id of the appointment
 */
function get_attachment_url($appointment_id){
    $ci =& get_instance();
    $ci->load->database();
    return $ci->db->select('attachment_url')
        ->from('ea_appointments')
        ->where('id', $appointment_id)
        ->get()->row_array()['attachment_url'];
}
