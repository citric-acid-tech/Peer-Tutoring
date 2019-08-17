<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Unique_index_name_in_ea_service_categories extends CI_Migration {

    public function up(){
        $this->db->query('ALTER TABLE `ea_db2`.`ea_services` ADD UNIQUE INDEX `name_UNIQUE` (`name` ASC);');
    }

    public function down(){
        $this->db->query('ALTER TABLE `ea_db2`.`ea_services` DROP INDEX `name_UNIQUE` ;');
    }
}
?>