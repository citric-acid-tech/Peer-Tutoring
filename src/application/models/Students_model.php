<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * This model is for student end (page) to access database.
 */
class Students_model extends CI_Model{

    /**
     * 
     */
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

    /**
     * 
     * Get all the appointments related to the current users. The user can also use the filter to 
     * speacially select the tutor or service type they want.
     * 
     *       
     * @param user_id the user's id in ea_users table 
     * 
     * @param booking_status the booking status in ea_appointments of the appointments
     *                       input srting 'ALL' if the user want to select all status  
     * 
     * @param service_type   the service type of the appointment, corresponding to ea_services_categories.name
     *                       input srting 'ALL' if the user want to select all the service types
     * 
     * @param tutor_name     the exactly correct name of tutor
     *                       input srting 'ALL' if the user want to select all the tutors
     * 
     * @return array         the result array containing the result of the query
     */
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
            ea_services.start_datetime         AS start_datetime,
            ea_services.end_datetime           AS end_datetime,
            ea_appointments.notes              AS notes,
            ea_appointments.hash               AS hash,
            ea_appointments.is_unavailable     AS is_unavailable,
            ea_appointments.id_google_calendar AS id_google_calendar,
            ea_appointments.booking_status     AS booking_status,
            ea_appointments.feedback           AS feedback,
            ea_appointments.suggestion         AS suggestion,
            ea_appointments.stars              AS stars,
            ea_appointments.comment_or_suggestion AS com_or_sug,
            
            ea_appointments.remark             AS remark,

            ea_users.first_name                AS first_name, 
            ea_users.last_name                 AS last_name,
             
            ea_service_categories.name         AS service_type,
            ea_service_categories.description  AS appointment_description,
            
            ea_services.name                   AS service_name
            ')
            ->from('ea_appointments')
            ->join('ea_services', 'ea_appointments.id_services = ea_services.id', 'inner')
            ->join('ea_service_categories', 'ea_service_categories.id = ea_services.id_service_categories', 'inner')
            ->join('ea_users', 'ea_users.id = ea_services.id_users_provider', 'inner')
            ->where('ea_appointments.id_users_customer', $user_id);

            if($booking_status != 'ALL'){
                $this->db->where('ea_appointments.booking_status', $booking_status);
            }

            if($service_type != 'ALL'){
                $this->db->where('ea_service_categories.name', $service_type);
            }

            if($tutor_name != 'ALL'){
                $this->db->where('ea_services.id_users_provider', $tutor_id);
            }

        return $this->db
            ->order_by('start_datetime', 'ASC')
            ->get()
            ->result_array();
    }

    /**
     * Cancel the appointment. Remove the record from ea_appointments and decrease 'appointments_number' in ea_services
     * 
     * @param appointment_id the id in ea_appointments table of the appointment which is going to be deleted by the user
     * 
     * @return boolean query successes or not 
     */
    public function cancel_appointment($appointment_id){

        // Get all the infomation about the appointment including the time difference between
        // current time and the start datetime of the appointment
        $appointment_info = 
            $this->db
                ->select('booking_status, id_services, TIMESTAMPDIFF(MINUTE,now(), ea_services.start_datetime) AS time_diff')
                ->from('ea_appointments')
                ->join('ea_services', 'ea_services.id = ea_appointments.id_services', 'inner')
                ->where('ea_appointments.id', $appointment_id)
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
            $this->db->set('booking_status', '3');
            $this->db->where('id', $appointment_id);
            $this->db->update('ea_appointments');

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

    /**
     * Search all the available appointments accoriding to the given tutor name and service type
     * 
     * @param service_type   the service type of the appointment, corresponding to ea_services_categories.name
     *                       input srting 'ALL' if the user want to select all the service types
     * 
     * @param tutor_name     the exactly correct name of tutor
     *                       input srting 'ALL' if the user want to select all the tutors
     * 
     * @return array         the result array containing the result of the query
     */
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


    /**
     * Get the tutors whose services are available in MIN_BOOK_AHEAD_MINS (7 days)
     * ordering the tutors by the earilest available time. (Don't care about the appointments_number and capacity)
     * 
     * @param service_type   the service type of the appointment, corresponding to ea_services_categories.name
     *                       input srting 'ALL' if the user want to select all the service types
     * 
     * @param tutor_name     the exactly correct name of tutor
     *                       input srting 'ALL' if the user want to select all the tutors
     * 
     * @return array         the result of the query
     */
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

    /**
     * Useless now
     */
    public function search_tutors_by_name($key){

        return $this->db
                ->select('CONCAT(ea_users.first_name, \' \', ea_users.last_name) AS tutor_name')
                ->from('ea_users')
                ->like('CONCAT(ea_users.first_name, \' \', ea_users.last_name)', $key)
                ->get()
                ->result_array();
    }

    /**
     * 
     * Get the available tutors whose service are available in the given date.
     * 
     * @param date   the date that the user want to check
     * 
     * @return array the result of the query
     */
    public function get_available_tutors_date_selection($date){

        return $this->db
                ->select('
                CONCAT(ea_users.first_name, \' \', ea_users.last_name) AS tutor_name,
                ea_users.personal_page                                 AS personal_page,
                MIN(ea_services.start_datetime)                        AS earliest_start_datetime
                ')
                ->from('ea_services')
                ->join('ea_users', 'ea_users.id = ea_services.id_users_provider', 'inner')
                ->where('ea_services.start_datetime > ', $date . ' 00:00')
                ->where('ea_services.start_datetime < ', $date . ' 23:59')
                ->group_by('tutor_name')
                ->order_by('start_datetime', 'ASC')
                ->get()
                ->result_array();
    }

    /**
     * 
     * Create a new appointment.
     * 
     * [NOTE] As for the statr_datetime and end_datetime. It is just for compatible to the original version of
     * the project. Now these two attributes are moved to ea_services tables. These two fields in ea_appointments
     * will be deleted in the future.
     * 
     * @param user_id    the id of the current user who is going to create this new appointment.
     * @param service_id the id of the chosen service that the user is going to book
     * @param note       the note that the student want to send to the tutor
     * @param remark     the remark of the appointment. Only visible by the student
     * 
     * @return boolean   success or not
     */
    public function new_appointment($user_id, $service_id, $note, $remark){

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


        $data = array(
            'id_services' => $service_id,
            'id_users_customer' => $user_id,
            'book_datetime' => $book_datetime,
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

    /**
     * For testing
     * 
     * Create an student user data.
     */
    public function new_student($first_name, $last_name, $email, $phone_number, $id_roles){
        $data = array(
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => $email,
            'phone_number' => $phone_number,
            'id_roles' => $id_roles
        );

        return $this->db->insert('ea_users', $data);
        
    }
}
?>