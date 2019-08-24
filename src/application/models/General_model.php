<?php defined('BASEPATH') OR exit('No direct script access allowed');

class General_model extends CI_Model{

    /**
     * Get all the services in database
     * 
     * @return array the result of the query
     */
    public function get_all_services(){
        return $this->db
            ->select('ea_services.id AS id')
            ->from('ea_services')
            ->get()
            ->result_array();
    }

    /**
     * Get all the users in database
     * 
     * @return array the result of the query
     */
    public function get_all_users(){
        return $this->db
            ->select('CONCAT(ea_users.first_name, \' \', ea_users.last_name) AS name')
            ->from('ea_users')
            ->get()
            ->result_array();
    }

    /**
     * Get all the tutors in database
     * 
     * @return array the result of the query
     */
    public function get_all_tutors(){
        return $this->db
            ->select('
            ea_users.id                                             AS id,
            CONCAT(ea_users.first_name, \' \', ea_users.last_name)  AS name
            ')
            ->from('ea_users')
            ->where('ea_users.id_roles', 2)
            ->get()
            ->result_array();
    }

    /**
     * Get all the service types in database
     * 
     * @return array the result of the query
     */
    public function get_all_service_types(){

        return $this->db
            ->select('
            ea_service_categories.id   AS id,
            ea_service_categories.name AS name
            ')
            ->from('ea_service_categories')
            ->get()
            ->result_array();
    }

    /**
     * Get all the students in database
     * 
     * @return array the result of the query
     */
    public function get_all_students(){
        return $this->db->select('
                ea_users.id AS id,
                CONCAT(ea_users.first_name, \' \', ea_users.last_name) AS name
            ') 
            ->from('ea_users')
            ->where('id_roles != ', 1)
            ->get()
            ->result_array();
    }
}
?>