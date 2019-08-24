<?php

class Data_generator extends CI_Controller{
    
    public function __construct(){
        parent::__construct();
        $this->load->model('students_model');
        $this->load->model('admin_model');
        $this->load->model('general_model');
        $this->load->model('tutors_model');
    }

    public function index(){
        echo 'Don\'t close the page until it finishes.';

        //generate_student_appointments($date, $status)
        $this->generate_users();
        $this->generate_services(); 
        $this->generate_tutor_appointments();
        echo 'Finshed';       
    }

    public function generate_tutor_appointments(){
        $user_id = 1;
        $name = 
            $this->db->select('CONCAT(first_name, \' \', last_name) AS name')
                ->from('ea_users')->get()->row_array()['name'];
        $serv_arr = $this->students_model->get_available_appointments('ALL', $name);

        $students_arr = $this->general_model->get_all_students();
        $num_students = sizeof($students_arr);

        $num_serv = sizeof($serv_arr);

        $remark_arr = ['Favorite', 'Important', 'Mid Prov', 'WTF'];

        // Generate 25 appointments
        for($i = 0; $i < 25; $i++){
            $service_id = $serv_arr[mt_rand(0, $num_serv - 1)]['service_id'];
            $note = mt_rand(0, 3) < 1 ? 'Da lao bring bring me.' : 'null';
            $remark = $remark_arr[mt_rand(0, 3)];
            $this->students_model->new_appointment($students_arr[mt_rand(0, $num_students - 1)]['id'], $service_id, $note, $remark);
        }
        echo 'Generate appointments successfully. <br />';
    }

    public function generate_student_appointments($date, $status){

        $user_id = 1;
        $remark_arr = ['Favorite', 'Important', 'Mid Prov', 'WTF', 'Good', 'Recommended', 'Girls here'];
        // Make not started appointments
        $tutors_arr = $this->students_model->get_available_tutors_date_selection($date);
        $num_tutor = sizeof($tutors_arr);

        for($i = 0; $i < $num_tutor; $i++){
            $aval_apps_arr = $this->students_model->get_available_appointments('ALL', $tutors_arr[$i]['tutor_name']);
            foreach($aval_apps_arr AS $row){
                $note = mt_rand(0, 5) < 1 ? 'Da lao bring bring me.' : 'I want to learn some nb stuff.';
                $remark = $remark_arr[mt_rand(0, 6)];
                $app_id = $this->students_model->new_appointment($user_id, $row['service_id'], $note, $remark);
                $this->tutors_model->modify_status($app_id, $status);
            }
        }
        echo 'Generate appointments successfully. <br />';
    }

    public function generate_services(){
        $this->load->model('general_model');
        $this->load->model('admin_model');

        $this->load->database();
        $this->db->query('SET FOREIGN_KEY_CHECKS=0;');
        $this->db->query('TRUNCATE TABLE ea_services;');
        $this->db->query('SET FOREIGN_KEY_CHECKS=1;');

        $tutors_arr = $this->general_model->get_all_tutors();
        $num_tutor = sizeof($tutors_arr);
        $tutors_arr[$num_tutor]['name'] = 
            $this->db->select('CONCAT(first_name, \' \', last_name) AS name')
                ->from('ea_users')->get()->row_array()['name'];
        $num_tutor++;

        $service_types_arr = $this->general_model->get_all_service_types(); 
        $num_type = sizeof($service_types_arr);

        for($i = 0; $i < $num_tutor; $i++){

            for($o = 0; $o < 7; $o++){
                $date = '2019-8-0' . (5+$o);
                $rand = mt_rand(8,20);
                $start_time = $rand. ':00';
                $end_time = ($rand + 1) . ':30';
                $service_type = $service_types_arr[$i % $num_type]['name'];
                $tutor_name = $tutors_arr[$i]['name'];
                $address = 'XINYUAN';
                $capacity = mt_rand(3,10);
                $service_description = 'test desc';
                $this->admin_model->new_service($date, $start_time, $end_time, $service_type, $tutor_name,
                    $address, $capacity, $service_description);
            }
            $services_arr = $this->admin_model->filter_services($tutor_name, '2019-Fall', 1);

            $services_id_arr = array();
            $k = 0;
            foreach($services_arr AS $row){
                $services_id_arr[$k++] = $row['id'];
            }

            $semester = '2019-Fall';
            $services_id = $services_id_arr;
            $week = 1;
            $this->admin_model->schedule_current_schema_to_all_weeks($tutor_name, $semester, $services_id, $week);
        }
        echo 'Generate services successfully. <br />';
    }

