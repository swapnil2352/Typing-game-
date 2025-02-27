const words =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".split(
    " "
  );
const wordsCount = words.length;

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

  console.log(isLetter);
  console.log(currentLetter);
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
      const lastLetter = currentWord.lastChild;
      if (lastLetter) {
        // Ensure it actually exists
        console.log(currentWord.lastChild);
        addClass(lastLetter, "current");
        removeClass(lastLetter, "incorrect"); // red color
        removeClass(lastLetter, "correct"); // white color
      }
    }
  }

  // move cursor

  const nextLetter = document.querySelector(".letter.current");
  console.log("Please ", nextLetter);
  const nextWord = document.querySelector(".word.current");
  const cursor = document.getElementById("cursor");
  cursor.style.top =
    (nextLetter || nextWord).getBoundingClientRect().top + 2 + "px";
  cursor.style.left =
    (nextLetter || nextWord).getBoundingClientRect()[
      nextLetter ? "left" : "right"
    ] + "px";
});

newGame();
