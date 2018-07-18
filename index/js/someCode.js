// JavaScript Document

let pragraph = document.getElementById('text');

//1234组成不同的三位数
console.log("1234组成所有不同的三位数")
function threeNumber() {
    for(let a=1;a<5;a++) {
        for (let b = 1; b < 5; b++) {
            if (a != b) {
                for (let c = 1; c < 5; c++){
                    if (c != a && c != b) {
                        console.log(a, b, c);}
                }
            }
        }
    }
}
threeNumber();

//一个数加上100是完全平方数，加上268也是完全平方数
console.log("十万以内，一个数加" +
    "上100是完全平方数，" +
    "加上268也是完全平方数");
function  aNumber() {
    for (let a = 0;a<100000;a++)
        if(Math.sqrt(a+100)%1==0)
            if(Math.sqrt(a+268)%1==0)
                console.log(a);
}
aNumber();
let temp = [];
for (let a = 1;a<10;a++){
    let numberString = [];
    for(let b = 1;b<=a;b++) {
        let c = a * b;
        numberString += (b + "*" + a + "=" + c+"\t\t");
    }
    temp.push(numberString+'\n');
}//乘法口诀

for(let i=0;i<temp.length;i++) {
    pragraph.innerText += '\n'+temp[i];
}