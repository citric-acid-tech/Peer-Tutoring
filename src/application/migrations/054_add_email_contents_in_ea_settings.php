<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_email_contents_in_ea_settings extends CI_Migration {

    public function up(){
        // $SERV_TYPE$, $DATE$, $ADDRESS$, $LEFT$
        $data = array(
            [
                'name' => 'ec_new_appoint_stu',
                'value' => json_encode(array(
                    'subject' => 'Successful appointment',
                    'body' => 'You have booked an appointment $SERV_TYPE$ on $DATE$ at $ADDRESS$. Plz come by on time. And check the details on http://localhost.'))
            ],
            [
                'name' => 'ec_new_appoint_tut',
                'value' => json_encode(array(
                    'subject' => 'You have a new appointment.',
                    'body' => 'Your service $SERV_TYPE$ on $DATE$ has been booked. Plz come by on time. And check the details on http://localhost.'))
            ],
            [
                'name' => 'ec_cancel_appoint_stu',
                'value' => json_encode(array(
                    'subject' => 'Sucessful cancellation',
                    'body' => 'You have canceled an appointment $SERV_TYPE$ on $DATE$ at $ADDRESS$. '))
            ],
            [
                'name' => 'ec_cancel_appoint_tut',
                'value' => json_encode(array(
                    'subject' => 'One of your appointment was canceled',
                    'body' => 'Your service $SERV_TYPE$ on $DATE$ has been canceled. There are still $LEFT$ in this service.'))
            ],
            [
                'name' => 'ec_survey_comple_tut',
                'value' => json_encode(array(
                    'subject' => 'A feedback of your service is received.',
                    'body' => 'Your service $SERV_TYPE$ on $DATE$ has received a feedback. And check the details on http://localhost.'))
            ],
            [
                'name' => 'ec_comsug_comple_stu',
                'value' => json_encode(array(
                    'subject' => 'A feedback of your appointment is received.',
                    'body' => 'Your appointment $SERV_TYPE$ on $DATE$ has received a feedback. And check the details on http://localhost.'))
            ],
            [
                'name' => 'ec_add_tutor_tut',
                'value' => json_encode(array(
                    'subject' => 'You are officially a tutor now.',
                    'body' => 'Hi there! Congrates!! After our consideration. You are officially our tutor now!! And check the details on http://localhost/index.php/tutor.'))
            ],
            [
                'name' => 'ec_edit_service_tut',
                'value' => json_encode(array(
                    'subject' => 'You service has been edited by CLE.',
                    'body' => 'Your service $SERV_TYPE$ on $DATE$ has been edited. And check the details on http://localhost.'))
            ],
            [
                'name' => 'ec_del_service_stu',
                'value' => json_encode(array(
                    'subject' => 'A service was cancelled',
                    'body' => 'We are sorry to tell you that your appointment appointment $SERV_TYPE$ on $DATE$ is cancelled. And check the details on http://localhost.'))
            ]
        );
        $this->db->insert_batch('ea_settings', $data);
    }

    public function down(){
        $this->db->where('name', 'ec_new_appoint_stu');
        $this->db->delete('ea_settings');
        $this->db->where('name', 'ec_new_appoint_tut');
        $this->db->delete('ea_settings');
        $this->db->where('name', 'ec_cancel_appoint_stu');
        $this->db->delete('ea_settings');
        $this->db->where('name', 'ec_cancel_appoint_tut');
        $this->db->delete('ea_settings');
        $this->db->where('name', 'ec_survey_comple_tut');
        $this->db->delete('ea_settings');
        $this->db->where('name', 'ec_comsug_comple_stu');
        $this->db->delete('ea_settings');
        $this->db->where('name', 'ec_add_tutor_tut');
        $this->db->delete('ea_settings');
        $this->db->where('name', 'ec_edit_service_tut');
        $this->db->delete('ea_settings');
        $this->db->where('name', 'ec_del_service_stu');
        $this->db->delete('ea_settings');
    }
}
?>