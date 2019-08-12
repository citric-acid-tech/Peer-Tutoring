<?php

class Migration_Add_priv_my_appointments extends CI_Migration{

    public function up(){
        
        /** PRIV_MY_APPOINTMENTS */
        if( ! $this->db->field_exists('my_appointments', 'ea_roles')){
            $field = [
                'my_appointments' => [
                    'type' => 'INT',
                    'constraint' => '11',
                ]
            ];
        
            $this->dbforge->add_column('ea_roles', $field);

            $this->db->update('ea_roles', ['my_appointments' => '15']);
            
        }
    }

    public function down(){
        if( $this->db->field_exists('my_appointments', 'ea_roles') ){

            $this->dbforge->drop_column('ea_roles', 'my_appointments');

        }
    }
}

?>