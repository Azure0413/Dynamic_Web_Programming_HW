<?php
    session_start();

    if(isset($_SESSION['username'])){
        include('app/db.conn.php');
        include('app/helpers/user.php');
        include('app/helpers/conversations.php');
        include('app/helpers/timeAgo.php');
        include('app/helpers/last_chat.php');

        $user = getUser($_SESSION['username'],$conn);
        $conversations = getConversation($user['user_id'],$conn);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat APP-HOME</title>
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
    <div class="home-w p-2 w-400 radius-30 shadow">
        <div>
            <div class="d-flex mb-3 p-3 bg-light justify-content-center align-items-center">
                <div class="d-flex align-items-center">
                    <img src="./uploads/<?=$user['p_p']?>" class="w-25 rounded-circle">
                    <h3 class="fs-xs m-2" style="font-size: 2rem;"><?=$user['name']?></h3>
                </div>
                <a href="logout.php" class="btn logout-color">Logout</a>
            </div>
            <div class="input-group mb-3">
                <input type="text"
                       placeholder="Search for..."
                       id="searchText"
                       class="form-control">
                <button class="btn btn-primary search-color" id="searchBtn">
                    <i class="fa fa-search"></i>
                </button>
            </div>
            <ul id="chatList" class="list-group mvh-50 overflow-auto">
                <?php if(!empty($conversations)){ ?>
                    <?php foreach($conversations as $conversation){?>
                        <li class="list-group-item">
                            <a href="chat.php?user=<?=$conversation['username']?>" 
                            class="d-flex justify-content-between align-items-center p-2"
                            style="text-decoration: none;">
                            <div class="d-flex align-items-center">
                                    <img src="./uploads/<?=$conversation['p_p']?>" class="w-10 rounded-circle"
                                        style="width:10%;">
                                    <h3 class="fs-xs m-2" style="font-size: 1.2rem; color:darkslateblue;">
                                        <?=$conversation['name']?><br>
                                        <small class="last-c">
                                            <?php 
                                                echo lastChat($_SESSION['user_id'], $conversation['user_id'], $conn);
                                            ?>
                                        </small>
                                    </h3>
                            </div>
                            <?php
                                 if(last_seen($conversation['last_seen']) == "Active"){?>
                                <div title="online">
                                    <div class="online"></div>
                                </div>
                            <?php }?>
                            </a>
                        </li>
                    <?php }?>
                <?php }else{?>
                    <div class="alert alert-info text-center">
                        <i class="fa fa-comments d-block fs-big" style="font-size:5rem !important;"></i>
                        No messages yet, Start the conversation!
                    </div>
                <?php }?>
            </ul>
        </div>
    </div>
    <p class="copy-right">Copyright © 2023 H54084010 陳冠言.</p>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
    <script>
        $(document).ready(function(){
            //search
            $("#searchText").on("input",function(){
                var searchText = $(this).val();
                if(searchText == "") return;
                $.post("app/ajax/search.php",
                {
                    key: searchText
                },function(data,status){
                    $("#chatList").html(data);
                });
            });

            $("#searchBtn").on("click",function(){
                var searchText = $("#searchText").val();
                if(searchText == "") return;
                $.post("app/ajax/search.php",
                {
                    key: searchText
                },function(data,status){
                    $("#chatList").html(data);
                });
            });

            let lastSeenUpdate = function(){
                $.get("app/ajax/update_last_seen.php");
            }
            lastSeenUpdate();
            setInterval(lastSeenUpdate,10000);
        });
    </script>
</body>
</html>
<?php    
    }else{
        header("Location: index.php");
        exit;
    }
?>