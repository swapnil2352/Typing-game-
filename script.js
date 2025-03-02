const words =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".split(
    " "
  );
const wordsCount = words.length;
const gameTime = 50 * 1000; 
window.gameStart = null; 

function addClass(el, name) {
  el.className += " " + name;
}

function removeClass(el, name) {
  el.className = el.className.replace(name, "");
}

function randomWord() {
  const randomIndex = Math.floor(Math.random() * wordsCount);
  return words[randomIndex];
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word
    .split("")
    .join('</span><span class="letter">')}</span>
        </div>`;
}

function newGame() {
  document.getElementById("words").innerHTML = "";
  for (let i = 0; i < 100; i++) {
    document.getElementById("words").innerHTML += formatWord(randomWord());
  }

  addClass(document.querySelector(".word"), "current");
  addClass(document.querySelector(".letter"), "current");
  document.getElementById('info').innerHTML = (gameTime/1000)+ '';
  window.timer = null; 

  // remove 'over' class from game 
  if(document.querySelector('#game.over')){
    removeClass(document.getElementById('game'), "over");
    cursor.style.top = '198px'
    cursor.style.left = '474px'
    // document.getElementById('focus-error').style.display = 'block';
  }
  
}

function getWpm(){
  const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current')
  const lastTypedWordIndex = words.indexOf(lastTypedWord)
  const typedWords = words.slice(0,lastTypedWordIndex)
  const correctWords = typedWords.filter(word =>{
    const letters = [...word.children];
    const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'))
    const correctLetters = letters.filter(letter => letter.className.includes('correct'))
    return incorrectLetters.length === 0 && correctLetters.length === letters.length;
  })
  console.log(correctWords.length);
  return correctWords.length/gameTime*60*1000;
}

function gameOver(){
  clearInterval(window.timer);
  addClass(document.getElementById('game'), 'over');
  document.getElementById('info').innerHTML = `WPM: ${getWpm()}`;
  document.getElementById('focus-error').style.display = 'none';
}

document.getElementById("game").addEventListener("keyup", (ev) => {
  const key = ev.key;
  const currentWord = document.querySelector(".word.current");
  const currentLetter = document.querySelector(".letter.current");
  const expected = currentLetter?.innerHTML || "&";
  const isLetter = key.length === 1 && key !== " "; // backspace length is greater than 1 and the other condn for no space.
  const isSpace = key === " ";
  const isBackspace = key === "Backspace";
  const isFirstLetter = currentLetter === currentWord.firstChild;

  if(document.querySelector('#game.over')){
    return;
  }
  
  
  if(!window.timer && isLetter){
    window.timer = setInterval(()=> {
      if(!window.gameStart){
        window.gameStart = (new Date()).getTime(); 
      }
      const currentTime = (new Date()).getTime();
      const msPassed = currentTime - window.gameStart;
      const sPassed = Math.round(msPassed/1000);
      const sLeft = (gameTime/1000) - sPassed; 
      if(sLeft <= 0){
        gameOver();
        return;
      }
      document.getElementById('info').innerHTML = sLeft + '';

    },1000)
  }


  if (isLetter) {
    if (currentLetter) {
      // alert(key==expected ? 'ok' : 'wrong');
      addClass(currentLetter, key === expected ? "correct" : "incorrect");
      removeClass(currentLetter, "current");
      console.log("Hello");
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, "current");
      }
    } else {
      const incorrectLetter = document.createElement("span");
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = "letter incorrect extra";
      currentWord.appendChild(incorrectLetter);

      console.log("Appended extra letter:", key);
      console.log("Current word:", currentWord.innerHTML);
    }
  }

  if (isSpace) {
    if (expected !== " ") {
      const lettersToInvalidate = [
        ...document.querySelectorAll(".word.current .letter:not(.correct)"),
      ];
      lettersToInvalidate.forEach((letter) => {
        addClass(letter, "incorrect");
      });
    }
    removeClass(currentWord, "current");
    addClass(currentWord.nextSibling, "current");
    if (currentLetter) {
      removeClass(currentLetter, "current");
    }
    addClass(currentWord.nextSibling.firstChild, "current");
  }

  if (isBackspace) {
    if (currentLetter && isFirstLetter && currentWord.previousSibling) {
      removeClass(currentWord, "current");
      addClass(currentWord.previousSibling, "current");

      removeClass(currentLetter, "current");

      const lastLetter = currentWord.previousSibling.lastElementChild;
      if (lastLetter) {
        addClass(lastLetter, "current");
        removeClass(lastLetter, "incorrect");
        removeClass(lastLetter, "correct");
      }
    }

    if (currentLetter && !isFirstLetter) {
      // move back one letter, invalidate letter.

      removeClass(currentLetter, "current");
      addClass(currentLetter.previousSibling, "current");
      removeClass(currentLetter.previousSibling, "incorrect");
      removeClass(currentLetter.previousSibling, "correct");
    }
    if (!currentLetter && currentWord) {
      const lastLetter = currentWord.lastElementChild;
      if (lastLetter) {
        // Ensure it actually exists
        console.log(currentWord.lastChild);
        addClass(lastLetter, "current");
        removeClass(lastLetter, "incorrect"); // red color
        removeClass(lastLetter, "correct"); // white color
      }
    }
  }

  // move lines/words 

  if(currentWord.getBoundingClientRect().top > 250){
    const words = document.getElementById('words')
    const margin = parseInt(words.style.marginTop || '0px')
    words.style.marginTop = (margin - 35) + 'px';
  }

  // move cursor

  const nextLetter = document.querySelector(".letter.current");
  const nextWord = document.querySelector(".word.current");
  const cursor = document.getElementById("cursor");
  cursor.style.top =
    (nextLetter || nextWord).getBoundingClientRect().top + 2 + "px";
  cursor.style.left =
    (nextLetter || nextWord).getBoundingClientRect()[
      nextLetter ? "left" : "right"
    ] + "px";
});

document.getElementById('newGameButton').addEventListener('click',(e) =>{
  gameOver();
  newGame();
})

newGame();
