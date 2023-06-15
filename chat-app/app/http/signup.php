<?php

if(isset($_POST['username']) && isset($_POST['password']) && isset($_POST['name'])){

    include '../db.conn.php';
    $name = $_POST['name'];
    $password = $_POST['password'];
    $username = $_POST['username'];

    $data = 'name='.$name.'&username='.$username;

    if(empty($name)){
        $em = "Name is required";

        header("Location: ../../signup.php?error=$em");
        exit;
    }else if(empty($username)){
        $em = "Username is required";

        header("Location: ../../signup.php?error=$em&$data");
        exit;
    }else if(empty($password)){
        $em = "Password is required";

        header("Location: ../../signup.php?error=$em&$data");
        exit;
    }else{
        $sql = "SELECT username FROM users
                WHERE username=?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$username]);

        if($stmt->rowCount()>0){
            $em = "The username ($username) is taken";
            header("Location: ../../signup.php?error=$em&$data");
            exit;
        }else{
            if(isset($_FILES['pp'])){
                $img_name = $_FILES['pp']['name'];
                $tmp_name = $_FILES['pp']['tmp_name'];
                $error = $_FILES['pp']['error'];

                if($error === 0){
                    $img_ex = pathinfo($img_name, PATHINFO_EXTENSION);

                    $img_ex_lc = strtolower($img_ex);

                    $allowed_exs = array("jpg","jpeg","png");

                    if(in_array($img_ex_lc,$allowed_exs)){
                        $new_img_name = $username.'.'.$img_ex_lc;
                        $img_upload_path = '../../uploads/'.$new_img_name;

                        move_uploaded_file($tmp_name,$img_upload_path);
                    }else{
                        $em = "You can't upload the file of this type!";
                        header("Location: ../../signup.php?error=$em&$data");
                        exit;
                    }
                }
            }

            $password = password_hash($password,PASSWORD_DEFAULT);
            if(isset($new_img_name)){
                $sql = "INSERT INTO users(name, username, password, p_p)
                        VALUES (?,?,?,?)";
                $stmt = $conn -> prepare($sql);
                $stmt->execute([$name,$username,$password,$new_img_name]);
            }else{
                $sql = "INSERT INTO users(name, username, password)
                        VALUES (?,?,?)";
                $stmt = $conn -> prepare($sql);
                $stmt->execute([$name,$username,$password]);
            }
            $sm = "Account created successfully";
            header("Location: ../../index.php?success=$sm");
            exit;
        }
    }
}else{
    header("Location: ../../signup.php");
    exit;
}