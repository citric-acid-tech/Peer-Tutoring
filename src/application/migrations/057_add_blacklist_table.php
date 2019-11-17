<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_blacklist_table extends CI_Migration {

    public function up(){

        if( ! $this->db->table_exists('ea_blacklist')){
            $this->db->query(
                'CREATE TABLE `ea_blacklist` (
                    `sid` INT NOT NULL,
                    PRIMARY KEY (`sid`));
            ');
        }
    }

    public function down(){
        if($this->db->table_exists('ea_blacklist')){
            $this->db->query('DROP TABLE ea_blacklist');
        }
    }
    
}
?>