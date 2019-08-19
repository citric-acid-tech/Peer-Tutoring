<?php

class Migration_Add_admin_appointments_management_in_ea_roles extends CI_Migration{

    public function up(){
        
        /** PRIV_SERVICES_CONFIG */
        if( ! $this->db->field_exists('admin_appointments_management', 'ea_roles')){
            $field = [
                'admin_appointments_management' => [
                    'type' => 'INT',
                    'constraint' => '11',
                    'DEFAULT' => 0
                ]
            ];
        }
        $this->dbforge->add_column('ea_roles', $field);
            $this->db->where('id', 1);
            $this->db->update('ea_roles', ['admin_appointments_management' => 15]);
    }

    public function down(){
        if( $this->db->field_exists('admin_appointments_management', 'ea_roles') ){
            $this->dbforge->drop_column('ea_roles', 'admin_appointments_management');
        }
    }
}

?>