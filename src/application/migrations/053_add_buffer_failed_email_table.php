<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_buffer_failed_email_table extends CI_Migration {

    public function up(){

        if( ! $this->db->table_exists('ea_buffer_failed_email')){
            $this->db->query(
                'CREATE TABLE `ea_buffer_failed_email` (
                `timestamp` DATETIME NOT NULL,
                `email` VARCHAR(45) NOT NULL,
                `subject` VARCHAR(45) NULL,
                `email_body` TEXT NULL,
                PRIMARY KEY (`timestamp`, `eamil`));
            ');
        }
    }

    public function down(){
        if($this->db->table_exists('ea_buffer_failed_email')){
            $this->db->query('DROP TABLE ea_buffer_failed_email');
        }
    }
}
?>