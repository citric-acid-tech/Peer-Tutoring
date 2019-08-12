<?php

class Migration_Add_priv_available_appointments extends CI_Migration{

    public function up(){
        
        /** PRIV_MY_APPOINTMENTS */
        if( ! $this->db->field_exists('available_appointments', 'ea_roles')){
            $field = [
                'available_appointments' => [
                    'type' => 'INT',
                    'constraint' => '11',
                ]
            ];
        
            $this->dbforge->add_column('ea_roles', $field);

            $this->db->update('ea_roles', ['available_appointments' => '15']);
            
        }
    }

    public function down(){
        if( $this->db->field_exists('available_appointments', 'ea_roles') ){

            $this->dbforge->drop_column('ea_roles', 'available_appointments');

        }
    }
}

?>