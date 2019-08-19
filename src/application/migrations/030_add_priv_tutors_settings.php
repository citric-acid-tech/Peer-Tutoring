<?php

class Migration_Add_priv_tutors_settings extends CI_Migration{

    public function up(){
        
        /** PRIV_MY_APPOINTMENTS */
        if( ! $this->db->field_exists('tutors_settings', 'ea_roles')){
            $field = [
                'tutors_settings' => [
                    'type' => 'INT',
                    'constraint' => '11',
                    'DEFAULT' => '0'
                ]
            ];
        
            $this->dbforge->add_column('ea_roles', $field);

            $this->db->set('tutors_settings', '15');
            $this->db->where('ea_roles.id < ', 3);
            $this->db->update('ea_roles');
        }
    }

    public function down(){
        if( $this->db->field_exists('tutors_settings', 'ea_roles') ){

            $this->dbforge->drop_column('ea_roles', 'tutors_settings');

        }
    }
}

?>