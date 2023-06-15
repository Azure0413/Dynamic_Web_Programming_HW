<?php
session_start();
if(isset($_POST['username']) && isset($_POST['password'])){

    include '../db.conn.php';

    $password = $_POST['password'];
    $username = $_POST['username'];

    if(empty($username)){
        $em = "Username is required";

        header("Location: ../../index.php?error=$em");
    }else if(empty($password)){
        $em = "Password is required";

        header("Location: ../../index.php?error=$em");
    }else{
        $sql = "SELECT * FROM users WHERE username=?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$username]);
        if($stmt->rowCount() === 1){
            $user = $stmt->fetch();

            if($user['username'] === $username){
                if(password_verify($password,$user['password'])){
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['name'] = $user['name'];
                    $_SESSION['user_id'] = $user['user_id'];

                    header("Location: ../../home.php");
                }else{
                    $em = "Incorrect Username or Password";

                    header("Location: ../../index.php?error=$em");
                }
            }else{
                $em = "Incorrect Username or Password";

                header("Location: ../../index.php?error=$em");
            }
        }
    }
}else{
    header("Location: ../../index.php");
    exit;
}