<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Students extends CI_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->library('session');
        $this->load->model('admin_model');

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

        $this->available_appointment();
        
    }

    public function my_appointment(){
        $this->session->set_userdata('dest_url', site_url('students'));

        if ( ! $this->_has_privileges(PRIV_MY_APPOINTMENTS)){
            return;
        }

        $this->load->model('roles_model');
        $this->load->model('user_model');
        $this->load->model('general_model');

        $view['base_url'] = $this->config->item('base_url');
        $view['user_display_name'] = $this->user_model->get_user_display_name($this->session->userdata('user_id'));

        $settings = array('book_advance_timeout', 'date_format', 'time_format', 'company_name');
        $view = array_merge($view, $this->general_model->get_settings_batch($settings));
        
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

        $this->load->model('general_model');
        $this->load->model('roles_model');
        $this->load->model('user_model');

        $view['base_url'] = $this->config->item('base_url');
        $view['user_display_name'] = $this->user_model->get_user_display_name($this->session->userdata('user_id'));

        
        $settings = array('max_services_checking_ahead_day', 'book_advance_timeout', 'date_format', 'time_format', 'company_name', 'semester_json');
        $view = array_merge($view, $this->general_model->get_settings_batch($settings));

        $user = $this->user_model->get_settings($this->session->userdata('user_id'));

        $this->set_user_data($view);

        $view['active_menu'] = PRIV_AVAILABLE_APPOINTMENTS;

        // Set user's selected language.
        if ($this->session->userdata('language')){
            $view['language'] = $this->session->userdata('language');
        }else{
            $view['language'] = $this->config->item('language');
        }

        $this->load->database();

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
        $view['user_sid'] = $this->session->userdata('user_sid');
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

        // Check if the user is in blacklist
        if ($this->admin_model->in_blacklist($this->session->userdata('user_sid')) == 'true'){
            if ($redirect)
            {
                header('Location: ' . site_url('user/no_privileges'));
            }
            return FALSE;
        }

        // Check if the user has the required privileges for viewing the selected page.
        // $role_slug = $this->session->userdata('role_slug');
        
        // DOUBLE CHECK in case of fake identification
        $role_slug = $this->db
            ->select('ea_roles.slug AS role_slug')
            ->from('ea_users')
            ->join('ea_roles', 'ea_roles.id = ea_users.id_roles', 'inner')
            ->where('ea_users.cas_sid', $this->session->userdata('user_sid'))
            ->get()->row_array()['role_slug'];

        if($role_slug == FALSE){
            if ($redirect)
            {
                header('Location: ' . site_url('user/login'));
            }
            return FALSE;
        }
        // End of DOUBLE CHECK

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
