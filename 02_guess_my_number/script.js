'use strict';

/*
console.log(document.querySelector('.message').textContent);

document.querySelector('.message').textContent = 'Correct number!';

console.log(document.querySelector('.message').textContent);

document.querySelector('.number').textContent = 17;

document.querySelector('.score').textContent = 21;

document.querySelector('.guess').value = 17;

console.log(document.querySelector('.guess').value);
*/

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highScore = 0;

const displayMessage = (message) => {
  document.querySelector('.message').textContent = message;
};

document.querySelector('.check').addEventListener('click', () => {
  let guess = Number(document.querySelector('.guess').value);
  //console.log(guess, typeof guess);

  //When there is no input
  if (!guess) {
    displayMessage('No number!');
    //document.querySelector('.message').textContent = 'No number!';
    //When player wins
  } else if (guess === secretNumber) {
    displayMessage('Correct number!');
    //document.querySelector('.message').textContent = 'Correct number!';

    document.querySelector('.number').textContent = secretNumber;
    score++;
    document.querySelector('.score').textContent = score;
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';

    if (score > highScore) {
      highScore = score;
      document.querySelector('.highscore').textContent = highScore;
    }
    // When guess is wrong
  } else if (guess !== secretNumber) {
    if (score > 1) {
      displayMessage(guess > secretNumber ? 'Too high!' : 'Too low!');
      //document.querySelector('.message').textContent =
      //guess > secretNumber ? 'Too high!' : 'Too low!';
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      displayMessage('You lost the game!');
      //document.querySelector('.message').textContent = 'You lost the game!';
      document.querySelector('.score').textContent = 0;
    }
  }
  //When guess is too high
  /*else if (guess > secretNumber) {
    if (score > 1) {
      document.querySelector('.message').textContent = 'Too high!';
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      document.querySelector('.message').textContent = 'You lost the game!';
      document.querySelector('.score').textContent = 0;
    }
    //When guess is too low
  } else if (guess < secretNumber) {
    if (score > 1) {
      document.querySelector('.message').textContent = 'Too low!';
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      document.querySelector('.message').textContent = 'You lost the game!';
      document.querySelector('.score').textContent = 0;
    }
  }*/
});

/**
 * Coding challenge
 * 1.Select the element with the 'again' class and
 * attach a click event handler
 *
 * 2.In the handler function, restore intitial values of
 * the score and number variables
 *
 * 3.Restore the intitial conditions of the message,
 * number, score and guess input field
 *
 * 4.Also restore the original background color (#222)
 * and number width (15rem)
 *
 */

document.querySelector('.again').addEventListener('click', () => {
  let secretNumber = Math.trunc(Math.random() * 20) + 1;

  score = 20;

  document.querySelector('body').style.backgroundColor = '#222';

  document.querySelector('.number').style.width = '15rem';

  displayMessage('Start guessing...');
  //document.querySelector('.message').textContent = 'Start guessing...';

  document.querySelector('.score').textContent = score;

  document.querySelector('.number').textContent = '?';

  document.querySelector('.guess').value = '';
});
