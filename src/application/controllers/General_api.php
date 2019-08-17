<?php defined('BASEPATH') OR exit('No direct script access allowed');

class General_api extends CI_Controller{

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

    public function ajax_get_all_tutor(){
        //
        try{
            
            $this->load->model('general_model');
            
            // Get input

            // Query
            $result = $this->general_model->get_all_tutors();
    
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

    public function ajax_get_all_service_types(){
        //
        try{
            
            $this->load->model('general_model');
            
            // Get input

            // Query
            $result = $this->general_model->get_all_service_types();
            
            // Log

                // TODO

            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($result));

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }
}
?>