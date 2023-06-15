//H54084010 陳冠言 第4次作業 5/17 H54084010 陳冠言 The Fourth Homework 5/17
let bankerCard = document.querySelector(".banker-card");//莊家
let playerCard = document.querySelector(".player-card");//玩家

let tips = document.querySelector(".tips"); //提示字元
let dealBtn = document.querySelector(".deal"); // 開始
let table = document.querySelector("#tbody"); //紀錄表格

let operation = document.querySelector(".operation");   //四個功能按鈕
let operationBtns = operation.querySelectorAll("button");//四個功能按钮

let playerCardDouble = document.querySelector(".player-card-double");//玩家double
let insuranceBtn = document.querySelector(".insurance");//投降
let cheat = document.querySelector(".cheat"); //作弊

let money = document.querySelector(".money");       //四種籌碼
let moneyBtns = document.querySelectorAll(".operation button"); //四種籌碼的按钮
let addBet = document.querySelector(".add-bet");   //增加新增的籌碼
let addBetBtns = addBet.querySelectorAll("button");//新增籌碼的按钮

let bet_money = document.querySelector(".bet_money"); //下注
let balance_money = document.querySelector(".balance_money");  //餘額

var bet = 0;
var balance = 100;
var n = 0; //回合數
var game_result = [];
var player_result = [];
var banker_result = [];
var chips_record = [];

var PLAYER_INITIAL_BALANCE = 100;
var firstCardsFinished = false;
var gameover_or_not = false;
var playing_time = [];

localStorage.removeItem('playTime');
sessionStorage.removeItem('playTime');
localStorage.removeItem('player_result');
sessionStorage.removeItem('player_result');
localStorage.removeItem('banker_result');
sessionStorage.removeItem('banker_result');
localStorage.removeItem('game_result');
sessionStorage.removeItem('game_result');
localStorage.removeItem('chipRecord');
sessionStorage.removeItem('chipRecord');
localStorage.removeItem('sortedResult');
sessionStorage.removeItem('sortedResult');

var cards = ['11','12','13','14','15','16','17','18','19','20','1a','1b','1c'
            ,'21','22','23','24','25','26','27','28','29','30','2a','2b','2c'
            ,'31','32','33','34','35','36','37','38','39','40','3a','3b','3c'
            ,'41','42','43','44','45','46','47','48','49','50','4a','4b','4c'
            ,'unknown'];
/*player的設定 */
function PlayerClass() {
    this.cards = [];
}
PlayerClass.prototype.getPoint = function(mycards) {
    let i;
    let len = mycards.length;
    let sum = 0;
    let is_A = true;

    for(i = 0; i < len; i++) {
        sum += transformToPoint(mycards[i], is_A);
    }
    if(sum <= 21) {
        return sum;
    } else {
        sum = 0;
        for(i = 0; i < len; i++) {
            sum += transformToPoint(mycards[i], !is_A);
        }
        return sum;
    }
};
function Player(bet, balance) {
    PlayerClass.call(this);

    this.bet = bet;
    this.balance = balance;
    this.cardsCopy = [];        //split的array
}

/*莊家的設定 */
function Banker() {
    PlayerClass.call(this);
}
Banker.prototype = new PlayerClass();
Banker.prototype.constructor = Banker;

Player.prototype = new PlayerClass();
Player.prototype.constructor = Player;

//player and banker
var player = new Player(0, PLAYER_INITIAL_BALANCE);
var banker = new Banker();

//提示字元，用於告知使用者相關訊息
function showTips(msg) {
    tips.innerHTML = msg;
    tips.classList.add("fadeIn");
    setTimeout(function() {
            tips.classList.remove("fadeIn");
            tips.classList.add("fadeOut");
        },100);
    setTimeout(function() {
            tips.classList.remove("fadeOut");
        },3000);
}

