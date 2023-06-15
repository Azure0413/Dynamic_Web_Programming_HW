<?php
    session_start();

    if(!isset($_SESSION['username'])){
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat-app - Sign Up</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="./css/style.css">
    <link rel="icon" href="./img/logo.png">
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
    <div class="sign-w w-400 p-5 shadow b-radius">
        <form method="post" action="app/http/signup.php" enctype="multipart/form-data">
            <div class="d-flex justify-content-center align-items-center flex-column">
                <img src="./img/logo.png" class="w-25">
                <h3 class="display-4 fs-1 text-center">Sign Up</h3>
            </div>
            <?php if(isset($_GET['error'])){ ?>
            <div class="alert alert-warning" role="alert">
                 <?php echo htmlspecialchars($_GET['error'])?>
            </div>
            <?php  }
                if(isset($_GET['name'])){
                    $name = $_GET['name'];
                }else $name = '';

                if(isset($_GET['username'])){
                    $username = $_GET['username'];
                }else $username = '';
            ?>
            <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" name="name" value="<?=$name?>" class="form-control radius-10">
            </div>
            <div class="mb-3">
                <label class="form-label">User name</label>
                <input type="text" class="form-control radius-10" value="<?=$username?>" name="username">
            </div>
            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control radius-10" name="password">
            </div>
            <div class="mb-3">
                <label class="form-label">Profile Picture</label>
                <input type="file" class="form-control" name="pp">
            </div>
            <button type="submit" class="btn btn-primary btn-color">Sign Up</button>
            <a href="index.php" style="position:relative; top: 0.15rem;left:0.2rem">Login</a>
    </form>
    </div>
    <p class="copy-right">Copyright © 2023 H54084010 陳冠言.</p>
</body>
</html>
<?php    
    }else{
        header("Location: home.php");
        exit;
    }
?>