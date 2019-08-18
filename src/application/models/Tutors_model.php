<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Tutors_model extends CI_Model{

    public function filter_appointments($user_id, $service_type, $student_name, $service_status, $start_date, $end_date){
        $this->db->select('
            ea_appointments.id                                     AS id,
            ea_appointments.book_datetime                          AS book_datetime,
            ea_appointments.start_datetime                         AS start_datetime,
            ea_appointments.end_datetime                           AS end_datetime,
            ea_appointments.booking_status                         AS booking_status,
            ea_appointments.feedback                               AS feedback_from_tutor,
            ea_appointments.suggestion                             AS suggestion_from_tutor,
            ea_appointments.stars                                  AS stars,
            ea_appointments.comment_or_suggestion                  AS comment_or_suggestion_from_student,
            ea_appointments.notes                                  AS notes,

            ea_service_categories.name                             AS service_type,

            CONCAT(students.first_name, \' \', students.last_name) AS student_name
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
            $this->db->where('ea_appointments.start_datetime > ', $start_date . ' 00:00');
        }
        if( $end_date != 'ALL' ){
            $this->db->where('ea_appointments.end_datetime < ', $end_date . ' 23:59');
        }
        if( $service_status != 'ALL' ){
            $this->db->where('ea_appointments.booking_status', $service_status);
        }

        return $this->db->get()->result_array();
    }

    public function modify_status($appointment_id, $service_status){
        $this->db->set('booking_status', $service_status);
        $this->db->where('id', $appointment_id);
        return $this->db->update('ea_appointments');
    }

    public function save_settings($user_id, $given_name, $surname, $introduction, $personal_page, $language){

        if($language && $language == '简体中文'){
            $first_name = $surname;
            $last_name = $given_name;
        }else{
            $first_name = $given_name;
            $last_name = $surname;
        }

        $data = [
            'first_name' => $first_name,
            'last_name' => $last_name,
            'introduction' => $introduction,
            'personal_page' => $personal_page
        ];

        $this->db->where('id', $user_id);
        return $this->db->update('ea_users', $data);
    }

    public function save_feedback_and_suggestion($appointment_id, $feedback, $suggestion){

        $data = [
            'feedback' => $feedback,
            'suggestion' => $suggestion
        ];
        $this->db->where('id', $appointment_id);
        return $this->db->update('ea_appointments', $data);

    }

}
?>