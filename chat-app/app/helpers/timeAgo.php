<?php
define('TIMEZONE', 'Asia/Taipei');
date_default_timezone_set(TIMEZONE);

function last_seen($date_time){
    $timestamp = strtotime($date_time);	
   
    $currentTime = time();
    $timeDiff = $currentTime - $timestamp;
	if ($timeDiff <= 10){
		return "Active";
	}
    if ($timeDiff < 60) { 
        return $timeDiff . " 秒前";
    } elseif ($timeDiff < 3600) { 
        $minutes = floor($timeDiff / 60);
        return $minutes . " 分鐘前";
    } elseif ($timeDiff < 86400) { 
        $hours = floor($timeDiff / 3600);
        return $hours . " 小時前";
    } else { 
        $days = floor($timeDiff / 86400);
        return $days . " 天前";
    }
}