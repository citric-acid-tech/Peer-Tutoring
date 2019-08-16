<?php defined('BASEPATH') OR exit('No direct script access allowed');


class Students_api extends CI_Controller{

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

/** ajax interface for students - my appointments part */

    public function ajax_filter_my_appointments(){
        //

        try{

            $this->load->model('students_model');
            // Get input
            $booking_status = json_decode($this->input->post('booking_status'), TRUE);
            $service_type = json_decode($this->input->post('service_type'), TRUE);
            $tutor_name = json_decode($this->input->post('tutor_name'), TRUE);
            $user_id = $this->session->userdata('user_id');
            // Everyone can add an appointment, so we don't need priviledge verification here

            // Query
            $result = $this->students_model->get_my_appointments($user_id, $booking_status, $service_type, $tutor_name);
            
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($result), TRUE);

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]], TRUE));
        }
    }

    public function ajax_cancel_appointment(){
        //
        try{
            
            $this->load->model('students_model');

            // Get input
            $appointment_id = json_decode($this->input->post('appointment_id'), TRUE);
            
            // Query
            $isCanceled = $this->students_model->cancel_appointment($appointment_id);

            $ajax_result = $isCanceled ? 'cancellation_accepted' : 'cancellation_refused';

            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode([
                    'cancellation_result' => $ajax_result,
                ]));

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

    public function ajax_rate_and_comment(){
        //
        try{

            $this->load->model('students_model');

            // Get input
            $appointment_id = json_decode($this->input->post('appointment_id'), TRUE);
            $stars = json_decode($this->input->post('stars'), TRUE);
            $comment_or_suggestion = json_decode($this->input->post($this->input->post('comment_or_suggestion')), TRUE);

            // Query
            $this->students_model->rate_and_comment($stars, $comment_or_suggestion);

            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(AJAX_SUCCESS));

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

/** END OF ajax interface for students - my appointments part */

/** ajax interface for students - available appointments part */


    public function ajax_available_appointments(){
        //
        try{

            $this->load->model('students_model');
            
            // Get input
            $service_type = json_decode($this->input->post('service_type'), TRUE);
            $tutor_name = json_decode($this->input->post('tutor_name'), TRUE);

            // Query
            $result = $this->students_model->get_available_appointments($service_type, $tutor_name);

            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($result));

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }
    
    public function ajax_get_available_tutors(){
        //
        try{

            $this->load->model('students_model');

            // Get input
            $service_type = json_decode($this->input->post('service_type'), TRUE);
            $tutor_name = json_decode($this->input->post('tutor_name'), TRUE);

            // Query
            $result = $this->students_model->get_available_tutors($service_type, $tutor_name);

            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($result));

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }


?>
