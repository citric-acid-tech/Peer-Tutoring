<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_semester_info_in_ea_settings extends CI_Migration {

    public function up(){
        $data = [
            'name' => 'semester_json',
            'value' => '{
                "2019":{
                    "Spring":{
                        "first_Monday":"2019-02-18",
                        "last_weeks":"15"
                    },
                    "Summer":{
                        "first_Monday":"2019-06-24",
                        "last_weeks":"6"
                    },
                    "Fall":{
                        "first_Monday":"2019-08-05",
                        "last_weeks":"17"
                    }
                }
            }'
        ];
        $this->db->insert('ea_settings', $data);
    }

    public function down(){
        $this->db->where('name', 'semester_json');
        $this->db->delete('ea_settings');
    }

}
?>