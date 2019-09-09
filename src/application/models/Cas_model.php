<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Cas_model extends CI_Model{

    /**
     * @param cas_user_data email, groups, id, name, sid
     */
    public function get_user_data($cas_user_data){

        $default_registraion_id_role = 3;

        $id_users = -1;

        $registration = 
            $this->db->select('COUNT(*)')
                ->from('ea_users')
                ->where('ea_users.cas_sid', $cas_user_data['sid'])
                ->get()
                ->row_array()['COUNT(*)'];

        // User has not registered yet ?
        if($registration == 0){

            $this->db->trans_begin();

            // Examine if this user is assigned to be a tutor already.
            $is_tutor = $this->db
                ->select('COUNT(*) AS cnt')
                ->from('ea_buffer_tutor_assigned')
                ->where('sid', $cas_user_data['sid'])
                ->get()
                ->row_array()['cnt'];
            if($is_tutor == 1){
                $default_registraion_id_role = 2;
                $this->db->where('sid', $cas_user_data['sid']);
                $this->db->delete('ea_buffer_tutor_assigned');
            }

            // Register
            $data = array(
                'first_name' => $cas_user_data['name'],
                'last_name' => ' ',
                'email' => $cas_user_data['email'],
                'cas_hash_id' => $cas_user_data['id'],
                'cas_sid' => $cas_user_data['sid'],
                'id_roles' => $default_registraion_id_role
            );
            
            if($this->db->insert('ea_users', $data)){
                $id_users = $this->db->insert_id();

                $data = array('id_users' => $id_users, 'username' => $cas_user_data['sid']);
                
                if ( ! $this->db->insert('ea_user_settings', $data) ){
                    $this->db->trans_rollback();
                }else{
                    $this->db->trans_commit();
                }
            }
            $this->db->trans_complete();
        }

        // Get user data
        $user_data = $this->db
            ->select('ea_users.id AS user_id, ea_users.email AS user_email, '
                . 'ea_roles.slug AS role_slug, ea_user_settings.username')
            ->from('ea_users')
            ->join('ea_roles', 'ea_roles.id = ea_users.id_roles', 'inner')
            ->join('ea_user_settings', 'ea_user_settings.id_users = ea_users.id', 'inner')
            ->where('ea_users.cas_sid', $cas_user_data['sid'])
            ->get()->row_array();

        return ($user_data) ? $user_data : NULL;
    }
}
?>