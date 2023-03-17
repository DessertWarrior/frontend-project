console.log('linked');
const NUM_QUESTIONS = 10;
const EASY_TIME = 120;
const NORMAL_TIME = 60;
const HARD_TIME = 20;

let choice = 0;     //selection for difficulty
let quoteObject = {}    //stores correct ans
let multipleChoice = [];    //stores all choices
let mode = 1;
let numberOfQuestions = NUM_QUESTIONS;
let newInterval;
let correctGuesses=0;

// fetch('https://animechan.vercel.app/api/random')
//     .then(response => response.json())
// //     .then(quote => getRandomQuote(quote))
// fetch("https://animechan.vercel.app/api/random/anime?title=naruto")
//         .then((response) => response.json())
//         .then((quote) => console.log(quote));
function displayMain()
{
    let main_container = document.querySelector('.main-container');

    let title = document.createElement('h1');
    title.className = 'title';
    title.innerText = 'Anime Challenges';

    let funcTab = document.createElement('div');
    funcTab.classList = 'func-tab grid';

    let start = document.createElement('input');
    start.setAttribute('id','start');
    start.setAttribute('type','button');
    start.setAttribute('value', 'Start Now');

    let setting = document.createElement('input');
    setting.setAttribute('id','setting');
    setting.setAttribute('type','button');
    setting.setAttribute('value', 'Setting');

    main_container.appendChild(title);
    funcTab.appendChild(start);
    funcTab.appendChild(setting);
    main_container.appendChild(funcTab);
}
function shuffleArr(arr)
{
    arr.sort(()=> Math.random()-0.5);  //original array modified, sort randomly
}
function calculateTime(timeinSec)
{
  let minutes = Math.floor(timeinSec/60);
  timeinSec-= minutes * 60;
  if (timeinSec >=10)
    return '0'+minutes + ':' + timeinSec;
  else
    return '0'+minutes + ':0' + timeinSec;
}
let startGame = function()
{
    let main_container = document.querySelector('.main-container');
    main_container.innerHTML = '';
    multipleChoice = [];

    let timerNode = document.createElement('h1');
    timerNode.className = 'timer';
    timerNode.innerText = '00:00'
    main_container.appendChild((timerNode));

    let flashcard = document.createElement('div');
    flashcard.classList = "flex flex-hor-center flashcard";
    flashcard.style.backgroundImage = 'url(https://img.freepik.com/premium-vector/elegant-baroque-page-border-decorative-ornate-frame_543062-2238.jpg?w=2000)';
    flashcard.style.backgroundSize = '100% 100%';
    let page_border = document.createElement('img');

    let timer = function ()
    {
        let timerNode = document.querySelector('.timer');

        let time = 1;  //120s
        switch (mode) {
            case 0:
                time += EASY_TIME;
                break;
            case 1:
                time += NORMAL_TIME;
                break;
            case 2:
                time += HARD_TIME;
                break;
        }

        newInterval = setInterval(() => {
            time--;
            timerNode.innerText = calculateTime(time);
            if (time < 0)
            {
                let ans;
                if (choice == 0)
                {
                    ans = quoteObject.character;
                }
                console.log(`Time Up! The correct answer is ${ans}`);
                continueGame();
            }
        }, 1000);
    }
    let uploadQuote = function(quote){  
        //timer();    //start timing

        quoteObject['anime'] = quote.anime;
        quoteObject['character'] = quote.character;
        quoteObject['quote'] = quote.quote;
        multipleChoice.push(quote.character);   //add quote to the arr

        let question = document.createElement('h1');
        question.innerText = 'Who said it?';

        let questionDetail = document.createElement('h2');
        questionDetail.innerText = `"${quoteObject.quote}"`

        let cardContent = document.createElement('div');
        cardContent.className = 'cardContent';

        cardContent.appendChild(question);
        cardContent.appendChild(questionDetail);
        flashcard.appendChild(cardContent);
        
        let selection_box = document.createElement('div');
        selection_box.className = 'flex radio-selection';
        //each multiple choice
        for (let i of multipleChoice)
        {
            let card_choice = document.createElement('div');
            card_choice.className = 'choice-elements';

            let ans = document.createElement('input');
            ans.setAttribute('type','radio');
            ans.setAttribute('value',i);
            ans.className = 'trueAns';
            card_choice.appendChild(ans);
            
            let label = document.createElement('label');
            label.innerText = i;
            card_choice.appendChild(label);
            selection_box.appendChild(card_choice);
            
            ans.addEventListener('click',()=>{
                //set all radio bt to false
                let arrNode_radio = document.querySelectorAll('.trueAns');
                arrNode_radio.forEach(radioBT=>{
                        radioBT.checked = false;
                    }
                );
                ans.checked= true;
            })
        }
        let flashcard_submit = document.createElement('input');
        flashcard_submit.setAttribute('type','submit');
        flashcard_submit.setAttribute('value','submit');
        flashcard_submit.addEventListener('click',()=>{
            isCorrectAnswer('character');
        })
        
        cardContent.appendChild(selection_box);
        cardContent.appendChild(flashcard_submit);
    }
    switch (choice){
        case 0: //who said the quote
        fetch("https://animechan.vercel.app/api/quotes")      //get 10 random quotes
        .then(response => response.json())
        .then(quotes => {
            switch (mode)
            {
                case 0: //easy mode only 1 wrong answer
                    multipleChoice.push(quotes[0].character);
                    break;
                case 1: //normal mode 3 wrong answers
                    for(let i = 0; i < 3; i ++) //3 times
                        multipleChoice.push(quotes[i].character);
                    break;
                case 2: //hard mode 5 wrong answers;
                    for(let i = 0; i < 5; i ++) //5 times
                        multipleChoice.push(quotes[i].character);
                    break;
                }    
                fetch('https://animechan.vercel.app/api/random')
                        .then(response => response.json())
                        .then(quote => uploadQuote(quote))
         })   
    }

    main_container.appendChild(flashcard);
};
let setting = function(){
    console.log(document.querySelector('.title'));
};
function init()
{
    correctGuesses = 0;
    let startBT = document.getElementById('start');
    startBT.addEventListener('click',startGame);

    let settingBT = document.querySelector('#setting');
    settingBT.addEventListener('click', setting);
}
function continueGame()
{
    clearInterval(newInterval);
    setTimeout(() => {
        numberOfQuestions--;
        if (numberOfQuestions > 0)
            startGame();
        else
        {
            document.querySelector('.main-container').innerHTML = '';
            alert(`You got total of ${correctGuesses} guesses out of ${NUM_QUESTIONS} correct! Your score is ${Math.floor(correctGuesses/ NUM_QUESTIONS * 100)}`);
            displayMain();
            init(); //initialize click event
        }
    }, 5000);
}
function isCorrectAnswer(description){
    if (description == 'character')
    {
        let selected_radio = document.querySelectorAll('.trueAns');
        let correctNode;
        let selectedNode;
        selected_radio.forEach(element=>{
            let labelNode = element.parentElement.lastChild;
            if (element.value == quoteObject.character)
                correctNode = labelNode;
            if (element.checked)
                selectedNode = labelNode;
        });
        if (!selectedNode) {
            alert('Select one of the choice!'); //if theres no checked radiobutton
            return;
        }
        
        if (selectedNode.innerText == correctNode.innerText)
        {
            selectedNode.style.color = 'rgba(84, 171, 81, 0.929)';
            correctGuesses++;
        }
        else {
            selectedNode.style.color = 'rgba(222, 67, 67, 0.929)';
            correctNode.style.color = 'rgba(84, 171, 81, 0.929)';
        }
        continueGame();
    }
    else if (description == 'anime')
    {
        
    }
    else {

    }
}