<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_api extends CI_Controller{

    public function __construct(){
        parent::__construct();

        // Block any other access method than POST
        if(strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST'){

            $this->security->csrf_show_error();

        }

        $this->load->library('session');
        $this->load->model('roles_model');

        //Set the language of the page by session or default
        if ($this->session->userdata('language')){
            $this->config->set_item('language', $this->session->userdata('language'));
            $this->lang->load('translations', $this->session->userdata('language'));
        }else{
            $this->lang->load('translations', $this->config->item('language'));
        }
    }

/** Ajax interface for Tutor */

    public function ajax_filter_tutors(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $tutor_id = json_decode($this->input->post('tutor_id'), TRUE);

            // Query
            $result = $this->admin_model->filter_tutors($tutor_id);
            
            // Log

                // TODO

            
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($result), TRUE);
            

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

    public function ajax_new_tutor(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $sid = json_decode($this->input->post('sid'), TRUE);

            // Query
            $result = $this->admin_model->new_sid_tutor($sid);
            
            // Log

                // TODO

            if($result == TRUE){
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('success'), TRUE);
            }else{
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('fail'), TRUE);
            }

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }

    }

    public function ajax_edit_tutor(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $tutor_id = json_decode($this->input->post('tutor_id'), TRUE);
            $first_name = json_decode($this->input->post('first_name'), TRUE);
            $last_name = json_decode($this->input->post('last_name'), TRUE);
            $personal_page = json_decode($this->input->post('personal_page'), TRUE);
            $introduction = json_decode($this->input->post('introduction'), TRUE);
            $address = json_decode($this->input->post('address'), TRUE);
            $flexible_column = json_decode($this->input->post('flexible_column'), TRUE);
            $email = json_decode($this->input->post('email'), TRUE);
            $phone_number = json_decode($this->input->post('phone_number'), TRUE);

            // Query
            $result = $this->admin_model->edit_tutor($tutor_id, $first_name, $last_name, $personal_page, 
                                        $introduction, $phone_number, $email, $address, $flexible_column);
            
            // Log

                // TODO

            if($result == TRUE){
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('success'), TRUE);
            }else{
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('fail'), TRUE);
            }

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

/** Ajax interface for services_configuration */

    public function ajax_filter_services(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $tutor_id = json_decode($this->input->post('tutor_id'), TRUE);
            $semester = json_decode($this->input->post('semester'), TRUE); //Sample = 2019-Fall, See also config/semesters.php
            $week = json_decode($this->input->post('week'), TRUE);
            
            // Query
            $result = $this->admin_model->filter_services($tutor_id, $semester, $week);
            
            // Log

                // TODO

            // Possible output 
            // 1 : 'tutor_name absence.'
            // 2 : 'week absence or overflow'
            // 3 : normal 2-dim array
            
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($result), TRUE);
           

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

    public function ajax_new_service(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $date = json_decode($this->input->post('date'), TRUE); // String sample: 2019-8-01
            $start_time = json_decode($this->input->post('start_time'), TRUE); // String sample: 23:00
            $end_time = json_decode($this->input->post('end_time'), TRUE);
            $service_type_id = json_decode($this->input->post('service_type_id '), TRUE);
            $address = json_decode($this->input->post('address'), TRUE);
            $capacity = json_decode($this->input->post('capacity'), TRUE);
            $service_description = json_decode($this->input->post('service_description'), TRUE);
            $tutor_id = json_decode($this->input->post('tutor_id'), TRUE);

            // Query
            $result = $this->admin_model->new_service($date, $start_time, $end_time, $service_type_id, $tutor_id,
                    $address, $capacity, $service_description);
            
            // Log

                // TODO

            
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($result), TRUE);
                // Return service id or -1 (if failed to isnert new service)
            

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

    public function ajax_edit_service(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $service_id = json_decode($this->input->post('service_id'), TRUE);
            $date = json_decode($this->input->post('date'), TRUE); // String sample: 2019-8-01
            $start_time = json_decode($this->input->post('start_time'), TRUE); // String sample: 23:00
            $end_time = json_decode($this->input->post('end_time'), TRUE);
            $service_type_id = json_decode($this->input->post('service_type_id'), TRUE);
            $address = json_decode($this->input->post('address'), TRUE);
            $capacity = json_decode($this->input->post('capacity'), TRUE);
            $service_description = json_decode($this->input->post('service_description'), TRUE);
            $tutor_id = json_decode($this->input->post('tutor_id'), TRUE);

            // Query
            $result = $this->admin_model->edit_service($service_id, $date, $start_time, $end_time, $service_type_id, 
                $address, $capacity, $tutor_id, $service_description);
            
            // Log

                // TODO

            if($result == TRUE){
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('success'), TRUE);
            }else{
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('fail'), TRUE);
            }

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

    public function ajax_remove_service(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $service_id = json_decode($this->input->post('service_id'), TRUE);

            // Query
            $result = $this->admin_model->remove_service($service_id);

            if($result == TRUE){
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('success'), TRUE);
            }else{
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('fail'), TRUE);
            }

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

    public function ajax_schedule_current_schema_to_all_weeks(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            //an array contains all the ids of all the services in this week.
            $services_id = json_decode($this->input->post('services_id'), TRUE);
            $tutor_name = json_decode($this->input->post('tutor_name'), TRUE);
            $week = json_decode($this->input->post('week'), TRUE);
            $semester = json_decode($this->input->post('semester'), TRUE); //Sample = 2019-Fall, See also config/semesters.php

            // Query
            $result = $this->admin_model->schedule_current_schema_to_all_weeks($tutor_name, $semester, $services_id, $week);
            
            // Log

                // TODO

            if($result[0] && $result[1] && $result[2] == TRUE){
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('success'), TRUE);
            }else{
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('fail'), TRUE);
            }

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