//遊戲執行
(function() {
    var array = new Array(52); //存放牌
    //隨機發牌
    function getCardIndex() {
        var len = array.length;
        var index = Math.floor(Math.random() * len);
        var num = array[index];
        array.splice(index, 1);
        return num;
    }

    //初始化
    function init() {
        player.cards = [];
        player.cardsCopy = [];
        banker.cards = [];
        firstCardsFinished = false;
        player.bet = 0;
        bankerCard.innerHTML = '';
        playerCard.innerHTML = '';
        playerCardDouble.innerHTML = '';
        addBet.innerHTML = '';
        insuranceBtn.style.display = 'none';
        operation.style.display = 'none';
        tips.style.opacity = '0';
        updateBetBalance();
        money.addEventListener('click', addBetFunc);
        addBet.addEventListener('click', removeBetFunc);
        money.style.display = 'block';
        //提醒玩家時間
        remindUser = setInterval("alert('注意遊戲時間~')",15000);
        for(var i = 0; i < 52; i++) {//卡牌編號
            array[i] = i;
        }
    }
    init();

    //匯入圖片
    function showCard(myCards) {
        var i,
            len = myCards.length,
            img='';
        for(i = 0; i < len; i++) {
            img += ('<img src="images/'+ cards[myCards[i]] +'.JPG" style="margin-left: '+ i*6 +'em;" alt="card">')
        }
        return img;
    }

    cheat.addEventListener('click', cheat_player);
    // 作弊
    function cheat_player() {
        //防止user繼續下注
        if(player.bet) {
            //發兩張牌
            var item1 = [0,13,26,39]; 
            var item2 = [9,10,11,12,22,23,24,25,35,36,37,38,48,49,50,51]; 
            var item3 = [1,2,3,4,5,6,7,8,9,10,11,12,
                        21,22,23,24,25,27,28,29,30,
                        31,32,33,34,35,36,37,38,48,49,50,51];
            banker.cards.push(item1[Math.floor(Math.random()*item1.length)]);
            banker.cards.push(item2[Math.floor(Math.random()*item2.length)]);
 
            player.cards.push(item3[Math.floor(Math.random()*item3.length)]);
            player.cards.push(item3[Math.floor(Math.random()*item3.length)]);

            bankerCard.innerHTML = '<img src="images/'+ cards[banker.cards[0]] +'.JPG" alt="card"><img src="images/unknow.JPG" style="margin-left: 1em" alt="card">';
            
            playerCard.innerHTML = showCard(player.cards);

            //顯示按鈕
            operation.style.display = 'block';
            operationBtns[1].style.display = 'inline-block';
            operationBtns[2].style.display = 'inline-block';
            operationBtns[3].style.display = 'inline-block';
            money.style.display = 'none';
            cheat.style.display = 'none';

            operationBtns[0].style.display = 'none';
            cheat.removeEventListener('click', cheat_player);
            dealBtn.innerHTML = player.getPoint(player.cards);
            addBet.removeEventListener('click', removeBetFunc);

            operationBtns[2].addEventListener('click', hit);
            operationBtns[3].addEventListener('click', stand);

            //判断player有兩張相同數值的牌時可分牌
            if(transformToPoint(player.cards[0], false) === transformToPoint(player.cards[1], false)) {
                operationBtns[0].style.display = 'inline-block'; 
                operationBtns[0].addEventListener('click', splitCard);
            }

            //player加倍
            operationBtns[1].addEventListener('click', doubleCard);

            //投降
            insuranceBtn.style.display = 'block';
            insuranceBtn.addEventListener('click', insurance);
        } else {
            showTips("尚未下注");
        }
        
        //拿牌，且判斷有無過五關
        function hit() { 
            insuranceBtn.removeEventListener('click', insurance);
            insuranceBtn.style.display = 'none';
            operationBtns[0].style.display = 'none';
            operationBtns[0].removeEventListener('click', splitCard);
            operationBtns[1].style.display = 'none';
            operationBtns[1].removeEventListener('click', doubleCard);

            player.cards.push(getCardIndex());
            playerCard.innerHTML = showCard(player.cards);
            dealBtn.innerHTML = player.getPoint(player.cards);
            if(player.getPoint(player.cards) > 21) {  //判斷超過21點
                showTips("超過21點！！！");
                operationBtns[2].removeEventListener('click', hit);
                operationBtns[3].removeEventListener('click', stand);
                Gameover();
                function myrefresh(){
                    window.location.reload();
                }
                setTimeout(myrefresh,5000);
            }else if(player.cards.length == 5){ //過五關
                showTips("過五關！！！");
                operationBtns[2].removeEventListener('click', hit);
                operationBtns[3].removeEventListener('click', stand);
                Gameover_special_case(false);
                function myrefresh(){
                    window.location.reload();
                }
                setTimeout(myrefresh,5000);
            }
        }

        function stand() {
            insuranceBtn.removeEventListener('click', insurance);
            operationBtns[0].removeEventListener('click', splitCard); 
            operationBtns[1].removeEventListener('click', doubleCard);
            operationBtns[2].removeEventListener('click', hit);
            operationBtns[3].removeEventListener('click', stand);
            Gameover();
            function myrefresh(){
                window.location.reload();
            }
            setTimeout(myrefresh,5000);
        }

        //投降
        function insurance() {
            player.balance += (player.bet/2);
            insuranceBtn.removeEventListener('click', insurance);
            operationBtns[0].removeEventListener('click', splitCard); 
            operationBtns[1].removeEventListener('click', doubleCard);
            operationBtns[2].removeEventListener('click', hit);
            operationBtns[3].removeEventListener('click', stand);
            setTimeout(function() {showTips("以投降，請按again至下一輪")}, 300);
            Gameover_special_case(true);
            function myrefresh(){
                window.location.reload();
            }
            setTimeout(myrefresh,5000);
        }

        function doubleCard() {
            insuranceBtn.style.display = 'none'; 
            insuranceBtn.removeEventListener('click', insurance);
            operationBtns[0].removeEventListener('click', splitCard);  
            operationBtns[1].removeEventListener('click', doubleCard);
            operationBtns[2].removeEventListener('click', hit);
            operationBtns[3].removeEventListener('click', stand);

            player.cards.push(getCardIndex());
            playerCard.innerHTML = showCard(player.cards);
            dealBtn.innerHTML = player.getPoint(player.cards);

            if(player.getPoint(player.cards) > 21) {
                showTips("超過21點了！");
            }
            Gameover();
            function myrefresh(){
                window.location.reload();
            }
            setTimeout(myrefresh,5000);
        }

        //split的操作
        function splitHitCard(myCards) {
            function splitHit() {
                myCards.push(getCardIndex());
                var whichCard = (myCards === player.cards) ? playerCard : playerCardDouble;
                whichCard.innerHTML = showCard(myCards);
                dealBtn.innerHTML = player.getPoint(myCards);

                if(player.getPoint(myCards) > 21) {   //如果超過21點即切換
                    operationBtns[2].removeEventListener('click', splitHit);
                    operationBtns[3].removeEventListener('click', splitStand);
                    firstCardsFinished = true;
                    if(myCards === player.cardsCopy) {  //如果是第二副牌就直接结束
                        Gameover();
                        function myrefresh(){
                            window.location.reload();
                        }
                        setTimeout(myrefresh,5000);
                    }
                }
            }
            operationBtns[2].addEventListener('click', splitHit);

            //確認牌並切換
            function splitStand() {
                operationBtns[2].removeEventListener('click', splitHit);
                operationBtns[3].removeEventListener('click', splitStand);
                firstCardsFinished = true;
                if(myCards === player.cardsCopy) {  //如果是第二副牌就直接结束
                    Gameover();
                    function myrefresh(){
                        window.location.reload();
                    }
                    setTimeout(myrefresh,5000);
                }
            }
            operationBtns[3].addEventListener('click', splitStand);
        }

        //split
        function splitCard() {
            insuranceBtn.style.display = 'none'; 
            insuranceBtn.removeEventListener('click', insurance);
            operationBtns[0].style.display = 'none'; 
            operationBtns[0].removeEventListener('click', splitCard);
            operationBtns[1].style.display = 'none'; 
            operationBtns[1].removeEventListener('click', doubleCard);
            operationBtns[2].removeEventListener('click', hit);
            operationBtns[3].removeEventListener('click', stand);

            if(player.balance < player.bet) {
                showTips("餘額不足，不能加倍！");
            } else {
                var temp = player.cards.splice(1, 1);
                player.cardsCopy.push(temp);
                playerCard.style.left = '3em'; 
                playerCard.innerHTML = showCard(player.cards);
                playerCardDouble.innerHTML = showCard(player.cardsCopy);

                player.balance -= player.bet;  //加倍
                updateBetBalance();

                showTips("目前為第一副牌！");
                splitHitCard(player.cards);
                (function secondCard() {
                    var i;
                    i = setTimeout(secondCard, 50); 
                    if(firstCardsFinished) {
                        clearTimeout(i);
                        showTips("目前為第二副牌！");
                        splitHitCard(player.cardsCopy);
                    }
                })();
            }
        }
        var msg = confirm("考量到遊戲體驗，作弊模式僅限使用一次，結束後5秒會重新載入！");
    }

    /*------------------------------正常執行--------------------------------------*/
    function run() {
        //防止user繼續下注
        if(player.bet) {
            //發兩張牌
            banker.cards.push(getCardIndex());
            banker.cards.push(getCardIndex());

            player.cards.push(getCardIndex());
            player.cards.push(getCardIndex());

            bankerCard.innerHTML = '<img src="images/'+ cards[banker.cards[0]] +'.JPG" alt="card"><img src="images/unknow.JPG" style="margin-left: 1em" alt="card">';
            
            playerCard.innerHTML = showCard(player.cards);

            //顯示按鈕
            operation.style.display = 'block';
            operationBtns[1].style.display = 'inline-block';
            operationBtns[2].style.display = 'inline-block';
            operationBtns[3].style.display = 'inline-block';
            money.style.display = 'none';
            cheat.style.display = 'none';

            operationBtns[0].style.display = 'none';
            dealBtn.removeEventListener('click', run);
            dealBtn.innerHTML = player.getPoint(player.cards);
            addBet.removeEventListener('click', removeBetFunc);

            operationBtns[2].addEventListener('click', hit);
            operationBtns[3].addEventListener('click', stand);

            //判断player有兩張相同數值的牌時可分牌
            if(transformToPoint(player.cards[0], false) === transformToPoint(player.cards[1], false)) {
                operationBtns[0].style.display = 'inline-block'; 
                operationBtns[0].addEventListener('click', splitCard);
            }

            //player加倍
            operationBtns[1].addEventListener('click', doubleCard);

            //投降
            insuranceBtn.style.display = 'block';
            insuranceBtn.addEventListener('click', insurance);
        } else {
            showTips("尚未下注");
        }

        function hit() {
            insuranceBtn.removeEventListener('click', insurance);
            insuranceBtn.style.display = 'none';
            operationBtns[0].style.display = 'none';
            operationBtns[0].removeEventListener('click', splitCard);
            operationBtns[1].style.display = 'none';
            operationBtns[1].removeEventListener('click', doubleCard);

            player.cards.push(getCardIndex());
            playerCard.innerHTML = showCard(player.cards);
            dealBtn.innerHTML = player.getPoint(player.cards);
            if(player.getPoint(player.cards) > 21) {  //判斷超過21點
                showTips("超過21點！！！");
                operationBtns[2].removeEventListener('click', hit);
                operationBtns[3].removeEventListener('click', stand);
                Gameover();
            }else if(player.cards.length == 5){
                showTips("過五關！！！");
                operationBtns[2].removeEventListener('click', hit);
                operationBtns[3].removeEventListener('click', stand);
                Gameover_special_case(false);
            }
        }

        function stand() {
            insuranceBtn.removeEventListener('click', insurance);
            operationBtns[0].removeEventListener('click', splitCard); 
            operationBtns[1].removeEventListener('click', doubleCard);
            operationBtns[2].removeEventListener('click', hit);
            operationBtns[3].removeEventListener('click', stand);
            Gameover();
        }

        function insurance() {
            player.balance += (player.bet/2);
            insuranceBtn.removeEventListener('click', insurance);
            operationBtns[0].removeEventListener('click', splitCard); 
            operationBtns[1].removeEventListener('click', doubleCard);
            operationBtns[2].removeEventListener('click', hit);
            operationBtns[3].removeEventListener('click', stand);
            setTimeout(function() {showTips("以投降，請按again至下一輪")}, 300);
            Gameover_special_case(true);
        }

        function doubleCard() {
            insuranceBtn.style.display = 'none'; 
            insuranceBtn.removeEventListener('click', insurance);
            operationBtns[0].removeEventListener('click', splitCard);  
            operationBtns[1].removeEventListener('click', doubleCard);
            operationBtns[2].removeEventListener('click', hit);
            operationBtns[3].removeEventListener('click', stand);

            player.cards.push(getCardIndex());
            playerCard.innerHTML = showCard(player.cards);
            dealBtn.innerHTML = player.getPoint(player.cards);

            if(player.getPoint(player.cards) > 21) {
                showTips("超過21點了！");
            }
            Gameover();
        }

        //split的操作
        function splitHitCard(myCards) {
            function splitHit() {
                myCards.push(getCardIndex());
                console.log(myCards);
                var whichCard = (myCards === player.cards) ? playerCard : playerCardDouble;
                whichCard.innerHTML = showCard(myCards);
                dealBtn.innerHTML = player.getPoint(myCards);

                if(player.getPoint(myCards) > 21) {   //如果超過21點即切換
                    operationBtns[2].removeEventListener('click', splitHit);
                    operationBtns[3].removeEventListener('click', splitStand);
                    firstCardsFinished = true;
                    if(myCards === player.cardsCopy) {  //如果是第二副牌就直接结束
                        Gameover();
                    }
                }
            }
            operationBtns[2].addEventListener('click', splitHit);

            //確認牌並切換
            function splitStand() {
                operationBtns[2].removeEventListener('click', splitHit);
                operationBtns[3].removeEventListener('click', splitStand);
                firstCardsFinished = true;
                if(myCards === player.cardsCopy) {  //如果是第二副牌就直接结束
                    Gameover();
                }
            }
            operationBtns[3].addEventListener('click', splitStand);
        }

        //split
        function splitCard() {
            insuranceBtn.style.display = 'none'; 
            insuranceBtn.removeEventListener('click', insurance);
            operationBtns[0].style.display = 'none'; 
            operationBtns[0].removeEventListener('click', splitCard);
            operationBtns[1].style.display = 'none'; 
            operationBtns[1].removeEventListener('click', doubleCard);
            operationBtns[2].removeEventListener('click', hit);
            operationBtns[3].removeEventListener('click', stand);

            if(player.balance < player.bet) {
                showTips("餘額不足，不能加倍！");
            } else {
                var temp = player.cards.splice(1, 1);
                player.cardsCopy.push(temp);
                playerCard.style.left = '3em'; 
                playerCard.innerHTML = showCard(player.cards);
                playerCardDouble.innerHTML = showCard(player.cardsCopy);

                player.balance -= player.bet;  //加倍
                updateBetBalance();

                showTips("目前為第一副牌！");
                splitHitCard(player.cards);
                (function secondCard() {
                    var i;
                    i = setTimeout(secondCard, 50); 
                    if(firstCardsFinished) {
                        clearTimeout(i);
                        showTips("目前為第二副牌！");
                        splitHitCard(player.cardsCopy);
                    }
                })();
            }
        }
    }
    dealBtn.addEventListener('click', run); //拿牌

    //遊戲結束計算點數
    function Gameover() {
        n = n + 1;
        gameover_or_not = true;
        chips_record.push(player.bet);
        insuranceBtn.style.display = 'none';
        operationBtns[0].style.display = 'none';
        operationBtns[1].style.display = 'none';
        operationBtns[2].style.display = 'none';
        operationBtns[3].style.display = 'none';

        let row = document.createElement('tr');
        let round = document.createElement('td');
        round.innerHTML = n;
        
        let playP = document.createElement('td');
        let bankerP = document.createElement('td');
        let tie = document.createElement('td');

        let playR = document.createElement('td');
        let bankerR = document.createElement('td');
        let temp_p = [];
        for(let i=0;i<player.cards.length;i++){
            temp_p.push(transformToName(player.cards[i]));
        }
        playR.innerHTML = temp_p;
        var temp_p_new = "["+temp_p+"]";
        player_result.push(temp_p_new);
        
        (function bankerDeal() {
            var i = setTimeout(bankerDeal, 50);
            console.log(banker.cards);
            bankerCard.innerHTML = showCard(banker.cards);
            if(banker.getPoint(banker.cards) < 17) {
                banker.cards.push(getCardIndex());
                console.log(banker.cards);
                i = setTimeout(bankerDeal, 50);
            } else {
                clearTimeout(i);
            }
        })();

        var bankerPoint = banker.getPoint(banker.cards);
        var playerPoint = player.getPoint(player.cards);
        var playerPointCopy = player.getPoint(player.cardsCopy);

        let temp_d = [];
        for(let i=0;i<banker.cards.length;i++){
            temp_d.push(transformToName(banker.cards[i]));
        }
        bankerR.innerHTML = temp_d;
        var temp_d_new = "["+temp_d+"]";
        banker_result.push(temp_d_new);

        if(firstCardsFinished) {   //判斷有無分牌，因分牌規則不同
            //分牌
            playP.innerHTML = "分牌";
            bankerP.innerHTML = "分牌";
            tie.innerHTML = "分牌";
            game_result.push("分牌");
            if(bankerPoint === 21) { 
                if(playerPoint === 21) {
                    player.balance += player.bet;
                    showTips("第一個牌組平局");
                } else {
                    showTips("第一個牌組输了");
                }
                if(playerPointCopy === 21) {
                    player.balance += player.bet;
                    setTimeout(function() {showTips("第二個牌組平局");}, 1000);
                } else {
                    setTimeout(function() {showTips("第二個牌組输了")}, 1000);
                }
            } else if(bankerPoint > 21) {  //banker > 21
                if(playerPoint <= 21) {
                    player.balance += player.bet*2;
                    showTips("第一個牌組赢了");
                } else {
                    showTips("第一個牌組输了");
                }
                if(playerPointCopy <= 21) {
                    player.balance += player.bet*2;setTimeout(function() {showTips("第二副牌赢了")}, 1000);
                } else {
                    setTimeout(function() {showTips("第二個牌組输了")}, 1000);
                }
            } else {                            //banker < 21
                if(playerPoint <= 21) {
                    if(playerPoint > bankerPoint) {
                        player.balance += player.bet*2;showTips("第一個牌組赢了");
                    } else if(playerPoint === bankerPoint) {
                        player.balance += player.bet;showTips("第一個牌組平局");
                    } else {
                        showTips("第一個牌組输了");
                    }
                }
                if(playerPointCopy <= 21) {
                    if(playerPointCopy > bankerPoint) {
                        player.balance += player.bet*2;setTimeout(function() {showTips("第二個牌組赢了")}, 1000);
                    } else if(playerPointCopy === bankerPoint) {
                        player.balance += player.bet;setTimeout(function() {showTips("第二個牌組平局")}, 1000);
                    } else {
                        setTimeout(function() {showTips("第二個牌組输了")}, 1000);
                    }
                }
            }
        } else { 
            //無分牌
            if(playerPoint > 21){
                bankerP.innerHTML = "V";
                game_result.push("莊家勝");
            } 
            if(bankerPoint === 21) {
                if(player.cards.length == 2 && playerPoint === 21) {    //玩家是black jack
                    player.balance += player.bet*3;
                    setTimeout(function() {showTips("Black Jack！玩家勝利！")}, 1000);
                    playP.innerHTML = "V";
                    game_result.push("玩家勝");
                } else if(playerPoint === 21) {  //player 21點
                    player.balance += player.bet;
                    setTimeout(function() {showTips("平局")}, 1000);
                    tie.innerHTML = "V";
                    game_result.push("平手");
                } else {
                    setTimeout(function() {showTips("莊家勝利！")}, 1000);
                    bankerP.innerHTML = "V";
                    game_result.push("莊家勝");
                }
            } else if(bankerPoint > 21) {   //banker > 21
                if(playerPoint <= 21) {
                    player.balance += player.bet*2;
                    setTimeout(function() {showTips("玩家勝利！")}, 1000);
                    playP.innerHTML = "V";
                    game_result.push("玩家勝");
                } else {
                    setTimeout(function() {showTips("莊家勝利！")}, 1000);
                    bankerP.innerHTML = "V";
                    game_result.push("莊家勝");
                }
            } else {  //banker < 21
                if(playerPoint <= 21) {
                    if(player.cards.length == 2 && playerPoint === 21) {    //玩家是black jack
                        player.balance += player.bet*3;
                        setTimeout(function() {showTips("Black Jack！玩家勝利！")}, 1000);
                        playP.innerHTML = "V";
                        game_result.push("玩家勝");
                    } else if(playerPoint === 21) {  //player 21點
                        player.balance += player.bet*2;
                        setTimeout(function() {showTips("玩家勝利！")}, 1000);
                        playP.innerHTML = "V";
                        game_result.push("玩家勝");
                    } else if(playerPoint === bankerPoint) {
                        player.balance += player.bet;
                        setTimeout(function() {showTips("平局")}, 1000);
                        tie.innerHTML = "V";
                        game_result.push("平手");
                    } else if(playerPoint > bankerPoint) {
                        player.balance += player.bet*2;
                        setTimeout(function() {showTips("玩家勝利！")}, 1000);
                        playP.innerHTML = "V";
                        game_result.push("玩家勝");
                    } else {
                        setTimeout(function() {showTips("莊家勝利！")}, 100);
                        bankerP.innerHTML = "V";
                        game_result.push("莊家勝");
                    }
                }
            }
        } //以下為新增表格
        row.appendChild(round);
        row.appendChild(playP);
        row.appendChild(bankerP);
        row.appendChild(tie);
        row.appendChild(playR);
        row.appendChild(bankerR);
        tbody.appendChild(row); 
        startAgain(); 
    }
    // for 過五關與投降的情況
    function Gameover_special_case(flag){
        insuranceBtn.style.display = 'none';
        operationBtns[0].style.display = 'none';
        operationBtns[1].style.display = 'none';
        operationBtns[2].style.display = 'none';
        operationBtns[3].style.display = 'none';
        gameover_or_not = true;
        (function bankerDeal() {
            var i = setTimeout(bankerDeal, 50);
            console.log(banker.cards);
            bankerCard.innerHTML = showCard(banker.cards);
            if(banker.getPoint(banker.cards) < 17) {
                banker.cards.push(getCardIndex());
                i = setTimeout(bankerDeal, 50);
            } else {
                clearTimeout(i);
            }
        })();
        n = n + 1;
        let row = document.createElement('tr');
        let round = document.createElement('td');
        round.innerHTML = n;
        let playP =document.createElement('td');
        let tie =document.createElement('td')
        let playR = document.createElement('td');
        let bankerP = document.createElement('td');
        let bankerR = document.createElement('td');
        if(flag == true){
            playR.innerHTML = "投降";
            player_result.push("投降");
            banker_result.push("玩家投降");
            bankerP.innerHTML = "V";
            game_result.push("投降莊家勝");
        }else{
            player.balance += player.bet*4;
            playR.innerHTML = "過五關";
            player_result.push("過五關");
            playP.innerHTML = "V";
            game_result.push("玩家勝過五關");
        } //新增表格
        row.appendChild(round);
        row.appendChild(playP);
        row.appendChild(bankerP);
        row.appendChild(tie);
        row.appendChild(playR);
        row.appendChild(bankerR);
        tbody.appendChild(row);
        startAgain(); 
    }

    //重新開始
    function startAgain() {
        clearInterval(remindUser); //重製遊戲提醒
        gameover_or_not = false;
        //儲存遊戲時間
        playing_time.push(countnumber);
        localStorage.setItem('playTime',playing_time);
        sessionStorage.setItem('playTime',playing_time);
        var sorted_game_result = [];
        for(let i = 0; i <game_result.length;i++){
            sorted_game_result.push(game_result[i]);
        }

        //排序遊戲結果根據遊戲時間
        for(let i = 0;i < playing_time.length; i++){
            for (let j = 0;j < playing_time.length;j++){
                if (playing_time[j] > playing_time[j+1]) {
                    let temp = sorted_game_result[j];
                    sorted_game_result[j] = sorted_game_result[j+1];
                    sorted_game_result[j+1] = temp;
                }
            }
        }

        //紀錄下注的金額
        localStorage.setItem('chipRecord',chips_record);
        sessionStorage.setItem('chipRecord',chips_record);

        //紀錄遊戲
        localStorage.setItem('game_result',game_result);
        sessionStorage.setItem('game_result',game_result);

        localStorage.setItem('player_result',player_result);
        sessionStorage.setItem('player_result',player_result);

        localStorage.setItem('banker_result',banker_result);
        sessionStorage.setItem('banker_result',banker_result);

        localStorage.setItem('sortedResult',sorted_game_result);
        sessionStorage.setItem('sortedResult',sorted_game_result);

        countnumber=0;
        setTimeout(function() {showTips("點擊Deal繼續遊玩！")}, 2000);
        dealBtn.innerHTML = "Deal";
        dealBtn.addEventListener('click', again);

        function again()  {
            dealBtn.innerHTML = "again";
            if(player.balance < 5) {
                //刪除遊戲時間的儲存紀錄
                localStorage.removeItem('playTime');
                sessionStorage.removeItem('playTime');
                localStorage.removeItem('player_result');
                sessionStorage.removeItem('player_result');
                localStorage.removeItem('banker_result');
                sessionStorage.removeItem('banker_result');
                localStorage.removeItem('game_result');
                sessionStorage.removeItem('game_result');
                localStorage.removeItem('chipRecord');
                sessionStorage.removeItem('chipRecord');
                localStorage.removeItem('sortedResult');
                sessionStorage.removeItem('sortedResult');
                
                playing_time = []
                var msg = confirm("餘額不足，請重新整理");
                if(msg) {
                    player.balance = 100;
                    var num = document.getElementById("myTable").rows.length;
                    n = 0;
                    if(num >2){
                        for(let i=num;i>1;i--){document.getElementById("myTable").deleteRow(-1);}
                    }
                }
            }
            dealBtn.removeEventListener('click', again);
            if(player.bet >= 5) {
                init();
                dealBtn.addEventListener('click', run); //拿牌
            }
        }
    }   
    //下注判斷
    function addBetFunc(event) {
        var isEnough = true;
        var notButton = false;

        switch (event.target.className){
            case 'm5':
                if(player.balance < 5) {
                    isEnough = false;
                } else {
                    player.bet += 5;
                    player.balance -= 5;
                    break;
                }
            case 'm10':
                if(player.balance < 10) {
                    isEnough = false;
                } else {
                    player.bet += 10;
                    player.balance -= 10;
                    break;
                }
            case 'm25':
                if(player.balance < 25) {
                    isEnough = false;
                } else {
                    player.bet += 25;
                    player.balance -= 25;
                    break;
                }
            case 'm100':
                if(player.balance < 100) {
                    isEnough = false
                } else {
                    player.bet += 100;
                    player.balance -= 100;
                    break;
                }
            default:
                notButton = true;
                break;
        }
        if(!isEnough) {
            showTips("餘額不足，無法使用！！");
        } else {
            if(!notButton) {
                var addedBet = document.createElement("button");
                addedBet.innerHTML = (event.target.className).substring(1);
                addedBet.classList.add(event.target.className.toString());
                addBet.appendChild(addedBet);
            }
        }
        updateBetBalance();
    }

    //籌碼餘額判斷
    function removeBetFunc(event) {
        var notButton = false;
        switch (event.target.className) {
            case 'm5':
                player.bet -= 5;
                player.balance += 5;
                break;
            case 'm10':
                player.bet -= 10;
                player.balance += 10;
                break;
            case 'm25':
                player.bet -= 25;
                player.balance += 25;
                break;
            case 'm100':
                player.bet -= 100;
                player.balance += 100;
                break;
            default:
                notButton = true;
                break;
        }
        updateBetBalance();
        if(!notButton) {
            event.target.remove();//預防再次下注
        }
    }
    //更新餘額
    function updateBetBalance() {
        bet_money.innerHTML = player.bet;
        balance_money.innerHTML = player.balance;
    }
})();

