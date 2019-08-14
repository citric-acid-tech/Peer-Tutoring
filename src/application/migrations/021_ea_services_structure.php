<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Ea_services_structure extends CI_Migration {

    public function up(){
        
        /**Addition */
        
        $fields = [
            'capacity' => [
                'type' => 'INT',
                'constraint' => '11',
                'default' => '0'                ],
            'appointments_number' => [
                'type' => 'INT',
                'constraint' => '11',
                'default' => '0'
            ],
            'start_datetime' => [
                'type' => 'datetime',
                'default' => '1997-07-01 00:00:00'
            ],
            'end_datetime' => [
                'type' => 'datetime',
                'default' => '1945-10-01 00:00:00'
            ]
        ];

        $this->dbforge->add_column('ea_services', $fields);

        $this->db->update('ea_services', ['capacity' => '0']);
        $this->db->update('ea_services', ['appointments_number' => '0']);
        $this->db->update('ea_services', ['start_datetime' => '1997-07-01 00:00:00']);
        $this->db->update('ea_services', ['end_datetime' => '1945-10-01 00:00:00']);

        /**Deletion */
        $this-> _drop_col_from_table('ea_services', 'price');
        $this-> _drop_col_from_table('ea_services', 'currency');
        $this-> _drop_col_from_table('ea_services', 'attendants_number');    
        
    }

    public function down(){
        /**Addition down */
        $this-> _drop_col_from_table('ea_services', 'capacity');
        
        $this-> _drop_col_from_table('ea_services', 'appointments_number');
        
        $this-> _drop_col_from_table('ea_services', 'start_datetime');
        
        $this-> _drop_col_from_table('ea_services', 'end_datetime');
        

        /**Deletion down */
        $fields = [
            'price' => [
                'type' => 'DECIMAL',
                'constraint' => array(10, 2)
            ],
            'currency' => [
                'type' => 'VARCHAR',
                'constraint' => '32'
            ],
            'attendants_number' => [
                'type' => 'INT',
                'constraint' => '11'
            ]
        ];

        $this->dbforge->add_column('ea_services', $fields);
    }

    protected function _drop_col_from_table($tab, $col){
        if ($this->db->field_exists($col, $tab)){
            $this->dbforge->drop_column($tab, $col);
        }
    }
}
