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

            $data = array(
                'first_name' => $cas_user_data['name'],
                'email' => $cas_user_data['email'],
                'cas_hash_id' => $cas_user_data['id'],
                'cas_sid' => $cas_user_data['sid'],
                'id_roles' => $default_registraion_id_role
            );
            
            $this->db->insert('ea_users', $data);

            $id_users = $this->db->insert_id();
            
            $data = array('id_users' => $id_users, 'username' => $cas_user_data['sid']);
            
            if ( ! $this->db->insert('ea_user_settings', $data) ){
                $this->db->trans_rollback();
            }else{
                $this->db->trans_commit();
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

        echo $user_data['user_id'] . '<br />';

        return ($user_data) ? $user_data : NULL;
    }
}
?>