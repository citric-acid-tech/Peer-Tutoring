<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Tutors_model extends CI_Model{

    /**
     * Get all the appointment related to the current user. The user can also use the filter to select appointments
     * with specified service type, student, service status and appointment date.
     * 
     * @param user_id        the id in ea_users of the current user
     * @param service_type   the service type of the appointment, corresponding to ea_services_categories.name
     *                       input srting 'ALL' if the user want to select all the service types
     * 
     * @param student_name   the exactly correct name of student
     *                       input srting 'ALL' if the user want to select all the students
     * 
     * @param service_status the booking status in ea_appointments of the appointments
     *                       input srting 'ALL' if the user want to select all status     
     * 
     * @param start_date     the start date of the time interval    
     *                       input srting 'ALL' if the user want to select appointments with a time interval like this (-oo, end_date]
     *  
     * @param end_date       the end date of the time interval
     *                       input srting 'ALL' if the user want to select appointments with a time interval like this [start_date, +oo)
     */
    public function filter_appointments($user_id, $service_type, $student_name, $service_status, $start_date, $end_date){
        $this->db->select('
            ea_appointments.attachment_url                         AS attachment_url,
            ea_appointments.id                                     AS id,
            ea_appointments.book_datetime                          AS book_datetime,

            ea_appointments.booking_status                         AS booking_status,
            ea_appointments.feedback                               AS feedback_from_tutor,
            ea_appointments.suggestion                             AS suggestion_from_tutor,
            ea_appointments.stars                                  AS stars,
            ea_appointments.comment_or_suggestion                  AS comment_or_suggestion_from_student,
            ea_appointments.notes                                  AS notes,

            ea_service_categories.name                             AS service_type,

            ea_services.description                                AS description,
            ea_services.start_datetime                             AS start_datetime,
            ea_services.end_datetime                               AS end_datetime,

            CONCAT(students.first_name, \' \', students.last_name) AS student_name,
            students.cas_sid                                       AS student_sid
        ')
        ->from('ea_appointments')
        ->join('ea_services', 'ea_services.id = ea_appointments.id_services', 'inner')
        ->join('ea_users AS tutors', 'tutors.id = ea_services.id_users_provider', 'inner')
        ->join('ea_users AS students', 'students.id = ea_appointments.id_users_customer', 'inner')
        ->join('ea_service_categories', 'ea_service_categories.id = ea_services.id_service_categories', 'inner')
        ->where('ea_services.id_users_provider', $user_id);

        if( $service_type != 'ALL' ){
            $this->db->where('ea_service_categories.name', $service_type);
        }
        if( $student_name != 'ALL' ){
            $this->db->where('CONCAT(students.first_name, \' \', students.last_name) = ', $student_name);
        }
        if( $start_date != 'ALL' ){
            $this->db->where('ea_services.start_datetime > ', $start_date . ' 00:00');
        }
        if( $end_date != 'ALL' ){
            $this->db->where('ea_services.start_datetime < ', $end_date . ' 23:59');
        }
        if( $service_status != 'ALL' ){
            $this->db->where('ea_appointments.booking_status', $service_status);
        }

        return $this->db->get()->result_array();
    }

    /**
     * Modify the status of the specified appointment
     * 
     * @param appointment_id the id in ea_appointments of the appointment which is going to be modified its booking status
     * @param service_status the status to change
     * 
     * @return boolean       success or not
     */
    public function modify_status($appointment_id, $service_status){
        $this->db->set('booking_status', $service_status);
        $this->db->where('id', $appointment_id);
        $result =  $this->db->update('ea_appointments');

        $data = array('appointment_id' => $appointment_id, 'service_status' => $service_status);
        $this->log_operation('modify_status', $data, $result);

        $this->load->model('general_model');
        if($this->general_model->is_enable_email_notification()){
            $row = $this->general_model->get_appointment_info($appointment_id);
            $this->general_model->send_email('ec_comsug_comple_stu', array($row['student_email']), $row['service_type'], $row['date'], $row['address'], $row['left']);
        }

        return $result;
    }

    /**
     * Modify the tutor's settings
     * If the language selection is Chinese, put the surname into the first_name field in ea_users.
     * If the language selection is English, put the surname into the last_name field in ea_users.
     * 
     * @param user_id       the id in ea_users of the current user
     * @param given_name    the given name
     * @param surname       the surname
     * @param introduction  the introduction
     * @param personal_page the link of the personal page
     * @param language      the language selection kept in session
     * 
     * @return boolean      success or not
     */
    public function save_settings($user_id, $given_name, $surname, $introduction, 
            $personal_page, $email, $phone_number, $address, $language, $flexible_column){
        // email
        // phone_number
        // address
        
        $first_name = $given_name;
        $last_name = $surname;
        

        $data = [
            'first_name' => $first_name,
            'last_name' => $last_name,
            'introduction' => $introduction,
            'personal_page' => $personal_page,
            'email' => $email,
            'address' => $address,
            'phone_number' => $phone_number,
            'flexible_column' => $flexible_column
        ];

        $this->db->where('id', $user_id);
        $result = $this->db->update('ea_users', $data);

        $data['user_id'] = $user_id;
        $data['language'] = $language;
        $this->log_operation('save_settings', $data, $result);

        return $result;
    }

    /**
     * Add and send feedback and suggestion to the student involved in the appointments
     * 
     * @param appointment_id the id in ea_appointments of the selected appointment
     * @param feedback       the feedback
     * @param suggestion     the suggestion
     * 
     * @return boolean       success or not
     */
    public function save_feedback_and_suggestion($appointment_id, $feedback, $suggestion){

        $data = [
            'feedback' => $feedback,
            'suggestion' => $suggestion
        ];
        $this->db->where('id', $appointment_id);
        $result =  $this->db->update('ea_appointments', $data);

        $data['appointment_id'] = $appointment_id;
        $this->log_operation('save_feedback_and_suggestion', $data, $result);

        if($result){
            // :: Send Email to the tutor and student
            //// Get the information of the service
            $this->load->model('general_model');
            if($this->general_model->is_enable_email_notification()){

                $row = $this->general_model->get_appointment_info($appointment_id);
                
                $this->general_model->send_email('ec_comsug_comple_stu', array($row['student_email']), $row['service_type'], $row['date'], $row['address'], $row['left']);
            }
        }

        return $result;
    }

    /**
     * Get the surname, given name, link of personal page and introduction of the user
     * 
     * @param user_id  the id in ea_users of the current user
     * @param language the language selection in session
     * 
     * @return array   the result of the query
     */
    public function get_settings($user_id, $language){

        $select_tab = $language == '简体中文'
            ? '
                last_name       AS given_name,
                first_name      AS surname,
                personal_page   AS personal_page,
                introduction    AS introduction,
                email           AS email,
                address         AS address,
                phone_number    AS phone_number,
                flexible_column AS flexible_column
            '
            :'
                first_name      AS given_name,
                last_name       AS surname,
                personal_page   AS personal_page,
                introduction    AS introduction,
                email           AS email,
                address         AS address,
                phone_number    AS phone_number,
                flexible_column AS flexible_column
            '
            ;

        return $this->db
            ->select($select_tab)
            ->from('ea_users')
            ->where('id', $user_id)
            ->get()
            ->result_array();
    }

    protected function log_operation($op, $input_arr, $output_arr){
        $data = array();
        $now_datetimeObj = new DateTime();
        $now = $now_datetimeObj->format('Y-m-d H:i:s');
        $input_arr['ip_addr']  = $_SERVER["REMOTE_ADDR"];
        $data = [
            'id_users' => $this->session->userdata('user_id'),
            'operation' => $op,
            'input_json' => json_encode($input_arr),
            'output_json' => json_encode($output_arr),
            'timestamp' => $now
       ];

        $this->db->insert('ea_tutor_log', $data);
    }
}
?>