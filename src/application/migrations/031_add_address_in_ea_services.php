<?php

class Migration_Add_address_in_ea_services extends CI_Migration{

    public function up(){
        
        /** PRIV_MY_APPOINTMENTS */
        if( ! $this->db->field_exists('address', 'ea_services')){
            $field = [
                'address' => [
                    'type' => 'VARCHAR',
                    'constraint' => '64'
                ]
            ];
        
            $this->dbforge->add_column('ea_services', $field);
        }
    }

    public function down(){
        if( $this->db->field_exists('address', 'ea_services') ){

            $this->dbforge->drop_column('ea_services', 'address');

        }
    }
}

?>