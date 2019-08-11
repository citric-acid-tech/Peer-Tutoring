
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
        

        // Don't know what this about yet

        
        // if ( ! $this->_has_privileges(PRIV_APPOINTMENTS))
        // {
        //     return;
        // }

        $this->load->model('settings_model');

        $view['base_url'] = $this->config->item('base_url');
        
        // This is for the title, for more details, please see the view file (home.php)
        $view['company_name'] = $this->settings_model->get_setting('company_name');

        $this->load->view('students/students_home', $view);
        

    }

}

?>