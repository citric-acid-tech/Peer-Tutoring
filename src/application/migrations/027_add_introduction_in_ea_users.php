<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_introduction_in_ea_users extends CI_Migration {

    public function up(){

        if( ! $this->db->field_exists('introduction', 'ea_users')){
            $field = [
                'introduction' =>[
                    'type' => 'TEXT'
                ]
            ];
            $this->dbforge->add_column('ea_users', $field);
        }
    }

    public function down(){
        if($this->db->field_exists('introduction', 'ea_users')){
            $this->dbforge->drop_column('ea_users', 'introduction');
        }
    }
}
?>