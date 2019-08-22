<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Remove_description_from_ea_appointments extends CI_Migration {

    public function up(){
        
        $this->_drop_col_from_table('ea_appointments', 'description');
    
    }

    public function down(){

        $fields = [
            'description' => [
                'type' => 'TEXT'
            ]
        ];

        $this->dbforge->add_column('ea_appointments', $fields);

    }

    protected function _drop_col_from_table($tab, $col){
        if ($this->db->field_exists($col, $tab)){
            $this->dbforge->drop_column($tab, $col);
        }
    }
}
