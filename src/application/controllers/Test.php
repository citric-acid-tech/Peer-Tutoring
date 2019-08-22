
<?php

class Test extends CI_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->library('session');
        $this->load->helper(array('form', 'url'));
    }
    /**
     * This controller is written for testing models. Now you can call test_<model method name> to test
     * all the methods in models, or create your own test method. Access index.php/test to call this controller.
     * 
     * Also you can create accounts here, modify the arguments in test_create_account and then call it directly.
     */
    public function index($year = 2019, $month = 8){

        /*** Use $this-> to call your test method here. */
        $this->test_get_settings();
        /*** *****************************************  */

        // $prefs = array(
        //     'show_next_prev' => TRUE,
        //     'next_prev_url' => ''
        // );
        // $prefs['template'] = array(
        //     'table_open'           => '<table class="calendar">',
        //     'cal_cell_start'       => '<td class="day">',
        //     'cal_cell_start_today' => '<td class="today">'
        // );
        // $this->load->library('calendar',$prefs);
        // echo $this->calendar->generate($year, $month);
        // $this->test_admin_save_settings();
    }

    public function test_get_settings(){
        $this->load->model('tutors_model');
        echo '<br /> Chinese <br />';
        $result = $this->tutors_model->get_settings(1, '简体中文');
        $this->output_result_array($result);
        echo '<br />';

        echo '<br /> English <br />';
        $result = $this->tutors_model->get_settings(1, 'english');
        $this->output_result_array($result);
    }
    

    public function test_create_account(){
        $this->load->model('register_model');
        $first_name = 'Doinb';
        $last_name = 'Gong';
        $email = 'testtest@163.com';
        $username = 'xxx';
        $password = 'xxx1234';
        $id_roles = '3'; // 1 - admin, 2 - tutor and student, 3 - student only
        $result =  $this->register_model->create_account($first_name, $last_name, $email, $username, $password, $id_roles);
        if($result == TRUE){
            echo 'successed';
        }else{
            echo 'failed';
        }
    }

    public function test_get_all_students(){
        $this->load->model('general_model');
        $this->output_result_array($this->general_model->get_all_tutors());
    }

    public function test_admin_save_settings(){
        $this->load->model('admin_model');
        echo $this->admin_model->save_settings(4096, 7, 1);
    }

    public function test_admin_filter_appointments(){
        $this->load->model('admin_model');
        $service_type = 'ALL';
        $tutor_name = 'ALL';
        $student_name = 'ALL';
        $start_date = 'ALL';
        $end_date = 'ALL';
        $booking_status = 'ALL';

        $result =  $this->admin_model->admin_filter_appointments($service_type, $tutor_name, $student_name,
            $start_date, $end_date, $booking_status);
        
        $this->output_result_array($result);
    }

    public function test_edit_service_type(){
        $this->load->model('admin_model');
        $service_type_id = 20;
        $name = 'Fly a Jet Fighter!!';
        $description = 'Jet Fighter is an national defense machine. Everyone should know how to control it.';

        echo $this->admin_model->edit_service_type($service_type_id, $name, $description);
    }

    public function test_filter_service_types(){
        $this->load->model('admin_model');
        $service_type = 'ALL';
        $result = $this->admin_model->filter_service_types($service_type);
        
        foreach($result AS $serv_type){
            echo 'service type information: <br />';
            foreach($serv_type['info'] AS $key => $val){
                echo "&nbsp;&nbsp;&nbsp;&nbsp;" . $key . ' ' . $val . '<br />';
            }
            echo 'tutor involved in: <br />';
            foreach($serv_type['tutors'] AS $key => $val){
                echo "&nbsp;&nbsp;&nbsp;&nbsp;" . $key . ' ' . $val . '<br />';
            }
            echo '<br />';
        }

        
    }

    public function test_schedule_current_schema_to_all_weeks(){
        $tutor_name = 'Mike Kazura';
        $semester = '2019-Fall';
        $services_id = array(10001);
        $week = 5;
        $this->load->model('admin_model');
        $this->admin_model->schedule_current_schema_to_all_weeks($tutor_name, $semester, $services_id, $week);
    }

    public function test_edit_service(){
        $this->load->model('admin_model');
        $date = '2019-8-19';
        $start_time = '08:00';
        $end_time = '09:30';
        $service_type = 'NB Calculus';
        $address = 'HUIYUAN';
        $capacity = '12';
        $service_description = 'test desc';
        $service_id = 4739;
        $result = $this->admin_model->edit_service($service_id, $date, $start_time, $end_time, $service_type,
            $address, $capacity, $service_description);

        echo $result;
    }

    public function test_new_service(){
        $this->load->model('admin_model');
        $date = '2019-8-19';
        $start_time = '08:00';
        $end_time = '09:30';
        $service_type = 'NB Calculus';
        $tutor_name = 'Mike Kazura';
        $address = 'XINYUAN';
        $capacity = '8';
        $service_description = 'test desc';
        $result = $this->admin_model->new_service($date, $start_time, $end_time, $service_type, $tutor_name,
            $address, $capacity, $service_description);

        echo $result;
    }

    public function test_filter_services(){
        $this->load->model('admin_model');
        $tutor_name = 'Mike Kazura';
        $semester = '2019-Fall';
        $week = 1;
        $result = $this->admin_model->filter_services($tutor_name, $semester, $week);
        echo $this->output_result_array($result);
    }

    public function test_edit_tutor(){
        $this->load->model('admin_model');
        // $tutor_id, $first_name, $last_name, $personal_page, 
        // $introduction, $phone_number, $eamil, $address, $flexible_column
        $result = $this->admin_model->edit_tutor(1, 'Mike', 'Kazura', 'https://github.com/mikechesterwang', 'This guy fucks', '18088805142', 
                                        '11710403@mail.sustech.edu.cn', 'Joy High Land B1 R301', 'dong ci da ci da dong da ci da ci');
        echo $result;
    }

    public function test_filter_tutors(){
        $this->load->model('admin_model');
        $tutor_name = 'John Doe';
        $result = $this->admin_model->filter_tutors($tutor_name);
        echo $this->output_result_array($result);
    }

    public function test_save_feedback_and_suggestion(){
        $this->load->model('tutors_model');
        $appointment_id = 1;
        $feedback = 'This guy fucks';
        $suggestion = 'Keep fucking';
        $result = $this->tutors_model->save_feedback_and_suggestion($appointment_id, $feedback, $suggestion);
        echo $result;
    }

    public function test_save_settings(){
        $this->load->model('tutors_model');
        $user_id = 1;
        $given_name = 'Mike';
        $surname = 'Smith';
        $introduction = 'This man fucks';
        $personal_page = 'https://www.weibo.com/u/5836057716';
        $language = 'English';
        $result = $this->tutors_model->save_settings($user_id, $given_name, $surname, $introduction, $personal_page, $language);
        echo $result;
    }

    public function test_modify_status(){
        $this->load->model('tutors_model');
        $result = $this->tutors_model->modify_status(1, 2);
        echo $result;
    }

    public function test_filter_appointments(){
        $this->load->model('tutors_model');

        $user_id = 1;
        $service_type = 'ALL';
        $tutor_name = 'ALL';
        $student_name = 'ALL';
        $start_date = 'ALL';
        $end_date = 'ALL';
        $service_status = 'ALL';

        $result = $this->tutors_model->filter_appointments($user_id, $service_type, $tutor_name, 
                $student_name, $service_status, $start_date, $end_date);
        echo $this->output_result_array($result);
    }

    public function test_filter_appointments_management(){
        $this->load->model('admin_model');
        $service_type = 'ALL';
        $tutor_name = 'ALL';
        $student_name = 'ALL';
        $start_date = 'ALL';
        $end_date = 'ALL';
        $service_status = 'ALL';
        $result = $this->admin_model->filter_appointments_management($service_type, $tutor_name, $student_name, $service_status, $start_date, $end_date);
        echo 'amount: ' . sizeof($result) . ' <br />';
        echo $this->output_result_array($result);
    }

    public function test_rate_and_comment(){
        $this->load->model('students_model');
        $this->students_model->rate_and_comment(7, 5, 'NB');
        
    }

    public function test_get_all_service_types(){
        $this->load->model('general_model');
        $result = $this->general_model->get_all_service_types();
        echo $this->output_result_array($result);
    }

    public function test_get_all_tutors(){
        $this->load->model('general_model');
        $result = $this->general_model->get_all_tutors();
        echo $this->output_result_array($result);
    }

    public function test_new_service_type(){
        $this->load->model('admin_model');
        $result = $this->admin_model->new_service_type('Fun with Java', 'xxx');
        echo $result;
    }

    public function test_new_service_x(){
        $date_array = json_decode('
            {
                "2019-10-01":{
                        "1":{
                            "date":"2019-10-01",
                            "start_time_h":"08",
                            "start_time_m":"00",
                            "end_time_h":"09",
                            "end_time_m":"30"
                        },
                        "2":{
                            "date":"2019-10-01",
                            "start_time_h":"21",
                            "start_time_m":"00",
                            "end_time_h":"22",
                            "end_time_m":"30"
                        }
                },
                "2019-10-11":{
                        "1":{
                            "date":"2019-10-11",
                            "start_time_h":"08",
                            "start_time_m":"00",
                            "end_time_h":"09",
                            "end_time_m":"30"
                        }
                }
            }
        ', TRUE);
        $this->load->model('admin_model');
        $result = $this->admin_model->new_service($date_array, 'Fail on IELTS', 'tutor Lang', 'Hui Yuan B3 R 201', 5, 'This class can help you to fail on your IELTS exam.');
        echo $result;
    }

    public function test_new_tutor(){
        $this->load->model('admin_model');
        // $first_name, $last_name, $personal_page, 
        // $introduction, $phone_number, $eamil, $address, $flexible_column
        $result = $this->admin_model->new_tutor('Mike', 'Kazura', 'https://github.com/mikechesterwang', 'This guy fucks', '18088805142', 
                                        '11710403@mail.sustech.edu.cn', 'Joy High Land B1 R301', 'dong ci da ci da dong da ci da ci');
        echo $result;
    }

    public function test_new_appointment(){
        $this->load->model('students_model');
        $result = $this->students_model->new_appointment(1, 1, 'DEFAULT', 'DEFAULT', 'Note', 'Favorite');
        echo $result;
    }

    public function test_get_available_tutors_date_selection(){
        $this->load->model('students_model');
        $result = $this->students_model->get_available_tutors_date_selection('2019-08-19 06:00', '2019-08-24 00:00');
        echo $this->output_result_array($result);
    }

    public function test_search_tutors_by_name(){
        $this->load->model('students_model');
        $result = $this->students_model->search_tutors_by_name('tutor');
        echo $this->output_result_array($result);
    }

    public function test_get_available_tutors(){
        $this->load->model('students_model');
        $result = $this->students_model->get_available_tutors('ALL', 'ALL');
        echo $this->output_result_array($result);
    }

    public function test_get_available_appointments(){
        $this->load->model('students_model');
        $result = $this->students_model->get_available_appointments('ALL', 'ALL');
        $this->output_result_array($result);
    }

    public function test_get_my_appointments(){
        $this->load->model('students_model');
        $result = $this->students_model->get_my_appointments(1, 'ALL', 'ALL', 'ALL');
        $this->output_result_array($result);
    }

    public function do_upload(){

        $config['upload_path'] = './upload';
        $config['allowed_types'] = DOCUMENT_FORMAT;
        $config['max_size'] = MAX_DOCUMENT_SIZE;

        $this->load->library('upload', $config);

        //'userfile' is a from element in the form of the views
        if( ! $this->upload->do_upload('userfile')){
            $error = array('error' => $this->upload->display_errors());
            $this->load->view('test/upload_form', $error);
        }else{
            $data = array('upload_data' => $this->upload->data());
            $this->load->view('test/upload_success', $data);
        }
    }

    protected function output_result_array($arr){
        if(!is_array($arr)){
            return $arr;
        }
        echo 'size: ' . sizeof($arr) . '<br /><br />';
        foreach($arr as $row){
            foreach($row as $key => $val){
                echo $key . ' ' . $val . '<br />';
            }
            echo '<br />';
        }

    }
}

?>