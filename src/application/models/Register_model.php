<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Register_Model extends CI_Model {

    public function create_account($first_name, $last_name, $email, $username, $password, $id_roles){
        $this->load->helper('general');

        $this->db->trans_begin();

        $data = array(
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => $email,
            'id_roles' => $id_roles
        );

        if ( ! $this->db->insert('ea_users', $data)){
            throw new Exception('Could not insert admin into the database.');
        }

        $salt = generate_salt();
        

        $data = array(
            'username' => $username,
            'id_users' => (int)$this->db->insert_id(),
            'salt' => $salt,
            'password' => hash_password($salt, $password)
        );

        if ( ! $this->db->insert('ea_user_settings', $data)){
            $this->db->trans_rollback();
            throw new Exception('Could not insert admin settings into the database.');
        }

        $this->db->trans_complete();
        return TRUE;
    }

    /**
     * Update an existing admin record in the database.
     *
     * @param array $admin Contains the admin record data.
     *
     * @return int Returns the record id.
     *
     * @throws Exception When the update operation fails.
     */
    protected function _update($admin)
    {
        $this->load->helper('general');

        $settings = $admin['settings'];
        unset($admin['settings']);
        $settings['id_users'] = $admin['id'];

        if (isset($settings['password']))
        {
            $salt = $this->db->get_where('ea_user_settings', ['id_users' => $admin['id']])->row()->salt;
            $settings['password'] = hash_password($salt, $settings['password']);
        }

        $this->db->where('id', $admin['id']);
        if ( ! $this->db->update('ea_users', $admin))
        {
            throw new Exception('Could not update admin record.');
        }

        $this->db->where('id_users', $settings['id_users']);
        if ( ! $this->db->update('ea_user_settings', $settings))
        {
            throw new Exception('Could not update admin settings.');
        }

        return (int)$admin['id'];
    }



    /**
     * Delete an existing admin record from the database.
     *
     * @param int $admin_id The admin record id to be deleted.
     *
     * @return bool Returns the delete operation result.
     *
     * @throws Exception When the $admin_id is not a valid int value.
     * @throws Exception When the record to be deleted is the only one admin user left on the system.
     */
    public function delete($admin_id)
    {
        if ( ! is_numeric($admin_id))
        {
            throw new Exception('Invalid argument type $admin_id: ' . $admin_id);
        }

        // There must be always at least one admin user. If this is the only admin
        // the system, it cannot be deleted.
        $admin_count = $this->db->get_where('ea_users',
            ['id_roles' => $this->get_admin_role_id()])->num_rows();
        if ($admin_count == 1)
        {
            throw new Exception('Record could not be deleted. The system requires at least '
                . 'one admin user.');
        }

        $num_rows = $this->db->get_where('ea_users', ['id' => $admin_id])->num_rows();
        if ($num_rows == 0)
        {
            return FALSE; // Record does not exist in database.
        }

        return $this->db->delete('ea_users', ['id' => $admin_id]);
    }
}