/** Ajax interface for service_types_configuration */

    /**
     * @return array array(array(array(), array())) The sample of the structure of the array is as follows:
     * $result = 
     *           0 => info => [ id => ?
     *                          name => ?
     *                          description => ?]
     *                tutors -> [ 0 => Mike Goodman
     *                            1 => Peter Diaobao ]
     * 
     *           1 => info => [ id => ?
     *                          name => ?
     *                          description => ?]
     *                tutors -> [ 0 => Mike Goodman
     *                            1 => Peter Diaobao ]           
     * 
     * Sample of tranversing the array (see also Controller/Test.php)
     * 
     * foreach($result AS $serv_type){
     *       echo 'service type information: <br />';
     *       foreach($serv_type['info'] AS $key => $val){
     *           echo "&nbsp;&nbsp;&nbsp;&nbsp;" . $key . ' ' . $val . '<br />';
     *       }
     *       echo 'tutor involved in: <br />';
     *       foreach($serv_type['tutors'] AS $key => $val){
     *           echo "&nbsp;&nbsp;&nbsp;&nbsp;" . $key . ' ' . $val . '<br />';
     *       }
     *       echo '<br />';
     *   }
     */
    public function ajax_filter_service_types(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $service_type_id = json_decode($this->input->post('service_type_id'), TRUE);
            
            // Query
            $result = $this->admin_model->filter_service_types($service_type_id);
            
            // Log

                // TODO

            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($result), TRUE);
           

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

    public function ajax_new_service_type(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $name = json_decode($this->input->post('name'), TRUE);
            $description = json_decode($this->input->post('description'), TRUE);

            // Query
            $result = $this->admin_model->new_service_type($name, $description);
            // Log

                // TODO

            if($result == TRUE){
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('success'), TRUE);
            }else{
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('fail'), TRUE);
            }

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }    
    }
    public function ajax_edit_service_type(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $service_type_id = json_decode($this->input->post('service_type_id'), TRUE);
            $name = json_decode($this->input->post('name'), TRUE);
            $description = json_decode($this->input->post('description'), TRUE);

            // Query
            $result = $this->admin_model->edit_service_type($service_type_id, $name, $description);
            // Log

                // TODO

            if($result == TRUE){
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('success'), TRUE);
            }else{
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode('fail'), TRUE);
            }

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }  
    }

/** Ajax interface for appointments_mangement */

    public function ajax_filter_appointments(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $service_type = json_decode($this->input->post('service_type'), TRUE);
            $tutor_name = json_decode($this->input->post('tutor_name'), TRUE);
            $student_name = json_decode($this->input->post('student_name'), TRUE);
            $start_date = json_decode($this->input->post('start_date'), TRUE);
            $end_date = json_decode($this->input->post('end_date'), TRUE);
            $booking_status = json_decode($this->input->post('booking_status'), TRUE);
            $appointment_id = json_decode($this->input->post('appointment_id'), TRUE); 

            // Query
            $result = $this->admin_model
                ->filter_appointments_management($service_type, $tutor_name, $student_name,
                                        $start_date, $end_date, $booking_status, $appointment_id);
            // Log

                // TODO

            
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($result), TRUE);
            
            

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }  
    }

/** Ajax interface for setting */

    public function ajax_save_settings(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $upload_file_max_size = json_decode($this->input->post('upload_file_max_size'), TRUE);
            $max_services_checking_ahead_day = json_decode($this->input->post('max_services_checking_ahead_day'), TRUE);
            $max_appointment_cancel_ahead_day= json_decode($this->input->post('max_appointment_cancel_ahead_day'), TRUE);

            $school_name = json_decode($this->input->post('school_name'), TRUE);
            $school_email = json_decode($this->input->post('school_email'), TRUE);
            $date_format = json_decode($this->input->post('date_format'), TRUE);
            $time_format = json_decode($this->input->post('time_format'), TRUE);
            $school_link = json_decode($this->input->post('school_link'), TRUE);
            $flexible_column_label = json_decode($this->input->post('flexible_column_label'), TRUE);

            // Query
            $result = $this->admin_model->save_settings($school_name, $school_email, $school_link, $date_format, $time_format, 
                    $upload_file_max_size, $max_services_checking_ahead_day, $max_appointment_cancel_ahead_day, $flexible_column_label);
            // Log

                // TODO

            
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($result), TRUE);
            
            

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }  
    }
}
?>