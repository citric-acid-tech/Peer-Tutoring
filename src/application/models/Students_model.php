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

        $tutor_id = 0;
        
        if($tutor_name != NULL){
            $tutor_id = $this->db
            ->select('ea_users.id AS tutor_id')
            ->from('ea_users')
            // This where function seems not working. Add an equal mark manually
            ->where('concat(ea_users.first_name, \' \', ea_users.last_name) = ', $tutor_name)
            ->get()
            ->result_array();

            $tutor_id = $tutor_id[0]['tutor_id'];
        }

        $this->db
            ->select('ea_appointments.*, ea_users.first_name, ea_users.last_name')
            ->from('ea_appointments')
            ->where('ea_appointments.id_users_customer', $user_id);

            if($booking_status != 'ALL'){
                $this->db->where('booking_status', $booking_status);
            }

            if($service_type != 'ALL'){
                $this->db->where('service_type', $service_type);
            }

            if($tutor_name != 'ALL'){
                $this->db->where('id_users_provider', $tutor_id);
            }

        return $this->db
            ->join('ea_users', 'ea_appointments.id_users_provider = ea_users.id', 'inner')
            ->get()->result_array();
    }

    public function cancel_appointment($appointment_id){

        $appointment_info = 
            $this->db
                ->select('ea_appointments.*, TIMESTAMPDIFF(MINUTE,now(), ea_appointments.start_datetime) AS time_diff')
                ->from('ea_appointments')
                ->where('id', $appointment_id)
                ->get()->row_array();

        $time_diff = $appointment_info['time_diff'];
        $booking_status = $appointment_info['booking_status'];

        // If the booking_status is 3 (cancelled), then this appointment cannot be cancelled again. Return.
        if($booking_status == '3'){
            return FALSE;
        }

        // MIN_CANCEL_AHEAD_MINS locates in config/constants.php
        if($time_diff >= MIN_CANCEL_AHEAD_MINS){
            $appointment_info['booking_status'] = '3';
            unset($appointment_info['time_diff']);
            $this->db->replace('ea_appointments', $appointment_info);
            return TRUE;
        }else{
            return FALSE;
        }
    }

    public function get_available_appointments(){
        
        $latest_available_start_time = 
            $this->db->select('TIMESTAMPADD(MINUTE, ' . MIN_BOOK_AHEAD_MINS . ', now() ) AS result' )
                      ->get()->row_array()['result'];

        $now =  $this->db->select('now()')->get()->row_array()['now()'];

        return $this->db
            ->select('ea_services.*')
            ->from('ea_services')
            ->where('ea_services.start_datetime < ', $latest_available_start_time)
            ->where('ea_services.start_datetime > ', $now)
            ->get()->result_array();
    }
}
?>