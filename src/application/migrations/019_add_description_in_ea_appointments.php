<?php

class Migration_Add_description_in_ea_appointments extends CI_Migration{

    public function up(){
        
        /** PRIV_MY_APPOINTMENTS */
        if( ! $this->db->field_exists('description', 'ea_appointments')){
            $field = [
                'description' => [
                    'type' => 'TEXT'
                ]
            ];
        
            $this->dbforge->add_column('ea_appointments', $field);
         
        }
    }

    public function down(){
        if( $this->db->field_exists('description', 'ea_appointments') ){

            $this->dbforge->drop_column('ea_appointments', 'description');

        }
    }
}

?>