<?php

class Migration_Add_remark_in_ea_appointments extends CI_Migration{

    public function up(){
        
        /** PRIV_MY_APPOINTMENTS */
        if( ! $this->db->field_exists('remark', 'ea_appointments')){
            $field = [
                'remark' => [
                    'type' => 'varchar',
                    'constraint' => '64'
                ]
            ];
        
            $this->dbforge->add_column('ea_appointments', $field);
         
        }
    }

    public function down(){
        if( $this->db->field_exists('remark', 'ea_appointments') ){

            $this->dbforge->drop_column('ea_appointments', 'remark');

        }
    }
}

?>