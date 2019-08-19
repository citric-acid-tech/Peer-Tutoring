<?php

class Migration_Add_tutors_config_in_ea_roles extends CI_Migration{

    public function up(){
        
        /** PRIV_SERVICES_CONFIG */
        if( ! $this->db->field_exists('tutors_config', 'ea_roles')){
            $field = [
                'tutors_config' => [
                    'type' => 'INT',
                    'constraint' => '11',
                    'DEFAULT' => '0'
                ]
            ];
        }
        $this->dbforge->add_column('ea_roles', $field);
            $this->db->where('id', 1);
            $this->db->update('ea_roles', ['tutors_config' => 15]);
    }

    public function down(){
        if( $this->db->field_exists('tutors_config', 'ea_roles') ){
            $this->dbforge->drop_column('ea_roles', 'tutors_config');
        }
    }
}

?>