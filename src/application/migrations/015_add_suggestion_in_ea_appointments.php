<?php

class Migration_Add_suggestion_in_ea_appointments extends CI_Migration{

    public function up(){
        
        if( ! $this->db->field_exists('suggestion', 'ea_appointments')){
            $field = [
                'suggestion' => [
                    'type' => 'TEXT'
                ]
            ];
        
            $this->dbforge->add_column('ea_appointments', $field);
        }
    }

    public function down(){
        if( $this->db->field_exists('suggestion', 'ea_appointments') ){

            $this->dbforge->drop_column('ea_appointments', 'suggestion');

        }
    }
}

?>