<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller{

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
        $this->load->model('general_model');

        $view['base_url'] = $this->config->item('base_url');
        $view = array_merge($view, $this->general_model->get_settings_batch(array('company_name')));
        $this->load->view('welcome/home', $view);
    }
}

?>
