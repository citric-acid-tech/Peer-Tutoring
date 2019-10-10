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
            ea_appointments.attachment_url     AS attachment_url,
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
			ea_users.cas_sid                   AS tutor_sid,
             
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
            ->order_by('start_datetime', 'DESC')
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

        $MIN_CANCEL_AHEAD_MINS = $this->db->select('value')
            ->from('ea_settings')
            ->where('name', 'max_appointment_cancel_ahead_day')
            ->get()
            ->row_array()['value'];

        $MIN_CANCEL_AHEAD_MINS *= 24 * 60;

        if($time_diff >= $MIN_CANCEL_AHEAD_MINS){

            $this->db->trans_begin();

            // Change the booking status of the corresponding appointment
            $this->db->set('booking_status', '3');
            $this->db->where('id', $appointment_id);
            $proc1 = $this->db->update('ea_appointments');

            // Change the appointments number of the relating service
            $id_services = $appointment_info['id_services'];
            $this->db->set('appointments_number', 'appointments_number - 1', FALSE);
            $this->db->where('id', $id_services);
            $proc2 = $this->db->update('ea_services');

            $result = $proc1 && $proc2;

            if( ! $result){
                $this->db->trans_rollback();
            }else{
                // :: Send Email to the tutor and student
                //// Get the information of the service
                $this->load->model('general_model');
                if($this->general_model->is_enable_email_notification()){

                    $row = $this->general_model->get_appointment_info($appointment_id);
                    
                    $this->general_model->send_email('ec_cancel_appoint_tut', array($row['tutor_email']), $row['service_type'], $row['date'], $row['address'], $row['left']);
                    $this->general_model->send_email('ec_cancel_appoint_stu', array($this->session->userdata('user_email')), $row['service_type'], $row['date'], $row['address'], $row['left']);
                }
            }

            $this->db->trans_complete();

        }else{
            $result = FALSE;
        }

        $this->log_operation('cancel_appointment', $appointment_id, $result);

        return $result;
    }

    /**
     * Search all the available appointments accoriding to the given tutor id
     * 
     * @param tutor_id       the exactly correct id in ea_users of tutor
     *                       input srting 'ALL' if the user want to select all the tutors
     * 
     * @return array         the result array containing the result of the query
     */
    public function get_available_appointments($tutor_id, $user_id){
        // tutor_name
        $MIN_BOOK_AHEAD_MINS = $this->db->select('value')
            ->from('ea_settings')
            ->where('name', 'max_services_checking_ahead_day')
            ->get()
            ->row_array()['value'];

        $MIN_BOOK_AHEAD_MINS *= 24 * 60;
        // Get the latest available start datetime
        $latest_available_start_time = 
            $this->db->select('TIMESTAMPADD(MINUTE, ' . $MIN_BOOK_AHEAD_MINS . ', now() ) AS result' )
                      ->get()
                      ->row_array()['result'];

        // Get current datetime
        $now =  $this->db
                ->select('now()')
                ->get()
                ->row_array()['now()'];

        // query
        $this->db
        //                                                         AS is_booked, (0 or 1)
            ->select('
            ea_services.id                                         AS service_id,
            ea_services.description                                AS description,
            ea_services.capacity                                   AS capacity,
            ea_services.appointments_number                        AS appointments_number,
            ea_services.start_datetime                             AS start_datetime,
            ea_services.end_datetime                               AS end_datetime,
            ea_services.address                                    AS address,
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
        if($tutor_id != 'ALL'){
            $this->db->where('ea_users.id', $tutor_id);
        }
        $result = 
            $this->db
                
                ->order_by('service_id', 'ASC')
                ->get()
                ->result_array();
            
        
        $this->db
            ->select('
                ea_services.id AS service_id
            ')
            ->from('ea_services')
            ->join('ea_appointments', 'ea_appointments.id_services = ea_services.id', 'inner')
            ->join('ea_service_categories', 'ea_service_categories.id = ea_services.id_service_categories', 'inner')
            ->join('ea_users', 'ea_users.id = ea_services.id_users_provider', 'inner')
            ->where('ea_appointments.booking_status !=', '3')
            ->where('ea_services.start_datetime < ', $latest_available_start_time)
            ->where('ea_services.start_datetime > ', $now);
        if($tutor_id != 'ALL'){
            $this->db->where('ea_users.id', $tutor_id);
        }
        $status_result = 
            $this->db
                ->where('ea_appointments.id_users_customer', $user_id)
                ->order_by('service_id', 'ASC')
                ->get()
                ->result_array();

        $size = sizeof($result);
        $p = 0;
        for($i = 0; $i < $size; $i++){
            if($result[$i]['service_id'] == $status_result[$p]['service_id']){
                $result[$i]['is_booked'] = '1';
                $p++;
            }else{
                $result[$i]['is_booked'] = '0';
            }
        }

        return $result;
    }

    public function rate_and_comment($appointment_id, $stars, $comment_or_suggestion){
        $this->db->set('stars', $stars);
        $this->db->set('comment_or_suggestion', $comment_or_suggestion);
        $this->db->where('id', $appointment_id);
        $result = $this->db->update('ea_appointments');

        $data = array($appointment_id, $stars, $comment_or_suggestion);
        $this->log_operation('rate_and_comment', $data, $result);

        if($result){
            // :: Send Email to the tutor and student
            //// Get the information of the service
            $this->load->model('general_model');
            if($this->general_model->is_enable_email_notification()){

                $row = $this->general_model->get_appointment_info($appointment_id);
                
                $this->general_model->send_email('ec_survey_comple_tut', array($row['tutor_email']), $row['service_type'], $row['date'], $row['address'], $row['left']);
            }    
        }

        return $result;
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

        $MIN_BOOK_AHEAD_MINS = $this->db->select('value')
            ->from('ea_settings')
            ->where('name', 'max_services_checking_ahead_day')
            ->get()
            ->row_array()['value'];

        $MIN_BOOK_AHEAD_MINS *= 24 * 60;

        // Get the latest available start datetime
        $latest_available_start_time = 
            $this->db->select('TIMESTAMPADD(MINUTE, ' . $MIN_BOOK_AHEAD_MINS . ', now() ) AS result' )
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
			ea_users.cas_sid                                        AS tutor_sid,
            CONCAT(ea_users.first_name, \' \', ea_users.last_name ) AS tutor_name,
            ea_users.personal_page                                  AS personal_page,
            MIN(ea_services.start_datetime)                         AS earliest_start_datetime,
            ea_users.flexible_column                                AS flexible_column,
			ea_users.introduction                                   AS introduction,
			ea_users.avatar_url                                     AS avatar_url
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
                ->group_by('tutor_name, tutor_id')
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
                ea_users.id                                            AS tutor_id,
                CONCAT(ea_users.first_name, \' \', ea_users.last_name) AS tutor_name,
                ea_users.personal_page                                 AS personal_page,
                MIN(ea_services.start_datetime)                        AS earliest_start_datetime,
                ea_users.flexible_column                               AS flexible_column
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
    public function new_appointment($user_id, $service_id, $note, $remark, $file, $file_attached){

        //:: Check if this appointment can be booked or not.
        if($file_attached == '1'){
            $upload_result = $this->upload_file($user_id, $service_id, $file);

            $attachment_url = $upload_result['msg'];
        }else{
            $attachment_url = 'no_file';
        }
        
        //:: Check if it is full.
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
        if($number['capacity'] == $number['num'] || $number['capacity'] < $number['num'] ){
            unlink($attachment_url);
            return 'cap_full';
        }

        //:: Check if it is booked alrealy
        $book_arr = $this->db
            ->select('ea_appointments.booking_status AS status')
            ->from('ea_appointments')
            ->where('ea_appointments.id_users_customer', $user_id)
            ->where('ea_appointments.id_services', $service_id)
            ->get()
            ->result_array();
        
        $booked = FALSE;
        foreach($book_arr AS $row){
            if($row['status'] != '3'){
                $booked = TRUE;
                break;
            }
        }

        if($booked){
            unlink($attachment_url);
            return 'booked';
        }

        //:: Proceed

        //// Insert the appointment into database

        $book_datetime = $this->db->select('NOW()')->get()->row_array()['NOW()'];

        $data = array(
            'id_services' => $service_id,
            'id_users_customer' => $user_id,
            'book_datetime' => $book_datetime,
            'notes' => $note,
            'remark' => $remark,
            'attachment_url' => $attachment_url
        );

        $result = TRUE;

        $this->db->trans_begin();

        if($this->db->insert('ea_appointments',$data)){
            //// Increase the number of appointment of the relating service
            $insert_id = $this->db->insert_id();

            $this->db->set('appointments_number', 'appointments_number + 1', FALSE);
            $this->db->where('id', $service_id);
            if ($this->db->update('ea_services')){

                $result = 'success';

                $this->load->library('session');
                // :: Send Email to the tutor and student
                //// Get the information of the service
                $this->load->model('general_model');
                if($this->general_model->is_enable_email_notification()){
                    $row = $this->general_model->get_service_info($service_id);
                    $this->general_model->send_email('ec_new_appoint_stu', array($this->session->userdata('user_email')), $row['service_type'], $row['date'], $row['address'], $row['left']);
                    $this->general_model->send_email('ec_new_appoint_tut', array($row['tutor_email']), $row['service_type'], $row['date'], $row['address'], $row['left']);
                }
            }else{
                $result = 'denied';
            }
        }else{
            unlink($attachment_url);
            $this->db->trans_rollback();
            $result = 'denied';
        }

        $this->db->trans_complete();

        $this->log_operation('new_appointment', $data, $result);

        return $result;
    }

    public function upload_file($user_id, $service_id, $file){
        // Check empty
        if(is_null($file)){
            return array('result'=> FALSE, 'msg'=> 'no_file');
        }

        $ext = $this->get_extension($file['name']);

        // Check type
        $ext_arr = explode('|', DOCUMENT_FORMAT);
        $is_ok = FALSE;
        foreach($ext_arr AS $val){
            if($ext == $val){
                $is_ok = TRUE;
                break;
            }
        }

        // Check size
        

        if( ! $is_ok){
            return array('result'=> FALSE, 'msg'=> 'invalid_type');
        }

        $hash_id = $this->db
            ->select('ea_users.cas_hash_id AS hash')
            ->from('ea_users')
            ->where('ea_users.id', $user_id)
            ->get()
            ->row_array()['hash'];
        
        
        $file_name = $hash_id .'-'. $service_id .'.'. $ext;
        $file_target_path = DOCUMENT_SAVED_PATH . $file_name;

        move_uploaded_file($file['tmp_name'], $file_target_path);
   
        return array('result'=> TRUE, 'msg'=> $file_name);
    }
    
    protected function get_extension($file){
        $info = pathinfo($file);
        return $info['extension'];
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

    protected function log_operation($op, $input_arr, $output_arr){
        $data = array();
        $now_datetimeObj = new DateTime();
        $now = $now_datetimeObj->format('Y-m-d H:i:s');
        $data = [
            'id_users' => $this->session->userdata('user_id'),
            'operation' => $op,
            'input_json' => json_encode($input_arr),
            'output_json' => json_encode($output_arr),
            'timestamp' => $now
       ];

        $this->db->insert('ea_student_log', $data);
    }
}
?>