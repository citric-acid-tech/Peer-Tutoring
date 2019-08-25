<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_ea_tutor_log_table extends CI_Migration {

    public function up(){
        $this->db->query(
            'CREATE TABLE `ea_tutor_log` (
                `id` INT NOT NULL AUTO_INCREMENT,
                `id_users` INT NOT NULL,
                `operation` VARCHAR(45) NULL,
                `input_json` TEXT NULL,
                `output_json` TEXT NULL,
                `timestamp` DATETIME NOT NULL,
                PRIMARY KEY (`id`),
                INDEX `fk_tutor_id_users_id` (`id_users` ASC),
                CONSTRAINT `fk_tutor_id_users`
                  FOREIGN KEY (`id_users`)
                  REFERENCES `ea_users` (`id`)
                  ON DELETE NO ACTION
                  ON UPDATE NO ACTION);
              ');
    }

    public function down(){
        $this->db->query('DROP TABLE ea_tutor_log;');
    }

}
?>