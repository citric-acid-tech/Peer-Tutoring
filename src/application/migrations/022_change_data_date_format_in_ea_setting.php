<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Change_data_date_format_in_ea_setting extends CI_Migration {

    public function up(){
        $data = [
            'id' => 5,
            'name' => 'date_format',
            'value' => 'YMD'
        ];
        $this->db->replace('ea_settings', $data);
    }

    public function down(){
        $data = [
            'id' => 5,
            'name' => 'date_format',
            'value' => 'DMY'
        ];
        $this->db->replace('ea_settings', $data);
    }

}
?>