    public function generate_users(){
        $this->load->database();
        $this->db->query('SET FOREIGN_KEY_CHECKS=0;');
        $this->db->query('TRUNCATE TABLE ea_users;');
        $this->db->query('SET FOREIGN_KEY_CHECKS=1;');

        $this->generate_tutors();
        $this->generate_students();
    }

    public function generate_tutors(){

        

        // 15 chinese
        for($i = 0; $i < 15; $i++){
            $this->students_model->new_student(
                //first_name 
                  $this->get_first_name_cn()   
                //last_name            
                , $this->get_last_name_cn()          
                //$email   
                , $this->get_last_name_en() . mt_rand(0, 999) . '@' . mt_rand(0, 999) . '.' . 'com.cn'   
                //$phone_number         
                , '1' . mt_rand(0, 99) . mt_rand(0, 999) . mt_rand(0, 999) . mt_rand(0, 999)
                //$id_roles 
                , 2
            );
        }

        // 31 man with english name
        for($i = 0; $i < 31; $i++){
            $this->students_model->new_student(
                //first_name 
                  $this->get_first_name_en()   
                //last_name            
                , $this->get_last_name_en()          
                //$email   
                , $this->get_last_name_en() . mt_rand(0, 999) . '@' . mt_rand(0, 999) . '.' . 'com.cn'   
                //$phone_number         
                , '1' . mt_rand(0, 99) . mt_rand(0, 999) . mt_rand(0, 999) . mt_rand(0, 999)
                //$id_roles 
                , 2
            );
        }
        echo 'Generate tutors successfully.<br />';
    }

    public function generate_students(){
        
        // 100 chinese
        for($i = 0; $i < 100; $i++){
            $this->students_model->new_student(
                //first_name 
                  $this->get_first_name_cn()   
                //last_name            
                , $this->get_last_name_cn()          
                //$email   
                , $this->get_last_name_en() . mt_rand(0, 999) . '@' . mt_rand(0, 999) . '.' . 'com.cn'   
                //$phone_number         
                , '1' . mt_rand(0, 99) . mt_rand(0, 999) . mt_rand(0, 999) . mt_rand(0, 999)
                //$id_roles 
                , 3
            );
        }

        // 125 man with english name
        for($i = 0; $i < 125; $i++){
            $this->students_model->new_student(
                //first_name 
                  $this->get_first_name_en()   
                //last_name            
                , $this->get_last_name_en()          
                //$email   
                , $this->get_last_name_en() . mt_rand(0, 999) . '@' . mt_rand(0, 999) . '.' . 'com.cn'   
                //$phone_number         
                , '1' . mt_rand(0, 99) . mt_rand(0, 999) . mt_rand(0, 999) . mt_rand(0, 999)
                //$id_roles 
                , 3
            );
        }

        echo 'Generate students successfully.<br />';
    }
    
    public function get_first_name_cn(){
        $arr = array('赵','钱','孙','李','周','吴','郑','王','冯','陈','褚','卫','蒋','沈','韩','杨','朱','秦','尤','许','何','吕','施','张','孔','曹','严','华','金','魏','陶','姜','戚','谢','邹',
            '喻','柏','水','窦','章','云','苏','潘','葛','奚','范','彭','郎','鲁','韦','昌','马');

        $num = count($arr);

        return $arr[mt_rand(0, $num - 1)];
    }
    
