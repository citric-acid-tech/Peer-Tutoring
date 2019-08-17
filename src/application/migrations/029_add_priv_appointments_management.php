<?php

class Migration_Add_priv_appointments_management extends CI_Migration{

    public function up(){
        
        /** PRIV_MY_APPOINTMENTS */
        if( ! $this->db->field_exists('appointments_management', 'ea_roles')){
            $field = [
                'appointments_management' => [
                    'type' => 'INT',
                    'constraint' => '11',
                ]
            ];
        
            $this->dbforge->add_column('ea_roles', $field);

            $this->db->set('appointments_management', '15');
            $this->db->where('ea_roles.id < ', 3);
            $this->db->update('ea_roles');
        }
    }

    public function down(){
        if( $this->db->field_exists('appointments_management', 'ea_roles') ){

            $this->dbforge->drop_column('ea_roles', 'appointments_management');

        }
    }
}

?>