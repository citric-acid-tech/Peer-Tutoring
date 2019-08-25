<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_attachment_url_in_ea_appointments extends CI_Migration {

    public function up(){
        if( ! $this->db->field_exists('attachment_url', 'ea_appointments')){
            $field = [
                'attachment_url' => [
                    'type' => 'VARCHAR',
                    'constraint' => '512'
                ]
            ];
        }
        $this->dbforge->add_column('ea_appointments', $field);
        $this->db->update('ea_appointments', ['attachment_url' => APPPATH.'..'.DIRECTORY_SEPARATOR.'upload'.DIRECTORY_SEPARATOR.'test.png']);
    }

    public function down(){
        if( $this->db->field_exists('attachment_url', 'ea_appointments') ){
            $this->dbforge->drop_column('ea_appointments', 'attachment_url');
        }
    }
}
?>