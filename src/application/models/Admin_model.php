<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_model extends CI_Model{

    public function __construct(){
        parent::__construct();
        include(APPPATH . 'config' . DIRECTORY_SEPARATOR . 'semesters.php');

        if(is_null($semester)){
            show_error('Cannot find semester configuration file. 
                Please read the instruction and 
                create a configuration file in application/config/semester.php');
        }
    }

    public function new_tutor($first_name, $last_name, $personal_page, 
                                $introduction, $phone_number, $eamil, $address, $flexible_column){
        
        $data = array(
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => $email,
            'phone_number' => $phone_number,
            'address' => $address,
            'introduction' => $introduction,
            'id_roles' => 2,
            'personal_page' => $personal_page
        );

        return $this->db->insert('ea_users', $data);
    }

    public function new_service_batch($date_array, $service_type, $tutor_name, $address, $capacity, $service_description){
        
        //get tutor id and service id from database
        $tutor_id = $this->db
            ->select('ea_users.id AS id')
            ->from('ea_users')
            ->where('CONCAT(ea_users.first_name, \' \', ea_users.last_name) =', $tutor_name)
            ->get()
            ->row_array()['id'];
        $service_id = $this->db
            ->select('ea_service_categories.id AS id')
            ->from('ea_service_categories')
            ->where('ea_service_categories.name', $service_type)
            ->get()
            ->row_array()['id'];

        // Decode the date array and insert all the service in batch

        $i = 0;

        foreach($date_array as $date){
            foreach($date as $class){
                $start_datetime = $class['date'] . ' ' . $class['start_time_h'].':'.$class['start_time_m'];
                $end_datetime = $class['date'] . ' ' . $class['end_time_h'].':'.$class['end_time_m'];
                $data[$i] = array(
                    'description' => $service_description,
                    'capacity' => $capacity,
                    'id_service_categories' => $service_id,
                    'appointments_number' => 0,
                    'start_datetime' => $start_datetime,
                    'end_datetime' => $end_datetime,
                    'id_users_provider' => $tutor_id
                );
                $i = $i + 1;
            }
        }
        
        return $this->db->insert_batch('ea_services', $data);
    }

    public function new_service_type($name, $description){
        // Verify if this name is already exists or not
        $cnt = $this->db
            ->select('count(*) AS count')
            ->from('ea_service_categories')
            ->where('name', $name)
            ->get()
            ->row_array()['count'];
        if($cnt != 0){
            return 'DUPLICATE_NAME';
        }

        // Insert
        $data = array(
            'name' => $name,
            'description' => $description
        );
        return $this->db->insert('ea_service_categories', $data);
    }

    public function filter_appointments_management($service_type, $tutor_name, $student_name, $service_status, $start_date, $end_date){
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

            ea_service_categories.name                             AS service_type,

            CONCAT(students.first_name, \' \', students.last_name) AS student_name,
            CONCAT(tutors.first_name, \' \', tutors.last_name)     AS tutor_name
        ')
        ->from('ea_appointments')
        ->join('ea_services', 'ea_services.id = ea_appointments.id_services', 'inner')
        ->join('ea_users AS tutors', 'tutors.id = ea_services.id_users_provider', 'inner')
        ->join('ea_users AS students', 'students.id = ea_appointments.id_users_customer', 'inner')
        ->join('ea_service_categories', 'ea_service_categories.id = ea_services.id_service_categories', 'inner');

        if( $service_type != 'ALL' ){
            $this->db->where('ea_service_categories.name', $service_type);
        }
        if( $tutor_name != 'ALL' ){
            $this->db->where('CONCAT(tutors.first_name, \' \', tutors.last_name) = ', $tutor_name);
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

    public function filter_tutors($tutor_name){
        $this->db->select('
                CONCAT(ea_users.first_name, \' \', ea_users.last_name) AS tutor_name,
                ea_users.first_name AS first_name,
                ea_users.last_name AS last_name,
                ea_users.personal_page AS personal_page,
                ea_users.introduction AS introduction,
                ea_users.address AS address,
                ea_users.flexible_column AS flexible_coulmn,
                ea_users.email AS email,
                ea_users.phone_number AS phone_number
            ')
            ->from('ea_users')
            ->where('ea_users.id_roles', 2);

        if( $tutor_name != 'ALL'){
            $this->db->where('CONCAT(ea_users.first_name, \' \', ea_users.last_name) = ', $tutor_name);
        }
        return $this->db  
            ->get()
            ->result_array();
    }

    public function edit_tutor($tutor_id, $first_name, $last_name, $personal_page, 
            $introduction, $phone_number, $eamil, $address, $flexible_column){

        $data = array(
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => $email,
            'phone_number' => $phone_number,
            'address' => $address,
            'introduction' => $introduction,
            'personal_page' => $personal_page
        );
        $this->db->where('ea_users.id', $tutor_id);
        return $this->db->update('ea_users', $data);
    }

    public function filter_services($tutor_name, $semester, $week){

        if(is_null($tutor_name)){
            return 'tutor_name absence.';
        }

        include(APPPATH . 'config' . DIRECTORY_SEPARATOR . 'semesters.php');

        $tmp_arr = explode('-', '2019-Fall');

        $first_day  = $semester[  $tmp_arr[0]  ][  $tmp_arr[1]  ]['first_Monday'];
        $last_weeks = $semester[  $tmp_arr[0]  ][  $tmp_arr[1]  ][ 'last_weeks' ];
        
        if(is_null($week) || $week <= 0 || $week > $last_weeks){
            return 'week absence or overflow';
        }

        $tmp_date = new Datetime($first_day);
        $tmp_date->add( new DateInterval('P' . ( ($week - 1)*7 ) . 'D') );
        
        $start_datetime = $tmp_date->format('Y-m-d') . ' 00:00'; // Monday of this week

        for($i = 0; $i < 7; $i++, $tmp_date->add(new DateInterval('P1D'))){
            $result['date'][$i] = $tmp_date->format('Y-m-d');
        }

        $end_datetime = $tmp_date->format('Y-m-d') . ' 00:00'; // Monday of the next week
        
        $this->db->select('
           ea_services.id AS id,
           ea_services.start_datetime AS start_datetime,
           ea_services.end_datetime AS end_datetime,
           ea_service_categories.name AS service_type
        ')
        ->from('ea_services')
        ->join('ea_service_categories', 'ea_service_categories.id = ea_services.id_service_categories', 'inner')
        ->join('ea_users', 'ea_users.id = ea_services.id_users_provider', 'inner')
        ->where('start_datetime > ', $start_datetime)
        ->where('start_datetime <', $end_datetime) // Using end_datetime is also fine
        ->where('CONCAT(ea_users.first_name, \' \', ea_users.last_name) = ', $tutor_name);

        return $this->db->get()
            ->result_array();
    }
}



?>