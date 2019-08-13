<?php


class Stundets_api extends CI_Controller{

    public function __construct(){
        parent::__construct();

        //
        if(strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST'){

            $this->security->csrf_show_error();

        }

        $this->load->library('session');
        $this->load->model('roles_model');

        //Set the language of the page by session or default
        if($this->session->userdata('language')){
            $this->config->set_item('language', $this->session->userdata('language'));
            $this->lang->load('translation', $this->session->userdata('language'));
        }else{
            $this->lang->laod('translation', $this->config->item('language'));
        }
    }


    public function ajax_filter_my_appointments(){
        //
        try{
            
            $this->load->model('students_model');
            $booking_status = json_decode($this->input->post('booking_status'), TRUE);
            $service_type = json_decode($this->input->post('service_type'), TRUE);
            $tutor_name = json_decode($this->input->post('tutor_name'), TRUE);

            //Everyone can add an appointment, so we don't need priviledge verification here

            $user_id = $this->session->userdata('user_id');
            $result = $this->students_model->get_my_appointments($user_id, $booking_status, $service_type, $tutor_name);

            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($result));

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

    public function ajax_filter_available_appointments(){
        /*  ajax*/
        
    }
    

    public function ajax_cancel_appointment(){
        //
        try{
            
            $this->load->model('students_model');
            $appointment_id = json_decode($this->input->post('appointment_id'), TRUE);
            
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
}


?>
