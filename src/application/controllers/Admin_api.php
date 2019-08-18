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
        
    }

    public function ajax_new_tutor(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $first_name = json_decode($this->input->post('first_name'), TRUE);
            $last_name = json_decode($this->input->post('last_name'), TRUE);
            $personal_page = json_decode($this->input->post('personal_page'), TRUE);
            $introduction = json_decode($this->input->post('introduction'), TRUE);
            $address = json_decode($this->input->post('address'), TRUE);
            $flexible_column = json_decode($this->input->post('flexible_column'), TRUE);
            $eamil = json_decode($this->input->post('eamil'), TRUE);
            $phone_number = json_decode($this->input->post('phone_number'), TRUE);

            // Query
            $result = $this->admin_model->new_tutor($first_name, $last_name, $personal_page, 
                                        $introduction, $phone_number, $eamil, $address, $flexible_column);
            
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

    }

/** Ajax interface for services_configuration */

    public function ajax_filter_services(){
        
    }

    public function ajax_new_service(){
        //
        try{
            
            $this->load->model('admin_model');
            
            // Get input
            $semester = json_decode($this->input->post('semester'), TRUE);
            $time = json_decode($this->input->post('time'), TRUE);
            $special_date = json_decode($this->input->post('special_date'), TRUE);
            $service_type = json_decode($this->input->post('service_type'), TRUE);
            $tutor_name = json_decode($this->input->post('tutor_name'), TRUE);
            $address = json_decode($this->input->post('address'), TRUE);
            $capacity = json_decode($this->input->post('capacity'), TRUE);
            $service_description = json_decode($this->input->post('service_description'), TRUE);

            // Query
            $result = $this->admin_model->new_service_batch();
            
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

    public function ajax_edit_service(){
        
    }

    public function ajax_get_calendar(){
        
    }

/** Ajax interface for service_types_configuration */

    public function ajax_filter_service_types(){
            
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
            
    }

/** Ajax interface for appointments_mangement */

    public function ajax_filter_appointments(){

    }

/** Ajax interface for setting */

    public function ajax_setting(){

    }
}
?>