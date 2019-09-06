<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_buffer_tutor_assigned_table extends CI_Migration {

    public function up(){

        if( ! $this->db->table_exists('ea_buffer_tutor_assigned')){
            $this->db->query(
                'CREATE TABLE `ea_buffer_tutor_assigned` (
                `sid` INT NOT NULL,
                PRIMARY KEY (`sid`),
                UNIQUE INDEX `sid_UNIQUE` (`sid` ASC));
            ');
        }
    }

    public function down(){
        if($this->db->table_exists('ea_buffer_tutor_assigned')){
            $this->db->query('DROP TABLE ea_buffer_tutor_assigned');
        }
    }
}
?>