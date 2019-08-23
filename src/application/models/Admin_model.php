<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_model extends CI_Model{
    
    /**
     * Useless for now
     */
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

    /**
     * Create a new service
     * 
     * @param date                the date of this service
     * @param start_time          the started time of the service
     * @param end_time            the end time of the service
     * @param service_type        the service type (ea_service_categories.name) of this service
     * @param tutor_name          the tutor who hosts this service
     * @param address             the address of this service
     * @param capacity            the volumn or max number of students can attend
     * @param service_description the description of the service 
     * 
     * @return boolean            success or not
     */
    public function new_service($date, $start_time, $end_time, $service_type, $tutor_name,
        $address, $capacity, $service_description){
        
        //get tutor id and service id from database
        $tutor_id = $this->db
            ->select('ea_users.id AS id')
            ->from('ea_users')
            ->where('CONCAT(ea_users.first_name, \' \', ea_users.last_name) =', $tutor_name)
            ->get()
            ->row_array()['id'];
        $service_categories_id = $this->db
            ->select('ea_service_categories.id AS id')
            ->from('ea_service_categories')
            ->where('ea_service_categories.name', $service_type)
            ->get()
            ->row_array()['id'];

        // Decode the date array and insert all the service in batch

        $data = array(
            'description' => $service_description,
            'capacity' => $capacity,
            'id_service_categories' => $service_categories_id,
            'appointments_number' => 0,
            'start_datetime' => $date . ' ' . $start_time,
            'end_datetime' => $date . ' ' . $end_time,
            'id_users_provider' => $tutor_id,
            'address' => $address
        );

        return $this->db->insert('ea_services', $data);
    }

    /**
     * Modify the infomation of  the current and existed service
     * 
     * @param date                the date of this service
     * @param start_time          the started time of the service
     * @param end_time            the end time of the service
     * @param service_type        the service type (ea_service_categories.name) of this service
     * @param tutor_name          the tutor who hosts this service
     * @param address             the address of this service
     * @param capacity            the volumn or max number of students can attend
     * @param service_description the description of the service 
     * 
     * @return boolean            success or not 
     */
    public function edit_service($service_id, $date, $start_time, $end_time, $service_type, 
        $address, $capacity, $service_description){
        
        //get tutor id and service id from database
        $tutor_id = $this->db
            ->select('ea_users.id AS id')
            ->from('ea_users')
            ->where('CONCAT(ea_users.first_name, \' \', ea_users.last_name) =', $tutor_name)
            ->get()
            ->row_array()['id'];
        $service_categories_id = $this->db
            ->select('ea_service_categories.id AS id')
            ->from('ea_service_categories')
            ->where('ea_service_categories.name', $service_type)
            ->get()
            ->row_array()['id'];

        // Decode the date array and insert all the service in batch
        
    

        $data = array(
            'description' => $service_description,
            'capacity' => $capacity,
            'id_service_categories' => $service_categories_id,
            'appointments_number' => 0,
            'start_datetime' => $date . ' ' . $start_time,
            'end_datetime' => $date . ' ' . $end_time,
            'id_users_provider' => $tutor_id,
            'address' => $address
        );
        
        $this->db->where('ea_services.id', $service_id);
        return $this->db->update('ea_services', $data);
    }

    /**
     * Create a new service type in the name filed in ea_service_categories table
     * 
     * @param name        the name of the service
     * @param description the description of this service type
     */
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

    /**
     * Get all the appointment in the database. The administrator can also use the filter to select specified appointments.
     * 
     * @param service_type   the service type of the appointment, corresponding to ea_services_categories.name
     *                       input srting 'ALL' if the user want to select all the service types
     * 
     * @param tutor_name     the exactly correct name of tutor
     *                       input srting 'ALL' if the user want to select all the tutors
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
     * 
     * @return array the result of the query
     */
    public function filter_appointments_management($service_type, $tutor_name, $student_name, $start_date, $end_date, $service_status,$appointment_id){
        $this->db->select('
            ea_appointments.id                                     AS id,
            ea_appointments.book_datetime                          AS book_datetime,
            ea_appointments.booking_status                         AS booking_status,
            ea_appointments.feedback                               AS feedback_from_tutor,
            ea_appointments.suggestion                             AS suggestion_from_tutor,
            ea_appointments.stars                                  AS stars,
            ea_appointments.comment_or_suggestion                  AS comment_or_suggestion_from_student,

            ea_service_categories.name                             AS service_type,
            ea_services.start_datetime                             AS start_datetime,
            ea_services.end_datetime                               AS end_datetime,

            CONCAT(students.first_name, \' \', students.last_name) AS student_name,
            CONCAT(tutors.first_name, \' \', tutors.last_name)     AS tutor_name
        ')
        ->from('ea_appointments')
        ->join('ea_services', 'ea_services.id = ea_appointments.id_services', 'inner')
        ->join('ea_users AS tutors', 'tutors.id = ea_services.id_users_provider', 'inner')
        ->join('ea_users AS students', 'students.id = ea_appointments.id_users_customer', 'inner')
        ->join('ea_service_categories', 'ea_service_categories.id = ea_services.id_service_categories', 'inner');

        if( $appointment_id != 'ALL' ){
            $this->db->where('ea_appointments.id', $appointment_id);
            // Return directly
            return $this->db
                ->order_by('ea_services.start_datetime')->get()->result_array();
        }

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
            $this->db->where('ea_services.start_datetime > ', $start_date . ' 00:00');
        }
        if( $end_date != 'ALL' ){
            $this->db->where('ea_services.start_datetime < ', $end_date . ' 23:59');
        }
        if( $service_status != 'ALL' ){
            $this->db->where('ea_appointments.booking_status', $service_status);
        }

        return $this->db
            ->order_by('ea_services.start_datetime')->get()->result_array();

    }

    /**
     * Get all the tutors in database. The administrator can also use the filter to get the infomation of
     * the specified tutors
     * 
     * @param tutor_name     the exactly correct name of tutor
     *                       input srting 'ALL' if the user want to select all the tutors
     * 
     * @return array         the result of the query
     */
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

    /**
     * Modify the tutor's information
     * 
     * @param tutor_id        the id in ea_users of the tutor whose information is going to be modified
     * @param first_name      the first name of the tutor
     * @param last_name       the last name of the tutor
     * @param personal_page   the link of personal page
     * @param introduction    the introduction
     * @param phone_number    the phone number
     * @param email           the email address
     * @param address         the default address of the teaching venue
     * @param flexible_column the content of the flexible column
     * 
     * @return boolean        success or not
     */
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

    /**
     * Get all the services. Administrators can also use filter to get the specified services
     * 
     * @param tutor_name    the exactly correct name of the tutor
     * @param semester_info a string like '2019-Fall', '2019-Summer'
     * @param week          the week that the administrator want to check
     * 
     * @return array        the result of the query
     */
    public function filter_services($tutor_name, $semester_info, $week){

        if(is_null($tutor_name)){
            return 'tutor_name absence.';
        }

        // :: Get the first day and the last day of this semester

        include(APPPATH . 'config' . DIRECTORY_SEPARATOR . 'semesters.php');

        $tmp_arr = explode('-', $semester_info);

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
           ea_services.id             AS id,
           ea_services.start_datetime AS start_datetime,
           ea_services.end_datetime   AS end_datetime,
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

    /**
     * Administrators schedule all weeks in the semester for a tutor by a given schema of one week.
     * 
     * @param tutor_name    the name of the tutor
     * @param semester_info a string like '2019-Fall', '2019-Summer'
     * @param services_id   an array contains all the service ids of the given schema
     * @param week          the week of the given schema
     * 
     * @return boolean      success or not
     */
    public function schedule_current_schema_to_all_weeks($tutor_name, $semester_info, $services_id, $week){
        
        if(is_null($tutor_name)){
            return 'tutor_name absence.';
        }

        // :: Get the first day and the last day of this semester
        
        include(APPPATH . 'config' . DIRECTORY_SEPARATOR . 'semesters.php');

        $tmp_arr = explode('-', $semester_info);

        $first_day  = $semester[  $tmp_arr[0]  ][  $tmp_arr[1]  ]['first_Monday'];
        $last_weeks = $semester[  $tmp_arr[0]  ][  $tmp_arr[1]  ][ 'last_weeks' ];

        if(is_null($week) || $week <= 0 || $week > $last_weeks){
            return 'week absence or overflow';
        }

        $last_day = new Datetime($first_day);
        $last_day->add( new DateInterval('P' . ( $last_weeks*7 ) . 'D') );
        
        $first_datetime = $first_day . ' 00:00'; // First day of the semester
        $last_datetime = $last_day->format('Y-m-d') . ' 00:00'; // Last day of the semester

        // :: Get the data of all services which are going to be added.

        $services_id_arr = $services_id;

        $data = array();

        for($i = 0; $i < sizeof($services_id_arr); $i++){

            $service_id = $services_id_arr[$i];

            $row_data = $this->db->select('ea_services.*')
                ->from('ea_services')
                ->where('id', $service_id)
                ->get()
                ->row_array();
            
            unset($row_data['id']);
            unset($row_data['name']);
            $row_data['appointments_number'] = 0;

            $start_day = explode(' ', $row_data['start_datetime'])[0];
            $diff_interval = date_diff(new Datetime($first_day), new Datetime($start_day));
            $diff_days = $diff_interval->format('%d');
            $diff_days %= 7;

            $start_time = explode(' ', $row_data['start_datetime'])[1];
            $end_time = explode(' ', $row_data['end_datetime'])[1];

            $tmp_Datetime_pointer = new Datetime($first_day);
            $tmp_Datetime_pointer->add(new DateInterval('P'.$diff_days.'D'));

            echo $tmp_Datetime_pointer->format('Y-m-d') . '<br />';

            for($j = 0; $j < $last_weeks; $j++){    

                $row_data['start_datetime'] = $tmp_Datetime_pointer->format('Y-m-d') . ' ' . $start_time;
                $row_data['end_datetime'] = $tmp_Datetime_pointer->format('Y-m-d') . ' ' . $end_time;

                $data[$i.' '.$j] = $row_data;

                $tmp_Datetime_pointer->add( new DateInterval('P7D') );
            }
        }
        
        // :: Clean all the services in this semester
        
        //// Deal with students who have already made appointment with these services.
        
        //// Get tutor's id
        $tutor_id = $this->db->select('ea_users.id')
                        ->from('ea_users')
                        ->where('CONCAT(ea_users.first_name, \' \', ea_users.last_name) = ', $tutor_name)
                        ->get()
                        ->row_array()['id'];

        //// Get the id of all the involved services
        $involved_services_id_arr = $this->db->select('ea_services.id')->from('ea_services')
            ->where('start_datetime >', $first_datetime)
            ->where('start_datetime <', $last_datetime)
            ->where('id_users_provider', $tutor_id)
            ->get()
            ->result_array();

        //// Get the email of all the involved students
        $involved_app_info_arr = array();
        
        foreach($involved_services_id_arr AS $row){
            $tmp_app_info_arr = $this->db
                ->select('ea_users.email AS email')
                ->from('ea_appointments')
                ->join('ea_users', 'ea_users.id = ea_appointments.id_users_customer', 'inner')
                ->where('ea_appointments.id_services', $row['id'])
                ->get()
                ->result_array();
            $involved_app_info_arr = array_merge($involved_app_info_arr, $tmp_app_info_arr);
        }

        //// Send emails to these students
        foreach($involved_app_info_arr AS $row){
            $this->send_email_service_deletion_inform($row['email']);
        }
        
        $app_delete_bool = TRUE;
        //// Delete all the involved appointments
        foreach($involved_services_id_arr AS $row){
            $this->db->where('id_services', $row['id']);
            $app_delete_bool &= $this->db->delete('ea_appointments');
        }

        //// Delete all the involved services
        $this->db->where('start_datetime >', $first_datetime);
        $this->db->where('start_datetime <', $last_datetime);
        $this->db->where('id_users_provider', $tutor_id);
        $services_delete_bool = $this->db->delete('ea_services');

        // :: Insert new services
        $services_insert_bool =  $this->db->insert_batch('ea_services', $data);

        return array($app_delete_bool, $services_delete_bool, $services_insert_bool);
    }

    /**
     * Get all the sevice types. Administrators can also use the filter to select specified service type
     * 
     * @param service_type   the service type of the appointment, corresponding to ea_services_categories.name
     *                       input srting 'ALL' if the user want to select all the service types
     * 
     * @return array         the result of the query
     */
    public function filter_service_types($service_type){
        $this->db->select('
            ea_service_categories.id          AS id,
            ea_service_categories.name        AS name,
            ea_service_categories.description AS description
        ')
        ->from('ea_service_categories');

        if($service_type != 'ALL'){
            $this->db->where('ea_service_categories.name', $service_type);
        }

        $service_type_info = $this->db->get()->result_array();

        $result = array();

        $i = 0;
        foreach($service_type_info AS $row){
            $result[$i]['info'] = $row;
            $tmp_result_arr = $this->db->select('
                CONCAT(ea_users.first_name, \' \', ea_users.last_name) AS tutor_name
            ')
            ->from('ea_services')
            ->join('ea_users', 'ea_users.id = ea_services.id_users_provider', 'inner')
            ->where('ea_services.id_service_categories', $row['id'])
            ->group_by('tutor_name')
            ->get()->result_array();

            $result[$i]['tutors'] = array();

            $j = 0;
            foreach($tmp_result_arr AS $row){
                $result[$i]['tutors'][$j++] = $row['tutor_name'];
            }

            $i++; 
        }

        return $result;
    }

    /**
     * Modify the infomation of the service type related to the given id of the service type in ea_service_categories
     * 
     * @param service_type_id the id in ea_service_categories of the service type
     * @param name            name if the service type
     * @param description     the description
     * 
     * @return boolean        success or not
     */
    public function edit_service_type($service_type_id, $name, $description){
        $this->db->where('ea_service_categories.id', $service_type_id);
        $data = [
            'name' => $name,
            'description' => $description
        ];
        return $this->db->update('ea_service_categories', $data);
    }

    /**
     * Seems duplicated
     */
    // public function admin_filter_appointments($service_type, $tutor_name, $student_name,
    //         $start_date, $end_date, $booking_status){
    //     $this->db->select('
    //         ea_appointments.id                                     AS id,

    //         ea_service_categories.name                             AS service_type,

    //         CONCAT(ea_users.first_name, \' \', ea_users.last_name) AS tutor_name,
    //         CONCAT(stu_tab.first_name, \' \', stu_tab.last_name)   AS student_name,
            
    //         ea_appointments.book_datetime                          AS book_datetime,
    //         ea_appointments.booking_status                         AS booking_status,
    //         ea_appointments.feedback                               AS feedback_from_tutor,
    //         ea_appointments.suggestion                             AS suggestion_from_tutor,
    //         ea_appointments.comment_or_suggestion                  AS comment_or_suggestion_from_student,
    //         ea_appointments.stars                                  AS stars,

    //         ea_services.start_datetime                             AS start_datetime,
    //         ea_services.end_datetime                               AS end_datetime
    //     ')
    //     ->from('ea_appointments')
    //     ->join('ea_services', 'ea_services.id = ea_appointments.id_services', 'inner')
    //     ->join('ea_users', 'ea_users.id = ea_services.id_users_provider', 'inner')
    //     ->join('ea_users AS stu_tab', 'stu_tab.id = ea_appointments.id_users_customer', 'inner')
    //     ->join('ea_service_categories', 'ea_service_categories.id = ea_services.id_service_categories', 'inner');
        
        

    //     if( $service_type != 'ALL'){
    //         $this->db->where('ea_service_categories.name', $service_type);
    //     }
    //     if( $tutor_name != 'ALL'){
    //         $this->db->where('CONCAT(ea_users.first_name, \' \', ea_users.last_name) = ', $tutor_name);
    //     }
    //     if( $student_name != 'ALL'){
    //         $this->db->where('CONCAT(stu_tab.first_name, \' \', stu_tab.last_name) = ', $student_name);
    //     }
    //     if( $start_date != 'ALL'){
    //         $this->db->where('ea_services.start_datetime >', $start_date . ' 00:00');
    //     }
    //     if( $end_date != 'ALL'){
    //         $this->db->where('ea_services.start_datetime <', $end_date . ' 23:59');
    //     }
    //     if( $booking_status != 'ALL'){
    //         $this->db->where('ea_appointments.booking_status', $booking_status);
    //     }

    //     return $this->db
    //         ->order_by('ea_services.start_datetime')->get()->result_array();
    // }

    public function save_settings($upload_file_max_size, 
            $max_services_checking_ahead_day, $max_appointment_cancel_ahead_day){
        
        $this->db->where('name', 'upload_file_max_size(KB)');
        $bool1 = $this->db->update('ea_settings', ['value' => $upload_file_max_size]);
        $this->db->where('name', 'max_services_checking_ahead_day');
        $bool2 = $this->db->update('ea_settings', ['value' => $max_services_checking_ahead_day]);
        $this->db->where('name', 'max_appointment_cancel_ahead_day');
        $bool3 = $this->db->update('ea_settings', ['value' => $max_appointment_cancel_ahead_day]);
    
        return $bool1 && $bool2 && $bool3;        

    }

    /**
     * Students will receive email from this function only if the appointments are related to
     * these deleted services.
     * 
     * Tutors will receive email from this function only if their services are deleted.
     * 
     * @param $email the email address
     * 
     * @return bool success or not
     */
    public function send_email_service_deletion_inform($email){
        // TODO
    }    
}
?>