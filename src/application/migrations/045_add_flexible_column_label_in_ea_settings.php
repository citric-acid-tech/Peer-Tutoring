<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_flexible_column_label_in_ea_settings extends CI_Migration {

    public function up(){
        $data = [
            'name' => 'flexible_column_label',
            'value' => 'flexible col'
        ];
        $this->db->insert('ea_settings', $data);
    }

    public function down(){
        $this->db->where('name', 'flexible_column_label');
        $this->db->delete('ea_settings');
    }

}
?>