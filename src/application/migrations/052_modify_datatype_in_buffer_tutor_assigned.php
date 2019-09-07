
<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Modify_datatype_in_buffer_tutor_assigned extends CI_Migration {

    public function up(){

        $this->db->query(
            'ALTER TABLE `ea_buffer_tutor_assigned` 
            CHANGE COLUMN `sid` `sid` VARCHAR(63) NOT NULL ;
        ');
        
    }

    public function down(){

    }
}
?>