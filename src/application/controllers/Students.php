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

    /** my appointments page */
    public function index(){


        $this->session->set_userdata('dest_url', site_url('students'));

        if ( ! $this->_has_privileges(PRIV_MY_APPOINTMENTS))
        {
            return;
        }

        $this->load->model('appointments_model');
        $this->load->model('settings_model');
        $this->load->model('roles_model');
        $this->load->model('user_model');

        $view['base_url'] = $this->config->item('base_url');
        $view['user_display_name'] = $this->user_model->get_user_display_name($this->session->userdata('user_id'));

        $view['book_advance_timeout'] = $this->settings_model->get_setting('book_advance_timeout');
        $view['date_format'] = $this->settings_model->get_setting('date_format');
        $view['time_format'] = $this->settings_model->get_setting('time_format');
        $view['company_name'] = $this->settings_model->get_setting('company_name');
        
        $user = $this->user_model->get_settings($this->session->userdata('user_id'));

        $this->set_user_data($view);

        $view['active_menu'] = PRIV_MY_APPOINTMENTS;

        $this->load->view('students/students_home_header', $view);
        $this->load->view('students/students_home', $view);
        $this->load->view('students/students_home_footer', $view);
    }

    public function available_appointment(){

        $this->session->set_userdata('dest_url', site_url('students/available_appointment'));

        if ( ! $this->_has_privileges(PRIV_AVAILABLE_APPOINTMENTS))
        {
            return;
        }

        $this->load->model('appointments_model');
        $this->load->model('settings_model');
        $this->load->model('roles_model');
        $this->load->model('user_model');

        $view['base_url'] = $this->config->item('base_url');
        $view['user_display_name'] = $this->user_model->get_user_display_name($this->session->userdata('user_id'));

        $view['book_advance_timeout'] = $this->settings_model->get_setting('book_advance_timeout');
        $view['date_format'] = $this->settings_model->get_setting('date_format');
        $view['time_format'] = $this->settings_model->get_setting('time_format');
        $view['company_name'] = $this->settings_model->get_setting('company_name');
        $view['semester_json']  = $this->settings_model->get_setting('semester_json');

        $user = $this->user_model->get_settings($this->session->userdata('user_id'));


        $this->set_user_data($view);

        $view['active_menu'] = PRIV_AVAILABLE_APPOINTMENTS;

        $this->load->view('students/students_home_header', $view);
        $this->load->view('students/students_home_available_appointment', $view);
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

    protected function _has_privileges($page, $redirect = TRUE)
    {
        // Check if user is logged in.
        $user_id = $this->session->userdata('user_id');
        if ($user_id == FALSE)
        { // User not logged in, display the login view.
            if ($redirect)
            {
                header('Location: ' . site_url('user/login'));
            }
            return FALSE;
        }

        // Check if the user has the required privileges for viewing the selected page.
        $role_slug = $this->session->userdata('role_slug');
        $role_priv = $this->db->get_where('ea_roles', ['slug' => $role_slug])->row_array();
        if ($role_priv[$page] < PRIV_VIEW)
        { // User does not have the permission to view the page.
            if ($redirect)
            {
                header('Location: ' . site_url('user/no_privileges'));
            }
            return FALSE;
        }

        return TRUE;
    }
}

?>
