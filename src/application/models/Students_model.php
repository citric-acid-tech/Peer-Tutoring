<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Students_model extends CI_Model{

    public function search($booking_status, $service_type, $tutor){
        $this->db->distinct();
        return $this->db
            ->select('ea_appointments.* ')
            ->from('ea_appointments')
            ->where('status', $booking_status)
            ->where('id_service', $service_type)
            ->get()
            ->result_array();
    }

    public function get_my_appointments($user_id, $booking_status, $service_type, $tutor_name){

        $tutor_id = 0;
        
        // Get the id of the tutor
        if($tutor_name != 'ALL'){
            $tutor_id = $this->db
            ->select('ea_users.id AS tutor_id')
            ->from('ea_users')
            
            // This where function seems not working. Add an equal mark manually
            ->where('concat(ea_users.first_name, \' \', ea_users.last_name) = ', $tutor_name)
            ->get()
            ->result_array();

            $tutor_id = $tutor_id[0]['tutor_id'];
        }

        // query
        $this->db
            ->select('
            ea_appointments.id                 AS appointment_id,
            ea_appointments.book_datetime      AS book_datetime,
            ea_appointments.start_datetime     AS start_datetime,
            ea_appointments.end_datetime       AS end_datetime,
            ea_appointments.notes              AS notes,
            ea_appointments.hash               AS hash,
            ea_appointments.is_unavailable     AS is_unavailable,
            ea_appointments.id_google_calendar AS id_google_calendar,
            ea_appointments.booking_status     AS booking_status,
            ea_appointments.feedback           AS feedback,
            ea_appointments.suggestion         AS suggestion,
            ea_appointments.stars              AS stars,
            ea_appointments.description        AS appointment_description,
            ea_appointments.remark             AS remark,

            ea_users.first_name                AS first_name, 
            ea_users.last_name                 AS last_name,
             
            ea_service_categories.name         AS service_type,
            ea_Service_categories.description  AS service_type_description,
            
            ea_services.name                   AS service_name
            ')
            ->from('ea_appointments')
            ->join('ea_users', 'ea_appointments.id_users_provider = ea_users.id', 'inner')
            ->join('ea_services', 'ea_appointments.id_services = ea_services.id', 'inner')
            ->join('ea_service_categories', 'ea_service_categories.id = ea_services.id_service_categories', 'inner')
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
            ->order_by('start_datetime', 'ASC')
            ->get()
            ->result_array();
    }

    public function cancel_appointment($appointment_id){

        // Get all the infomation about the appointment including the time difference between
        // current time and the start datetime of the appointment
        $appointment_info = 
            $this->db
                ->select('ea_appointments.*, TIMESTAMPDIFF(MINUTE,now(), ea_appointments.start_datetime) AS time_diff')
                ->from('ea_appointments')
                ->where('id', $appointment_id)
                ->get()
                ->row_array();

        $time_diff = $appointment_info['time_diff'];
        $booking_status = $appointment_info['booking_status'];

        // If the booking_status is 3 (cancelled), then this appointment cannot be cancelled again. Return.
        if($booking_status == '3'){
            return FALSE;
        }

        // MIN_CANCEL_AHEAD_MINS locates in config/constants.php
        if($time_diff >= MIN_CANCEL_AHEAD_MINS){

            // Change the booking status of the corresponding appointment
            $appointment_info['booking_status'] = '3';
            unset($appointment_info['time_diff']);
            $this->db->replace('ea_appointments', $appointment_info);

            // Change the appointments number of the relating service
            $id_services = $appointment_info['id_services'];
            $this->db->set('appointments_number', 'appointments_number - 1', FALSE);
            $this->db->where('id', $id_services);
            $this->db->update('ea_services');
            return TRUE;

        }else{
            return FALSE;
        }
    }

    public function get_available_appointments($service_type, $tutor_name){
        
        // Get the latest available start datetime
        $latest_available_start_time = 
            $this->db->select('TIMESTAMPADD(MINUTE, ' . MIN_BOOK_AHEAD_MINS . ', now() ) AS result' )
                      ->get()
                      ->row_array()['result'];

        // Get current datetime
        $now =  $this->db
                ->select('now()')
                ->get()
                ->row_array()['now()'];

        // query
        $this->db
            ->select('
            ea_services.id                                         AS service_id,
            ea_services.name                                       AS service_type,
            ea_services.duration                                   AS duration,
            ea_services.description                                AS description,
            ea_services.capacity                                   AS capacity,
            ea_services.appointments_number                        AS appointments_number,
            ea_services.start_datetime                             AS start_datetime,
            ea_services.end_datetime                               AS end_datetime,

            ea_service_categories.name                             AS service_type, 
            ea_service_categories.description                      AS service_type_description,
            
            CONCAT(ea_users.first_name, \' \', ea_users.last_name) AS tutor_name,

            ea_users.personal_page                                 AS personal_page
            ')
            ->from('ea_services')
            ->join('ea_service_categories', 'ea_service_categories.id = ea_services.id_service_categories', 'inner')
            ->join('ea_users', 'ea_users.id = ea_services.id_users_provider', 'inner')
            ->where('ea_services.start_datetime < ', $latest_available_start_time)
            ->where('ea_services.start_datetime > ', $now);
            
            if($tutor_name != 'ALL'){
                $this->db->where('CONCAT(ea_users.first_name, \' \', ea_users.last_name) = ', $tutor_name);
            }
            if($service_type != 'ALL'){
                $this->db->where('ea_service_categories.name', $service_type);
            }
            
            return $this->db
                ->order_by('start_datetime', 'ASC')
                ->get()
                ->result_array();
    }

    public function rate_and_comment($appointment_id, $stars, $comment_or_suggestion){
        $this->db->set('stars', $stars);
        $this->db->set('comment_or_suggestion', $comment_or_suggestion);
        $this->db->where('id', $appointment_id);
        $this->db->update('ea_appointments');
    }

    public function get_available_tutors($service_type, $tutor_name){

        // Get the latest available start datetime
        $latest_available_start_time = 
            $this->db->select('TIMESTAMPADD(MINUTE, ' . MIN_BOOK_AHEAD_MINS . ', now() ) AS result' )
                      ->get()
                      ->row_array()['result'];

        // Get current datetime
        $now =  $this->db
                ->select('now()')
                ->get()
                ->row_array()['now()'];

        $this->db
            ->select('
            ea_users.id                                             AS tutor_id,
            CONCAT(ea_users.first_name, \' \', ea_users.last_name ) AS tutor_name,
            ea_users.personal_page                                  AS personal_page,
            MIN(ea_services.start_datetime)                         AS earliest_start_datetime
            ')
            ->from('ea_services')
            ->join('ea_users', 'ea_users.id = ea_services.id_users_provider', 'inner')
            ->join('ea_service_categories', 'ea_service_categories.id = ea_services.id_service_categories', 'inner')
            ->where('ea_services.start_datetime < ', $latest_available_start_time)
            ->where('ea_services.start_datetime > ', $now);

            if( $service_type != 'ALL' ){
                $this->db->where('ea_service_categories.name', $service_type);
            }

            if( $tutor_name != 'ALL' ){
                $this->db->where('CONCAT(ea_users.first_name, \' \', ea_users.last_name) = ', $tutor_name);
            }
        return 
            $this->db
                ->group_by('tutor_name')
                ->order_by('start_datetime', 'ASC')
                ->get()
                ->result_array();
    }

    public function search_tutors_by_name($key){

        return $this->db
                ->select('CONCAT(ea_users.first_name, \' \', ea_users.last_name) AS tutor_name')
                ->from('ea_users')
                ->like('CONCAT(ea_users.first_name, \' \', ea_users.last_name)', $key)
                ->get()
                ->result_array();
    }

    public function get_available_tutors_date_selection($start_datetime, $end_datetime){

        return $this->db
                ->select('
                CONCAT(ea_users.first_name, \' \', ea_users.last_name) AS tutor_name,
                ea_users.personal_page                                 AS personal_page,
                MIN(ea_services.start_datetime)                        AS earliest_start_datetime
                ')
                ->from('ea_services')
                ->join('ea_users', 'ea_users.id = ea_services.id_users_provider', 'inner')
                ->where('ea_services.start_datetime > ', $start_datetime)
                ->where('ea_services.end_datetime <', $end_datetime)
                ->group_by('tutor_name')
                ->order_by('start_datetime', 'ASC')
                ->get()
                ->result_array();
    }

    public function new_appointment($user_id, $service_id, $start_datetime, $end_datetime, $note, $remark){

        //:: Check if this appointment can be booked or not.

        //// Check if it is full.
        $number = $this->db
                ->select('
                ea_services.capacity AS capacity,
                ea_services.appointments_number AS num
                ')
                ->from('ea_services')
                ->where('ea_services.id', $service_id)
                ->get()
                ->row_array();
        
        //// This appointment can not be booked since the volumn is limited.
        if($number['capacity'] == $number['num']){
            return FALSE;
        }

        //:: Proceed

        //// Insert the appointment into database

        $book_datetime = $this->db->select('NOW()')->get()->row_array()['NOW()'];

        if( $start_datetime === 'DEFAULT'){
            $start_datetime = $this->db
                ->select('ea_services.start_datetime AS start')
                ->from('ea_services')
                ->where('ea_services.id', $service_id)
                ->get()
                ->row_array()['start'];
        }

        if( $end_datetime === 'DEFAULT'){
            $end_datetime = $this->db
                ->select('ea_services.end_datetime AS end')
                ->from('ea_services')
                ->where('ea_services.id', $service_id)
                ->get()
                ->row_array()['end'];
        }

        $data = array(
            'id_services' => $service_id,
            'id_users_customer' => $user_id,
            'book_datetime' => $book_datetime,
            'start_datetime' => $start_datetime,
            'end_datetime' => $end_datetime,
            'notes' => $note,
            'remark' => $remark
        );

        if($this->db->insert('ea_appointments',$data)){
            //// Increase the number of appointment of the relating service
            $this->db->set('appointments_number', 'appointments_number + 1', FALSE);
            $this->db->where('id', $service_id);
            $this->db->update('ea_services');
            return TRUE;
        }else{
            return FALSE;
        }
    }
}
?>