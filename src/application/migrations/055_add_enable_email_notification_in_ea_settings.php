<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_enable_email_notification_in_ea_settings extends CI_Migration {

    public function up(){

        $data = array(
            'name'=> 'enable_email_notification',
            'value' => '1'
        );
        $this->db->insert('ea_settings', $data);
    }

    public function down(){
        $this->db->where('name', 'enable_email_notification');
        $this->db->delete('ea_settings');
    }
}
?>