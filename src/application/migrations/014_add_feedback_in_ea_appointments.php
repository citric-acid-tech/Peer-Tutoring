<?php

class Migration_Add_feedback_in_ea_appointments extends CI_Migration{

    public function up(){
        
        if( ! $this->db->field_exists('feedback', 'ea_appointments')){
            $field = [
                'feedback' => [
                    'type' => 'TEXT'
                ]
            ];
        
            $this->dbforge->add_column('ea_appointments', $field);
        }
    }

    public function down(){
        if( $this->db->field_exists('feedback', 'ea_appointments') ){

            $this->dbforge->drop_column('ea_appointments', 'feedback');

        }
    }
}

?>