    public function get_last_name_cn(){

        $arr = array('伟','刚','勇','毅','俊','峰','强','军','平','保','东','文','辉','力','明','永','健','世','广','志','义','兴','良','海','山','仁','波','宁','贵','福','生','龙','元','全'
        ,'国','胜','学','祥','才','发','武','新','利','清','飞','彬','富','顺','信','子','杰','涛','昌','成','康','星','光','天','达','安','岩','中','茂','进','林','有','坚','和','彪','博','诚'
        ,'先','敬','震','振','壮','会','思','群','豪','心','邦','承','乐','绍','功','松','善','厚','庆','磊','民','友','裕','河','哲','江','超','浩','亮','政','谦','亨','奇','固','之','轮','翰'
        ,'朗','伯','宏','言','若','鸣','朋','斌','梁','栋','维','启','克','伦','翔','旭','鹏','泽','晨','辰','士','以','建','家','致','树','炎','德','行','时','泰','盛','雄','琛','钧','冠','策'
        ,'腾','楠','榕','风','航','弘','秀','娟','英','华','慧','巧','美','娜','静','淑','惠','珠','翠','雅','芝','玉','萍','红','娥','玲','芬','芳','燕','彩','春','菊','兰','凤','洁','梅','琳'
        ,'素','云','莲','真','环','雪','荣','爱','妹','霞','香','月','莺','媛','艳','瑞','凡','佳','嘉','琼','勤','珍','贞','莉','桂','娣','叶','璧','璐','娅','琦','晶','妍','茜','秋','珊','莎'
        ,'锦','黛','青','倩','婷','姣','婉','娴','瑾','颖','露','瑶','怡','婵','雁','蓓','纨','仪','荷','丹','蓉','眉','君','琴','蕊','薇','菁','梦','岚','苑','婕','馨','瑗','琰','韵','融','园'
        ,'艺','咏','卿','聪','澜','纯','毓','悦','昭','冰','爽','琬','茗','羽','希','欣','飘','育','滢','馥','筠','柔','竹','霭','凝','晓','欢','霄','枫','芸','菲','寒','伊','亚','宜','可','姬'
        ,'舒','影','荔','枝','丽','阳','妮','宝','贝','初','程','梵','罡','恒','鸿','桦','骅','剑','娇','纪','宽','苛','灵','玛','媚','琪','晴','容','睿','烁','堂','唯','威','韦','雯','苇','萱'
        ,'阅','彦','宇','雨','洋','忠','宗','曼','紫','逸','贤','蝶','菡','绿','蓝','儿','翠','烟');

        $num = count($arr);

        $rtn = $arr[mt_rand(0, $num - 1)] .( mt_rand(0, 3) < 1 ? '' : $arr[mt_rand(0, $num - 1)]);

        return $rtn;
    }

    public function get_first_name_en(){
        $arr = array('Christopher', 'Ryan', 'Ethan', 'John', 'Zoey', 'Sarah', 'Michelle', 'Peter', 'David', 'Jason', 'Natasha', 'Nea', 'Eamon',
        '');

        $num = count($arr);

        return $arr[mt_rand(0, $num - 1)];
    }

    public function get_last_name_en(){
        $arr = array('Hunter', 'Farys', 'Jop', 'Gorid', 'Malesa', 'Harte', 'Corbo', 'Wayne', 'Derozan', 'Goodman', 'Herd', 'McKenzie', 'Patel',
        'Taylor', 'West', 'Westwood', 'Wikinson', 'Cox', 'Shinoda', 'Hanai', 'Joseph', 'Clinton', 'Bennington', 'Smith', 'Thompson', 'Gallegos',
        'Blackburn', 'Gibson', 'Belson', 'Terrel', 'Rocha', 'Ross', 'Lucas', 'Cline', 'Ronie', 'Greenkeep', 'Mercer', 'Hull', 'Oliver',
        'Wolf', 'Bishop', 'Pope', 'Mcgee', 'Simon', 'Deadfeather', 'Morris', 'Winters', 'Donovan', 'Sullivan');

        $num = count($arr);

        return $arr[mt_rand(0, $num - 1)];
    }

}

?>
