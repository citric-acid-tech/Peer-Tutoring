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
            ->where('ea_users.id_roles <', 3)
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

    /**
     * A list of names of the setting in ea_settings table
     * 
     * @return array settings in database
     */
    public function get_settings_batch($key_arr){
        $rtn = array();

        $this->db->select('name, value')->from('ea_settings');
        foreach($key_arr AS $key){
            $this->db->or_where('name', $key);
        }
        $result = $this->db->get()->result_array();
        
        foreach($result AS $row){
            $rtn[$row['name']] = $row['value'];
        }
        return $rtn;
    }

    // $SERV_TYPE$, $DATE$, $ADDRESS$, $LEFT$
    public function get_email_content($key, $service_type = 'null', $date = 'null', $address = 'null', $left = 'null'){
        $value = $this->db
            ->select('ea_settings.value')
            -from('ea_settings')
            ->where('name', $key)
            ->get()
            ->row_array()['value'];
        if(is_null($value)){
            return FALSE;
        }
        
        $ec = json_decode($value);
        $subject = $ec['subject'];
        $body = str_replace(array('$SERV_TYPE$', '$DATE$', '$ADDRESS$', '$LEFT$'), 
                            array( $service_type, $date,    $address,    $left), 
                $ec['body']);

        return array('subject'=>$subject, 'body'=>$body);
    }
}
?>