<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_booking_status_in_ea_apointments extends CI_Migration {

    public function up(){

        if( ! $this->db->field_exists('booking_status', 'ea_appointments')){
            $field = [
                'booking_status' => [
                    'type' => 'INT',
                    'constraint' => '11',
                    'default' => '0',
                ]
            ];
        
            $this->dbforge->add_column('ea_appointments', $field);

            $this->db->update('ea_appointments', ['booking_status' => '0']);
        }
    }


    public function down(){
        if( $this->db->field_exists('booking_status', 'ea_appointments') ){

            $this->dbforge->drop_column('ea_appointments', 'booking_status');

        }
    }
}
?>