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
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
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

            // Log
            

            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode([
                    'cancellation_result' => $ajax_result
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
            $comment_or_suggestion = json_decode($this->input->post('comment_or_suggestion'), TRUE);

            // Query
            $this->students_model->rate_and_comment($appointment_id, $stars, $comment_or_suggestion);

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
            $tutor_id = json_decode($this->input->post('tutor_id'), TRUE);

            // Query
            $result = $this->students_model->get_available_appointments($tutor_id);

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

    public function ajax_search_tutors_by_name(){
        //
        try{

            $this->load->model('students_model');

            // Get input
            $key = json_decode($this->input->post('key'), TRUE);

            // Query
            $result = $this->students_model->search_tutors_by_name($key);

            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($result));


        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

    public function ajax_get_available_tutors_date_selection(){
        //
        try{
            $this->load->model('students_model');

            // Get input
            $date = json_decode($this->input->post('date'), TRUE);

            // Query
            $result = $this->students_model->get_available_tutors_date_selection($date);

            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($result));

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

    // If the start_datetime or end_datetime are 'DEFAULT', 
    // then the insert values of them are the corresponding values of the service
    public function ajax_new_appointment(){
        //
        try{
            $this->load->model('students_model');

            // Get input
            $service_id = json_decode($this->input->post('service_id'), TRUE);
            $note = json_decode($this->input->post('note'), TRUE);
            $remark = json_decode($this->input->post('remark'), TRUE);
            $file = $_FILES['file'];
            

            $user_id = $this->session->user_data('user_id');
            
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($file['name']));

            // Upload File? TODO
            
            // Query
            // if ($this->students_model->new_appointment($user_id, $service_id, $note, $remark, $file) !== FALSE){
            //     $this->output
            //     ->set_content_type('application/json')
            //     ->set_output(json_encode('success'));
            // }else{
            //     $this->output
            //     ->set_content_type('application/json')
            //     ->set_output(json_encode('fail'));
            // }

        }catch (Exception $exc){
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }

    public function do_upload(){

        //
        try{
            $this->load->model('students_model');

            // Get input
//            $service_id = json_decode($this->input->post('service_id'), TRUE);
            $user_id = $this->session->user_data('user_id');
            
            $result = $this->students_model->upload_file($user_id, 0);
            // result : array
            //     result : FALSE         OR  TRUE
            //     msg    : error message OR  attachment_url
            
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
