<?php

class Migration_Add_stars_in_ea_appointments extends CI_Migration{

    public function up(){
        
        if( ! $this->db->field_exists('stars', 'ea_appointments')){
            $field = [
                'stars' => [
                    'type' => 'INT',
                    'constraint' => '11',
                    'default' => '0',
                ]
            ];
        
            $this->dbforge->add_column('ea_appointments', $field);

            $this->db->update('ea_appointments', ['stars' => '0']);
        }
    }

    public function down(){
        if( $this->db->field_exists('stars', 'ea_appointments') ){

            $this->dbforge->drop_column('ea_appointments', 'stars');

        }
    }
}

?>