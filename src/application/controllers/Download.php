<?php

class Download extends CI_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->helper('download');
    }

    public function index($url){
        force_download(DOCUMENT_SAVED_PATH . $url, NULL);
    }

}

?>