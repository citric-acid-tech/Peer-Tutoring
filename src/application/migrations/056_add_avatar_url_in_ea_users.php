<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_avatar_url_in_ea_users extends CI_Migration {

    public function up(){
        if( ! $this->db->field_exists('avatar_url', 'ea_users')){
            $field = [
                'avatar_url' => [
                    'type' => 'VARCHAR',
                    'constraint' => '128',
                    'default' => 'default.png'
                ]
            ];
            $this->dbforge->add_column('ea_users', $field);
            $this->db->update('ea_users', ['avatar_url' => 'default.png']);
        }
    }

    public function down(){
        if( $this->db->field_exists('avatar_url', 'ea_users') ){
            $this->dbforge->drop_column('ea_users', 'avatar_url');
        }
    }
}
?>