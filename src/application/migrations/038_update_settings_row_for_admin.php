<?php

class Migration_Update_settings_row_for_admin extends CI_Migration{

    public function up(){
        
        $data = array();
        $data = [
            0 => [
                'name' => 'upload_file_max_size(KB)',
                'value' => '2048'
            ],
            1 => [
                'name' => 'max_services_checking_ahead_day',
                'value' => '7'
            ],
            2 => [
                'name' => 'max_appointment_cancel_ahead_day',
                'value' => '1'
            ]
        ];

        $this->db->insert_batch('ea_settings', $data);
    }

    public function down(){
        $this->db->where('name', 'upload_file_max_size(KB)');
        $this->db->delete('ea_settings');
        $this->db->where('name', 'max_services_checking_ahead_day');
        $this->db->delete('ea_settings');
        $this->db->where('name', 'max_appointment_cancel_ahead_day');
        $this->db->delete('ea_settings');
    }
}

?>