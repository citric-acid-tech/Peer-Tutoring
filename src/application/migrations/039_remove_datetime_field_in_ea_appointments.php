<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_remove_datetime_field_in_ea_appointments extends CI_Migration {

    public function up(){
        
        $this->_drop_col_from_table('ea_appointments', 'start_datetime');
        $this->_drop_col_from_table('ea_appointments', 'end_datetime');
    
    }

    public function down(){

        $fields = [
            'start_datetime' => [
                'type' => 'datetime',
                'default' => '1997-07-01 00:00:00'
            ],
            'end_datetime' => [
                'type' => 'datetime',
                'default' => '1945-10-01 00:00:00'
            ]
        ];

        $this->dbforge->add_column('ea_appointments', $fields);

        $this->db->update('ea_appointments', ['start_datetime' => '1997-07-01 00:00:00']);
        $this->db->update('ea_appointments', ['end_datetime' => '1945-10-01 00:00:00']);
        
    }

    protected function _drop_col_from_table($tab, $col){
        if ($this->db->field_exists($col, $tab)){
            $this->dbforge->drop_column($tab, $col);
        }
    }
}
