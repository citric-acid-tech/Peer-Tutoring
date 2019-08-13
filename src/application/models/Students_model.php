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
        return array();
    }

    public function cancel_appointment($appointment_id){
        
        $time_diff = 
            $this->db
                ->select('TIMESTAMPDIFF(MINUTE,now(), ea_appointments.start_datetime) AS time_diff')
                ->from('ea_appointments')
                ->where('id', $appointment_id)
                ->get()->row_array();

        // flush cache in query constructor
        $this->db->flush_cache();

        // MIN_CANCEL_AHEAD_MINS locates in config/constants.php
        if($time_diff['time_diff'] >= MIN_CANCEL_AHEAD_MINS){
            $this->db->delete('ea_appointments', ['id' => $appointment_id]);
            return TRUE;
        }else{
            return FALSE;
        }
    }
}

?>