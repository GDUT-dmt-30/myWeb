// JavaScript Document
let color = ['黑桃','红桃','梅花','方块'];
let number = [1,2,3,4,5,6,7,8,9,10,11,12,13]
let deck = [];
let uiCards = [];
let youCards = [];//牌的属性
let youScore = 0;
let uiScore =0;//玩家的点数
let youStatusString = '';
let uiCardsString = '';

let paragraph = document.getElementById('text');
let newButton = document.getElementById('newGame');
let takeButton = document.getElementById('take');
let stayButton = document.getElementById('stay');//Dom对象们

let gameStart = false;
let gameOver = false;
let playerWin = false;

//paragraph.style.display='none';
takeButton.style.display='none';
stayButton.style.display='none';

function initDeck(){
	let deck1 = [];
	for(let typecolor = 0; typecolor<color.length;typecolor++)
		for(let typenumber = 0; typenumber<number.length;typenumber++){
			let card = {
				color:  color[typecolor],
				number: number[typenumber]
			}
			deck1.push(card)
		}
	return deck1;
}

function countScore(){
	let temp0 = 0,temp1 = 0;
	for(let i = 0;i<youCards.length;i++){
		if(youCards[i].number>10){
			temp0 +=10;
		}
		else{
			temp0 += youCards[i].number;
		}
	}
	youScore = temp0;
	for(let j = 0;j<uiCards.length;j++){
		if(uiCards[j].number>10){
			temp1 +=10;
		}
		else{
			temp1 += uiCards[j].number;
		}
	}
	uiScore = temp1;
	
	if(youScore == 21){
		gameStart = false;
		gameOver = true;
		playerWin = true;
	}
	else if(youScore>21){
		gameStart = false;
		gameOver = true;
		playerWin = false;
	}
	else if(uiScore>21){
		gameStart = false;
		gameOver = true;
		playerWin = true;
	}
	else if(uiScore==21){
		gameStart = false;
		gameOver = true;
		playerWin = false;
	}

}
function youGetCards(){
	let temp = '';
	youCards.push(deck[Math.trunc(Math.random()*52)]);
	for(let i = 0;i<youCards.length;i++){
		temp += (youCards[i].color+youCards[i].number+'\n');
	}
	youStatusString = temp;
	countScore();
	if(!gameOver){
		if(youCards.length>uiCards.length&&!gameOver){
			uiGEtCards();
		}
	}
}
function uiGEtCards(){
	
	let temp = '';
	uiCards.push(deck[Math.trunc(Math.random()*52)]);
	for(let i=0;i<uiCards.length;i++){
		temp += (uiCards[i].color+uiCards[i].number+'\n');
	}
	uiCardsString = temp;
	
}

function showStatus(){
	if(!gameStart){
		paragraph.innerText = "欢迎来到紧张刺激的21点游戏！"
	}
	//计算分数
	countScore();
	
	paragraph.innerText = 
		
		'你的牌是：\n'+
		youStatusString +
		'(你的点数:'+youScore+')\n\n'
        +	
		'鬼子的牌是：\n'+
		uiCardsString+
		'(鬼子的点数：'+uiScore+')\n\n' ;
		
	
	if(gameOver){
		if(playerWin){
			paragraph.innerText += "你赢了！你他娘的真是个人才！";
		}
		else{
			paragraph.innerText += "难受啊云龙兄，你被鬼子包围了！";
		}
		newButton.style.display = 'inline';
		takeButton.style.display = 'none';
		stayButton.style.display = 'none';
	}
	return;
}
function init(){
	 youScore = 0;
	 uiScore =0;//玩家的点数
	 youStatusString = '';
	 uiCardsString = '';
	 uiCards = [];
	 youCards = [];
	
	 gameStart = true;
	 gameOver = false;
	 playerWin = false;
	
	deck = initDeck();	//洗牌
	youGetCards();
	youGetCards();
//游戏开始，派初始两张牌
	
	paragraph.innerText = ' ';
}

takeButton.addEventListener('click',function(){	
	youGetCards();
	showStatus();	
});
stayButton.addEventListener('click',function(){
	if(youScore<uiScore){
		gameOver =true;
		gameStart = false;
		playerWin = false;
	}
	else{
		uiGEtCards();
		countScore();
		if(uiScore>youScore){
			gameOver =true;
			gameStart = false;
			playerWin = false;
		}
	}
	showStatus();
});
//游戏开始
newButton.addEventListener('click',function(){
	if(!gameStart){
		init();
		showStatus();

		newButton.style.display='none'
		takeButton.style.display='inline';
		stayButton.style.display='inline';
	}
});
