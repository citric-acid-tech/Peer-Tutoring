<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_model extends CI_Model{

    public function new_tutor($first_name, $last_name, $personal_page, 
                                $introduction, $phone_number, $eamil, $address, $flexible_column){
        
        $data = array(
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => $email,
            'phone_number' => $phone_number,
            'address' => $address,
            'introduction' => $introduction,
            'id_roles' => 2,
            'personal_page' => $personal_page
        );

        return $this->db->insert('ea_users', $data);
    }

    public function new_service_batch($date_array, $service_type, $tutor_name, $address, $capacity, $service_description){
        
        //get tutor id and service id from database
        $tutor_id = $this->db
            ->select('ea_users.id AS id')
            ->from('ea_users')
            ->where('CONCAT(ea_users.first_name, \' \', ea_users.last_name) =', $tutor_name)
            ->get()
            ->row_array()['id'];
        $service_id = $this->db
            ->select('ea_service_categories.id AS id')
            ->from('ea_service_categories')
            ->where('ea_service_categories.name', $service_type)
            ->get()
            ->row_array()['id'];

        // Decode the date array and insert all the service in batch

        $i = 0;

        foreach($date_array as $date){
            foreach($date as $class){
                $start_datetime = $class['date'] . ' ' . $class['start_time_h'].':'.$class['start_time_m'];
                $end_datetime = $class['date'] . ' ' . $class['end_time_h'].':'.$class['end_time_m'];
                $data[$i] = array(
                    'description' => $service_description,
                    'capacity' => $capacity,
                    'id_service_categories' => $service_id,
                    'appointments_number' => 0,
                    'start_datetime' => $start_datetime,
                    'end_datetime' => $end_datetime,
                    'id_users_provider' => $tutor_id
                );
                $i = $i + 1;
            }
        }
        
        return $this->db->insert_batch('ea_services', $data);
    }

    public function new_service_type($name, $description){
        // Verify if this name is already exists or not
        $cnt = $this->db
            ->select('count(*) AS count')
            ->from('ea_service_categories')
            ->where('name', $name)
            ->get()
            ->row_array()['count'];
        if($cnt != 0){
            return 'DUPLICATE_NAME';
        }

        // Insert
        $data = array(
            'name' => $name,
            'description' => $description
        );
        return $this->db->insert('ea_service_categories', $data);
    }
}



?>