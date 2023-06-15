<?php
    session_start();

    if(isset($_SESSION['username'])){
        include('app/db.conn.php');
        include('app/helpers/user.php');
        include('app/helpers/chat.php');
        include('app/helpers/opened.php');
        include('app/helpers/timeAgo.php');

        if(!isset($_GET['user'])){
            header("Location: home.php");
            exit;
        }
        $chatWith = getUser($_GET['user'],$conn);

        if(empty($chatWith)){
            header("Location: home.php");
            exit;
        }

        $chats = getChats($_SESSION['user_id'], $chatWith['user_id'], $conn);
        opened($chatWith['user_id'],$conn,$chats);
        $user = getUser($_SESSION['username'],$conn);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat APP-Chat</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="icon" href="./img/logo.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="./css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC&family=Rajdhani:wght@600&family=Roboto:wght@100&display=swap" rel="stylesheet">
</head>
<body class="d-flex justify-content-center align-items-center vh-100">
    <nav>
        <h3 class="nav-h3"><img src="./img/nav_logo.png"><strong>Chat with Others</strong></h3>
        <a class="tag-a" href="https://www.istockphoto.com/photos-free?esource=SEM_IS_GO_TW_Tail_EN_DSA2&kw=TW_DSA_Free_DYNAMIC+SEARCH+ADS_&kwid=s_39700068872750149_dc&pcrid=575603355266&utm_medium=cpc&utm_source=GOOGLE&utm_campaign=TW_Tail_EN_DSA2&utm_term=DYNAMIC+SEARCH+ADS&&&&&gad=1&gclid=CjwKCAjw1YCkBhAOEiwA5aN4AS5H2yvHP5plcv2fFjYWWM-ZJKJgeZwXTpBBTGvcDGZdJkj_je_OQBoCpB8QAvD_BwE&gclsrc=aw.ds" target="_blank">
            <img class="search" src="./img/search.png">
            <strong>Picture</strong>
        </a>
        <a href="./contact/index.html"><img class="about" src="./img/about.png"><strong>About me</strong></a>
    </nav>
        <div class="chat-w w-400 shadow p-4 radius-30">
            <a href="home.php" class="fs-4 link-dark">&#8592;</a>
            <div class="d-flex align-items-center">
                <img src="uploads/<?=$chatWith['p_p']?>" class="w-15 rounded-circle">
                <h3 class="display-4 fs-sm m-2"><?=$chatWith['name']?>
                    <br>
                    <div class="d-flex align-items-center" title="online">
                        <?php
                            if(last_seen($chatWith['last_seen']) == "Active"){
                        ?>
                        <div class="online"></div>
                        <small class="d-block p-1">Online</small>
                        <?php }else{?>
                            <small class="d-block p-1">
                                上次登入：
                                <?php echo last_seen($chatWith['last_seen']); ?>
                            </small>
                        <?php }?>
                    </div>
                </h3>
            </div>
            <div id="chatBox" class="shadow-sm p-3 rounded d-flex flex-column mt-2 chat-box">
                <?php if(!empty($chats)){ 
                    foreach($chats as $chat){
                        if($chat['from_id'] == $_SESSION['user_id']){ ?>
                            <img style="width:5%;" src="uploads/<?=$user['p_p']?>" class="rtext align-self-end rounded-circle">
                            <p class="rtext align-self-end border b-radius p-2 mb-1">
                                <?= $chat['message']?>
                            </p>
                            <small class="d-block">
                                    <?=$chat['created_at']?>
                                </small>
                            <br>
                    <?php }else{ ?>
                        <img style="width:5%" src="uploads/<?=$chatWith['p_p']?>" class="rounded-circle">
                            <p class="border b-radius p-2 mb-1 ltext">   
                                <?=$chat['message']?>
                            </p>
                            <small style="width:62%" class="d-block" >
                                    <?=$chat['created_at']?>
                                </small>
                            <br>
                    <?php }
                    }
                    }else{ ?>
                    <div class="alert alert-info text-center">
                        <i class="fa fa-comments d-block fs-big" style="font-size:5rem !important;"></i>
                        You have no messages yet, Let's get in touch!
                    </div>
                <?php }    ?>
            </div>
            <div class="input-group mb-3">
                <textarea id="message" cols="3" class="form-control radius-10 p-chat"></textarea>
                <button id="sendBtn" class="btn radius-10 btn-primary p-chat" style="background-color: darkblue;">
                    <i class="fa fa-paper-plane"></i>
                </button>
            </div>
        </div>
        <p class="copy-right">Copyright © 2023 H54084010 陳冠言.</p>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
    <script>
        var scrollDown = function(){
        let chatBox = document.getElementById('chatBox');
        chatBox.scrollTop = chatBox.scrollHeight;
	    }
        scrollDown();
        $(document).ready(function(){
            $("#sendBtn").on("click", function(){
                message = $("#message").val();
                // alert(message);
                if(message == "") return;
                $.post("app/ajax/insert.php",
                    {
                        message:message,
                        to_id: <?=$chatWith['user_id']?>
                    },function(data,status){
                        $("#message").val("");
                        $("#chatBox").append(data);
                        scrollDown();
                    });
            });
            let lastSeenUpdate = function(){
                $.get("app/ajax/update_last_seen.php");
            }
            lastSeenUpdate();
            setInterval(lastSeenUpdate,10000);
            let fetchData = function(){
                $.post("app/ajax/getMessage.php",
                {
                    id_2: <?=$chatWith['user_id']?>
                },function(data,status){
                        $("#chatBox").append(data);
                        if(data != "") scrollDown();
                    });
            }
            fetchData();
            setInterval(fetchData,500);
        });
        // enter the message
        var input = document.getElementById("message");

        input.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && input != "") {
            event.preventDefault();
            document.getElementById("sendBtn").click();
        }
        });
    </script>
</body>
<?php    
    }else{
        header("Location: index.php");
        exit;
    }
?>