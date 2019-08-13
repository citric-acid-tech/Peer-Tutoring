<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Students_model extends CI_Model{

    public function search($booking_status, $service_type, $tutor){
        $this->db->distinct();
        return $this->db
            ->select('ea_appointments.* ')
            ->from('ea_appointments')
            ->where('status', $booking_status)
            ->where('id_service', $service_type)
            ->get()->result_array();
    }

    public function get_my_appointments($user_id, $booking_status, $service_type, $tutor_name){

        //TODO
    }

}

?>