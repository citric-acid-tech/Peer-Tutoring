<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_personal_page_in_ea_users extends CI_Migration {

    public function up(){

        if( ! $this->db->field_exists('personal_page', 'ea_users')){
            $field = [
                'personal_page' =>[
                    'type' => 'VARCHAR',
                    'constraint' => '256',
                    'default' => 'no_personal_page'
                ]
            ];
            $this->dbforge->add_column('ea_users', $field);
            $this->db->update('ea_users', ['personal_page' => 'no_personal_page']);
        }
    }

    public function down(){
        if($this->db->field_exists('personal_page', 'ea_users')){
            $this->dbforge->drop_column('ea_users', 'personal_page');
        }
    }
}
?>