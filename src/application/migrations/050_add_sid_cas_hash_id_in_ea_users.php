<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_sid_cas_hash_id_in_ea_users extends CI_Migration {

    public function up(){
        if( ! $this->db->field_exists('cas_hash_id', 'ea_users')){
            $field = [
                'cas_hash_id' => [
                    'type' => 'VARCHAR',
                    'constraint' => '32'
                ]
            ];
            $this->dbforge->add_column('ea_users', $field);
        }

        if( ! $this->db->field_exists('cas_sid', 'ea_users')){
            $field = [
                'cas_sid' => [
                    'type' => 'VARCHAR',
                    'constraint' => '32'
                ]
            ];
            $this->dbforge->add_column('ea_users', $field);
        }
        
    }

    public function down(){
        if( $this->db->field_exists('cas_hash_id', 'ea_users') ){
            $this->dbforge->drop_column('ea_users', 'cas_hash_id');
        }

        if( $this->db->field_exists('cas_sid', 'ea_users') ){
            $this->dbforge->drop_column('ea_users', 'cas_sid');
        }
    }
}
?>