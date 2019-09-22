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
            ->select('
            ea_users.cas_sid                                       AS cas_sid,
            CONCAT(ea_users.first_name, \' \', ea_users.last_name) AS name
            ')
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
            ea_users.cas_sid                                        AS cas_sid,
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
				ea_users.cas_sid AS cas_sid,
                ea_users.id AS id,
                CONCAT(ea_users.first_name, \' \', ea_users.last_name) AS name
            ') 
            ->from('ea_users')
            ->where('id_roles != ', 1)
            ->get()
            ->result_array();
    }

    public function get_tutor_avatar_url($tutor_id){
        return $this->db->select('
                ea_users.avatar_url AS url
            ')
            ->from('ea_users')
            ->where('id', $tutor_id)
            ->get()
            ->row_array()['url'];
    }

    public function update_tutor_avatar($file, $tutor_id){
        // Check empty
        if(is_null($file)){
            return array('result'=> FALSE, 'msg'=> 'no_file');
        }

        $ext = $this->get_extension($file['name']);

        // Check type
        $ext_arr = explode('|', AVATAR_FORMAT);
        $is_ok = FALSE;
        foreach($ext_arr AS $val){
            if($ext == $val){
                $is_ok = TRUE;
                break;
            }
        }
        if( ! $is_ok){
            return array('result'=> FALSE, 'msg'=> 'invalid_type');
        }

        // Check size
        if($file['size'] >= 2 * 1024){ // bytes
            return array('result' => FALSE, 'msg'=>'size_too_large');
        }

        $hash_id = $this->db
            ->select('ea_users.cas_hash_id AS hash')
            ->from('ea_users')
            ->where('ea_users.id', $tutor_id)
            ->get()
            ->row_array()['hash'];
        
        $file_name = 'avatar' - $hash_id .'.'. $ext;
        $file_target_path = AVATAR_SAVED_PATH . $file_name;

        if(move_uploaded_file($file['tmp_name'], $file_target_path)){

            $this->db->set('avatar_url', $file_name);
            $this->db->where('ea_users.id', $tutor_id);
            if( ! $this->db->update('ea_users')){
                return array('result'=> FALSE, 'msg'=> 'consistency_error');
            }

            return array('result'=> TRUE, 'msg'=> $file_name);

        }else{
            return array('result'=> FALSE, 'msg'=> 'unknown_error');
        }
    
        
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

    public function get_appointment_info($appointment_id){
        return $this->db->select('
                        stu.email                       AS student_email,
                        ea_users.email                  AS tutor_email,
                        ea_appointments.id_services     AS service_id,
                        ea_service_categories.name      AS service_type,
                        ea_services.start_datetime      AS date,
                        ea_services.address             AS address,
                        ea_services.appointments_number AS left
                    ')
                    ->from('ea_appointments')
                    ->join('ea_services', 'ea_services.id = ea_appointments.id_services', 'inner')
                    ->join('ea_users', 'ea_users.id = ea_services.id_users_provider', 'inner')
                    ->join('ea_users AS stu', 'stu.id = ea_appointments.id_users_customer', 'inner')
                    ->join('ea_service_categories', 'ea_service_categories.id = ea_services.id_service_categories', 'inner')
                    ->where('ea_appointments.id', $appointment_id)
                    ->get()
                    ->row_array();
    }

    public function is_enable_email_notification(){
        return $this->db->select('ea_settings.value AS rtn')
                    ->from('ea_settings')
                    ->where('name', 'enable_email_notification')
                    ->get()
                    ->row_array()['rtn'] == 1;
    }

    public function get_service_info($service_id){
        return $this->db
                ->select('
                    ea_service_categories.name      AS service_type,
                    ea_services.start_datetime      AS date,
                    ea_services.address             AS address,
                    ea_services.appointments_number AS left,
                    ea_users.email                  AS tutor_email
                ')
                ->from('ea_services')
                ->join('ea_service_categories', 'ea_service_categories.id = ea_services.id_service_categories', 'inner')
                ->join('ea_users', 'ea_users.id = ea_services.id_users_provider', 'inner')
                ->where('ea_services.id', $service_id)
                ->get()
                ->row_array();
    }

    public function send_email($key, $mail_arr, $service_type = '', $date = 'some day', $address = 'some place', $left = '1'){
        $ec = $this->_get_email_content($key, $service_type, $date, $address, $left);
        $subject = $ec['subject'];
        $body    = $ec['body'];

        if( ! $this->_sendemail($mail_arr, $subject, $body)){
            $this->_buffer_failed_email($mail_arr, $subject, $body);
        }
    }

    // $SERV_TYPE$, $DATE$, $ADDRESS$, $LEFT$
    protected function _get_email_content($key, $service_type, $date, $address, $left){
        $value = $this->db
            ->select('ea_settings.value')
            ->from('ea_settings')
            ->where('name', $key)
            ->get()
            ->row_array()['value'];
        if(is_null($value)){
            return FALSE;
        }
        
        $ec = json_decode($value, TRUE);
        $subject = $ec['subject'];
        $body = str_replace(array('$SERV_TYPE$', '$DATE$', '$ADDRESS$', '$LEFT$'), 
                            array( $service_type, $date,    $address,    $left), 
                $ec['body']);

        return array('subject'=>$subject, 'body'=>$body);
    }

    public function _sendemail($mail_arr, $subject, $body, $attachment_url = 'null'){
        require_once("vendor/phpmailer/phpmailer/PHPMailerAutoload.php");
        require_once("vendor/phpmailer/phpmailer/class.phpmailer.php");
        require_once("vendor/phpmailer/phpmailer/class.smtp.php");

        $mail = new PHPMailer();

        // $mail->SMTPDebug = 1;

        $mail->isSMTP();
        $mail->isHTML(true);
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = 'ssl';
        $mail->CharSet = 'UTF-8';

        $mail->Host = Config::SMTP_HOST;
        $mail->Port = Config::SMTP_PORT;
        $mail->FromName = Config::SMTP_FROMNAME;
        $mail->Username = Config::SMTP_SMTPUSER;
        $mail->Password = Config::SMTP_PASSWORD;
        $mail->From = Config::SMTP_FROM;

        foreach($mail_arr AS $mail_address){
            $mail->addAddress($mail_address);
        }

        $mail->Subject = $subject;
        $mail->Body = $body;

        if($attachment_url != 'null'){
            $mail->addAttachment($attachment_url);
        }
       
        return $mail->send(); 
    }

    protected function _buffer_failed_email($mail_arr, $subject, $body){

        if(is_null($mail_arr)){
            return;
        }

        $data = array();
        $now_datetimeObj = new DateTime();
        $now = $now_datetimeObj->format('Y-m-d H:i:s');
        $data = [
            'email' => json_encode($mail_arr),
            'subject' => json_encode($subject),
            'email_body' => json_encode($body),
            'timestamp' => $now
       ];

        $this->db->insert('ea_buffer_failed_email', $data);
    }
}
?>