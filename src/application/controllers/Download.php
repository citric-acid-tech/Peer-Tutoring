<?php

class Download extends CI_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->helper('download');
    }

    public function index($url, $service_type, $stu_sid, $tut_sid, $start_date){
        $tmp_arr = explode('.', $url);
        $ext = count($tmp_arr) == 2 ? ('.' . $tmp_arr[1]) : '';
        force_download($service_type . '_' . $stu_sid . '_' . $tut_sid . '_' .$start_date .$ext, file_get_contents(DOCUMENT_SAVED_PATH . $url));
    }
}
?>