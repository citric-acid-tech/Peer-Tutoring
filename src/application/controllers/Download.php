<?php

class Download extends CI_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->helper('download');
    }

    public function index($url){
        $tmp_arr = explode('.', $url);
        $ext = count($tmp_arr) == 2 ? ('.' . $tmp_arr[1]) : '';
        force_download('attachment'.$ext, file_get_contents(DOCUMENT_SAVED_PATH . $url));
    }
}
?>