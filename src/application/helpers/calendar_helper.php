<?php

function get_semester_and_week($date){
    $tmp = new DateTime($date);
    $semester = array();
    $semester = json_decode(get_semester_info_json(), TRUE);
    $year = $tmp->format('Y');

    $Spring_begin = new DateTime($semester[$year]['Spring']['first_Monday']);
    $Spring_last = $semester[$year]['Spring']['last_weeks'];
    $Spring_end = new DateTime($semester[$year]['Spring']['first_Monday']);
    $Spring_end->add(new DateInterval('P' . (7 * $Spring_last) . 'D'));
    
    $Summer_begin = new DateTime($semester[$year]['Summer']['first_Monday']);
    $Summer_last = $semester[$year]['Summer']['last_weeks'];
    $Summer_end = new DateTime($semester[$year]['Summer']['first_Monday']);
    $Summer_end->add(new DateInterval('P' . (7 * $Summer_last) . 'D'));

    $Fall_begin = new DateTime($semester[$year]['Fall']['first_Monday']);
    $Fall_last = $semester[$year]['Fall']['last_weeks'];
    $Fall_end = new DateTime($semester[$year]['Fall']['first_Monday']);
    $Fall_end->add(new DateInterval('P' . (7 * $Fall_last) . 'D'));
    //
    $season = $year . '-' ;
    $weeks = 0;
    $result = array();
    if( ($weeks = in_interval($Spring_begin, $Spring_end, $tmp)) !== FALSE){
        $season .= 'Spring';
        $result = array('semester' => $season, 'weeks'=> $weeks+1);
    }else if( ($weeks = in_interval($Summer_begin, $Summer_end, $tmp)) !== FALSE){
        $season .= 'Summer';
        $result = array('semester' => $season, 'weeks'=> $weeks+1);
    }else if( ($weeks = in_interval($Fall_begin, $Fall_end, $tmp)) !== FALSE){
        $season .= 'Fall';
        $result = array('semester' => $season, 'weeks'=> $weeks+1);
    }else{
        $result = array('semester' => ' ', 'weeks'=> ' ');
    }

    return json_encode($result);
}

function get_semester_info_json(){
    $ci =& get_instance();
    $json = $ci->db->select('value')->from('ea_settings')->where('name', 'semester_json')->get()->row_array()['value'];
    return $json;
}

function in_interval($start, $end, $date){
    $bigger_than_start = $start->diff($date)->format('%R%a') >= 0;
    $smaller_than_end  = $date->diff($end)->format('%R%a') >= 0;
    if( ! ($bigger_than_start && $smaller_than_end) ){
        return FALSE;
    }
    //
    $days = $start->diff($date)->format('%a');
    return floor($days / 7);
}
?>