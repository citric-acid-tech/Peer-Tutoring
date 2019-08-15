<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_id_users_provider_in_ea_services extends CI_Migration {

    public function up(){

        if( ! $this->db->field_exists('id_users_provider', 'ea_services')){

            // Create column
            $field = [
                'id_users_provider' =>[
                    'type' => 'INT',
                    'constraint' => '11'
                ]
            ];
            $this->dbforge->add_column('ea_services', $field);

            // Add foregin key
            $this->db->query('ALTER TABLE `ea_services`
            ADD CONSTRAINT `services_users_provider` FOREIGN KEY (`id_users_provider`) REFERENCES `ea_users` (`id`)
            ON DELETE CASCADE
            ON UPDATE CASCADE');
        }
    }

    public function down(){
        
        if($this->db->field_exists('id_users_provider', 'ea_services')){
            // Drop foreign key
            $this->db->query('ALTER TABLE ea_services DROP FOREIGN KEY services_users_provider');

            // Drop column
            $this->dbforge->drop_column('ea_services', 'id_users_provider');
        }
    }
}
?>