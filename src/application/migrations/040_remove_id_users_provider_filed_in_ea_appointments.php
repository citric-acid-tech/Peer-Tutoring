<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Remove_id_users_provider_filed_in_ea_appointments extends CI_Migration {

    public function up(){
        
        $this->db->query(
            'ALTER TABLE `ea_appointments` 
             DROP FOREIGN KEY `appointments_users_provider`;
                          
        ');
        $this->db->query(
            'ALTER TABLE `ea_appointments` 
             DROP INDEX `id_users_provider`;
        ');
        
        $this->_drop_col_from_table('ea_appointments', 'id_users_provider');
    }

    public function down(){

        $fields = [
            'id_users_provider' => [
                'type' => 'INT'
            ]
        ];

        $this->dbforge->add_column('ea_appointments', $fields);

        $this->db->query(
            'ALTER TABLE `ea_appointments` 
             ADD CONSTRAINT `appointments_users_provider`
             FOREIGN KEY (`id_users_provider`)
             REFERENCES `ea_users` (`id`)
             ON DELETE NO ACTION
             ON UPDATE NO ACTION;
        ');
        $this->db->query(
            'ALTER TABLE `ea_db2`.`ea_appointments` 
             ADD INDEX `id_users_provider` (`id_users_provider` ASC);
        ');
    }

    protected function _drop_col_from_table($tab, $col){
        if ($this->db->field_exists($col, $tab)){
            $this->dbforge->drop_column($tab, $col);
        }
    }
}
