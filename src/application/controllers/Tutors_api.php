<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Tutors_api extends CI_Controller{

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

    public function ajax_filter_appointments(){
        //
        try{
            
            $this->load->model('tutors_model');
            
            // Get input
            $service_type = json_decode($this->input->post('service_type'), TRUE);
            $student_name = json_decode($this->input->post('student_name'), TRUE);
            $service_status = json_decode($this->input->post('service_status'), TRUE);
            $start_date = json_decode($this->input->post('start_date'), TRUE);
            $end_date = json_decode($this->input->post('end_date'), TRUE);

            $user_id = $this->session->userdata('user_id');

            // Query
            $result = $this->tutors_model
                ->filter_appointments($user_id, $service_type, $student_name, $service_status, $start_date, $end_date);
    
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
	
	public function ajax_modify_status(){
	    //
	    try{
	        
	        $this->load->model('tutors_model');
	        
	        // Get input
	        $service_status = json_decode($this->input->post('service_status'), TRUE);
	        $appointment_id = json_decode($this->input->post('appointment_id'), TRUE);
	
	        $user_id = $this->session->userdata('user_id');
	
	        // Query
	        $bool = $this->tutors_model->modify_status($appointment_id, $service_status);
	        $result = $bool ? AJAX_SUCCESS : 'Fail';
	
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
	
	public function ajax_save_settings(){	
     //
     try{
        
        $this->load->model('tutors_model');
        
        // Get input
        $given_name = json_decode($this->input->post('given_name'), TRUE);
        $surname = json_decode($this->input->post('surname'), TRUE);
        $introduction = json_decode($this->input->post('introduction'), TRUE);
        $personal_page = json_decode($this->input->post('personal_page'), TRUE);

        $user_id = $this->session->userdata('user_id');
        $language = $this->session->userdata('language');

        // Query
        $result = $this->tutors_model->save_settings($user_id, $given_name, $surname, $introduction, $personal_page, $language);
        $result = $result ? AJAX_SUCCESS : 'Fail';
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
	
	public function ajax_save_feedback_and_suggestion(){
	    //
	    try{
	        
	        $this->load->model('tutors_model');
	        
	        // Get input
	        $feedback = json_decode($this->input->post('feedback'), TRUE);
	        $suggestion = json_decode($this->input->post('suggestion'), TRUE);
	        $appointment_id = json_decode($this->input->post('appointment_id'), TRUE); 
	
	        // Query
	        $result = $this->tutors_model->save_feedback_and_suggestion($appointment_id, $feedback, $suggestion);
	        $result = $result ? AJAX_SUCCESS : 'Fail';
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
    
    public function ajax_get_settings(){
        //
	    try{
	        
	        $this->load->model('tutors_model');
	        
	        // Get input
            
            //// From front end

                /* NULL */

            //// From session
            $user_id = $this->session->userdata('user_id');
            $language = $this->session->userdata('language');
	
	        // Query
	        $result = $this->tutors_model->get_settings($user_id, $language);

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