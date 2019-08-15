<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_comment_or_suggestion_to_ea_appointments extends CI_Migration {

    public function up(){

        if( ! $this->db->field_exists('comment_or_suggestion', 'ea_appointments')){
            $field = [
                'comment_or_suggestion' =>[
                    'type' => 'TEXT'
                ]
            ];
            $this->dbforge->add_column('ea_appointments', $field);
            $this->db->update('ea_appointments', ['comment_or_suggestion' => 'no comment or suggestion.']);
        }
    }

    public function down(){
        if($this->db->field_exists('comment_or_suggestion', 'ea_appointments')){
            $this->dbforge->drop_column('ea_appointments', 'comment_or_suggestion');
        }
    }
}
?>