//由於點數以list的address作依據，因此須作數值轉換
function transformToPoint(i, A_or_not) {
    if(A_or_not) { // A
        if(i % 13 == 0) {
            return 11;
        }
    } else {
        if(i % 13 == 0) {
            return 1;
        }
    }
    if(i >= 1 && i <= 12) {// 黑桃
        if(i <= 9) {
            return i+1;
        } else {
            return 10;
        }
    } else if(i >= 14 && i <= 25) { //紅心
        if( i <= 22) {
            return (i - 12);
        } else {
            return 10;
        }
    } else if(i >= 27 && i <= 38) { //梅花
        if(i <= 35) {
            return (i - 25);
        } else {
            return 10;
        }
    } else if(i >= 40 && i <= 51) { //方塊
        if(i <= 48) {
            return (i - 38);
        } else {
            return 10;
        }
    }
}

//用於紀錄牌型，名稱轉換
function transformToName(i) {
    if(i == 0) {
        return "♠A";
    }else if(i == 13) {
        return "♥A";
    }else if(i == 26){
        return "♣A";
    }else if(i == 39){
        return "♦A";
    }
    if(i >= 1 && i <= 12) {// 黑桃
        if(i <= 9) {
            let tmp = i+1;
            return `♠${tmp}`;
        } else if(i == 10) {
            return "♠J";
        }else if(i == 11) {
            return "♠Q";
        }else if(i == 12) {
            return "♠K";
        }
    } else if(i >= 14 && i <= 25) { //紅心
        if( i <= 22) {
            let tmp = i - 12;
            return `♥${tmp}`;
        } else if(i == 23) {
            return "♥J";
        }else if(i == 24) {
            return "♥Q";
        }else if(i == 25) {
            return "♥K";
        }
    } else if(i >= 27 && i <= 38) { //梅花
        if(i <= 35) {
            tmp = i - 25;
            return `♣${tmp}`;
        } else if(i == 36) {
            return "♣J";
        }else if(i == 37) {
            return "♣Q";
        }else if(i == 38) {
            return "♣K";
        }
    } else if(i >= 40 && i <= 51) { //方塊
        if(i <= 48) {
            tmp = i - 38;
            return `♦${tmp}`;
        } else if(i == 49) {
            return "♦J";
        }else if(i == 50) {
            return "♦Q";
        }else if(i == 51) {
            return "♦K";
        }
    }
}

//隨機廣告投放
var Imgs = new Array("./images/ad1.jpg","./images/ad2.png","./images/ad3.jfif","./images/ad4.png");
var hrefs = new Array("https://www.w3schools.com/",
                    "https://www.youtube.com/?gl=TW&hl=zh-tw",
                    "https://zh-tw.facebook.com/",
                    "https://line.me/zh-hant/");
setInterval("randomImg()",2000);

function randomImg(){
    //陣列的長度 * 介於0~1間數字 ，然後在取 floor 當照片索引值
    var imgIndex = Math.floor(Math.random()*Imgs.length);
    document.getElementById("ads").innerHTML  = "<a target=_blank href='"+hrefs[imgIndex]+"'><img src='"+Imgs[imgIndex]+"' width=250 height=100></a>";
    }   
window.onload = randomImg()

//計時器
var countnumber=0;
var countid,x;
function initial(){
    x=document.getElementById("cTime");
    x.innerHTML = countnumber;
    countid=window.setInterval(countfunc,1000);
}
function countfunc(){ 
  x.innerHTML=countnumber;
  if (gameover_or_not){
    clearInterval(countdownid);
  }else{
    countnumber++;
  }
}
window.onload = initial();
