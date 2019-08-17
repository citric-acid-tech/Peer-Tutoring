<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_flexible_column_in_ea_users extends CI_Migration {

    public function up(){

        if( ! $this->db->field_exists('flexible_column', 'ea_users')){
            $field = [
                'flexible_column' =>[
                    'type' => 'VARCHAR',
                    'constraint' => '256',
                    'default' => 'null_value'
                ]
            ];
            $this->dbforge->add_column('ea_users', $field);
            $this->db->update('ea_users', ['flexible_column' => 'null_value']);
        }
    }

    public function down(){
        if($this->db->field_exists('flexible_column', 'ea_users')){
            $this->dbforge->drop_column('ea_users', 'flexible_column');
        }
    }
}
?>