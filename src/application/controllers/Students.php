
<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Students extends CI_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->library('session');

        // Set user's selected language.
        if ($this->session->userdata('language')){
            $this->config->set_item('language', $this->session->userdata('language'));
            $this->lang->load('translations', $this->session->userdata('language'));
        }
        else{
            $this->lang->load('translations', $this->config->item('language')); // default
        }
    }

    public function index(){

        $this->load->model('appointments_model');
        // $this->load->model('providers_model');
        // $this->load->model('services_model');
        // $this->load->model('customers_model');
        $this->load->model('settings_model');
        $this->load->model('roles_model');
        $this->load->model('user_model');

        $view['base_url'] = $this->config->item('base_url');
        $view['user_display_name'] = $this->user_model->get_user_display_name($this->session->userdata('user_id'));
        $view['active_menu'] = PRIV_APPOINTMENTS;
        $view['book_advance_timeout'] = $this->settings_model->get_setting('book_advance_timeout');
        $view['date_format'] = $this->settings_model->get_setting('date_format');
        $view['time_format'] = $this->settings_model->get_setting('time_format');
        $view['company_name'] = $this->settings_model->get_setting('company_name');
        // $view['available_providers'] = $this->providers_model->get_available_providers();
        // $view['available_services'] = $this->services_model->get_available_services();
        // $view['customers'] = $this->customers_model->get_batch();

        $user_id_test = '1'; //TODO for testing

        $user = $this->user_model->get_settings($this->session->userdata($user_id_test));
        // $view['calendar_view'] = $user['settings']['calendar_view'];

        $this->set_user_data($view);

        $view['active_menu'] = PRIV_MY_APPOINTMENTS;

        $this->load->view('students/students_home_header', $view);
        $this->load->view('students/students_home', $view);
        $this->load->view('students/students_home_footer', $view);
    }

    /**
     * Set the user data in order to be available at the view and js code.
     *
     * @param array $view Contains the view data.
     */
    protected function set_user_data(&$view)
    {
        $this->load->model('roles_model');

        // Get privileges
        $view['user_id'] = $this->session->userdata('user_id');
        $view['user_email'] = $this->session->userdata('user_email');
        $view['role_slug'] = $this->session->userdata('role_slug');
        $view['privileges'] = $this->roles_model->get_privileges($this->session->userdata('role_slug'));
    }

}

?>