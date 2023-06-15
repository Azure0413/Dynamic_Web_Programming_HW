<?php 
session_start();

if (isset($_SESSION['username'])) {
	if (isset($_POST['message']) && isset($_POST['to_id'])) {
        include '../db.conn.php';
        include('../helpers/user.php');

        $message = $_POST['message'];
        $to_id = $_POST['to_id'];
        $from_id = $_SESSION['user_id'];
        $user = getUser($_SESSION['username'],$conn);

        $sql = "INSERT INTO chats (from_id, to_id, message) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $res  = $stmt->execute([$from_id, $to_id, $message]);

        if ($res) {
            $sql2 = "SELECT * FROM conversations WHERE (user_1=? AND user_2=?) OR (user_2=? AND user_1=?)";
            $stmt2 = $conn->prepare($sql2);
            $stmt2->execute([$from_id, $to_id, $from_id, $to_id]);

            define('TIMEZONE', 'Asia/Taipei');
            date_default_timezone_set(TIMEZONE);

            $time = date("h:i:s a");

            if ($stmt2->rowCount() == 0 ) {
                # insert them into conversations table 
                $sql3 = "INSERT INTO conversations(user_1, user_2) VALUES (?,?)";
                $stmt3 = $conn->prepare($sql3); 
                $stmt3->execute([$from_id, $to_id]);
            }?>
        <img style="width:5%;" src="uploads/<?=$user['p_p']?>" class="rtext align-self-end rounded-circle">
		<p class="rtext align-self-end border b-radius p-2 mb-1">
		    <?=$message?>       	
		</p>
        <small class="d-block"><?=$time?></small> 
    <?php }
  }
}else {
	header("Location: ../../index.php");
	exit;
}