'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/*************** Setting Current Date ***************/
labelDate.textContent = `${new Date().toLocaleDateString('en-us')}`;

/*************** Creating DOM Elements ***************/
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach((movement, i) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${movement} EUR</div>
      </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/*************** Current Balance ***************/
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (accum, movement) => accum + movement,
    0
  );

  labelBalance.textContent = `${account.balance} EUR`;
};

/*************** Methods Chaining ***************/
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((accum, movement) => accum + movement, 0);
  labelSumIn.textContent = `${incomes} EUR`;

  const outcomes = account.movements
    .filter(movement => movement < 0)
    .reduce((accum, movement) => accum + movement);
  labelSumOut.textContent = `${Math.abs(outcomes)} EUR`;

  const interest = account.movements
    .filter(movement => movement > 0)
    .map(movement => (movement * account.interestRate) / 100)
    .filter(movement => movement >= 1)
    .reduce((accum, movement) => accum + movement);
  labelSumInterest.textContent = `${interest} EUR`;
};

/*************** Computing Usernames ***************/

const createUsernames = function (accs) {
  accs.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(u => u[0])
        .join(''))
  );
};

createUsernames(accounts);

/*************** Updating UI ***************/
const updateUI = function (account) {
  //Display movements
  displayMovements(account);

  //Display balance
  calcDisplayBalance(account);

  //Display summary
  calcDisplaySummary(account);
};

/*************** Implementing Login ***************/
let currentAccount;

btnLogin.addEventListener('click', function (event) {
  //Prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and Welcome message

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

/*************** Implementing Transfers ***************/
btnTransfer.addEventListener('click', event => {
  event.preventDefault();
  const receiverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    console.log('Transfer valid', currentAccount);

    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    console.log(currentAccount);
    console.log(receiverAccount);

    updateUI(currentAccount);
  }
});

/*************** Requesting Loan ***************/
btnLoan.addEventListener('click', event => {
  event.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(movement => movement >= amount * 0.1)
  ) {
    //Add movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

/*************** Closing Account. Findindex Method ***************/
btnClose.addEventListener('click', event => {
  event.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', event => {
  event.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*************** Simple Arrays Methods ***************/
/*let arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
//SLICE
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice());
console.log([...arr]);

//SPLICE
//console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

//REVERSE
arr2.reverse();
console.log(arr2);

//CONCAT
const letters = arr.concat(arr2);
console.log(letters);

//JOIN
console.log(letters.join(' '));*/

/*************** New At Method ***************/
/*const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('Anatolii'.at(0));*/

/*************** Looping Arrays: forEach ***************/
/*movements.forEach((movement, index, array) => {
  if (movement > 0) {
    console.log(`Movement${index + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement${index + 1}: You withdrew ${Math.abs(movement)}`);
  }
});*/

/*************** forEach with Maps and Sets ***************/
//Map
/*currencies.forEach((value, key, map) => {
  console.log(`${key}: ${value}`);
});

//Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR']);
console.log(currenciesUnique);

currenciesUnique.forEach((value, _, set) => {
  console.log(`${_}: ${value}`);
});*/

/*************** Coding Challenge #1 ***************/
/*
Create a function 'checkDogs', which accepts 2 arrays
of dog's ages ('dogsJulia' and 'dogsKate') and does
the following things:

1. Julia found out that the owners of the FIRST and the LAST two dogs 
actually have cats, not dogs!
So create a shallow copy of Julia's array, and remove
the cat ages from that copied array (because it's a bad practice
to mutate fucntion parameters)
2. Create an array with both Julia's (corrected) and
Kate's data
3. For each ramaining dog, log to the console whether
it's an adult ('Dog number 1 is an adult, and is 5 years old') 
or a puppy ('Dog number 2 is still a puppy')
4. Run the function for both test datasets

TEST DATA 1: Julia's data [3,5,2,12,7], Kate's data [4,1,15,8,3]
TEST DATA 2: Julia's data [9,16,6,8,3] Kate's data [10,5,6,1,4]
*/
/*const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];

const checkDogs = function (arr1, arr2) {
  const arr1Corrected = arr1.slice();
  arr1Corrected.splice(0, 1);
  arr1Corrected.splice(-2);

  const dogs = [...arr1Corrected, ...arr2];

  dogs.forEach((dog, i) => {
    console.log(
      dog >= 3
        ? `Dog number ${i + 1} is an adult, and is ${dog} years old`
        : `Dog number ${i + 1} is still puppy`
    );
  });
};

checkDogs(dogsJulia, dogsKate);*/

/*************** Data Transformations: Map, Filter, Reduce ***************/
//Map Method
/*const eurToUsd = 1.1;
const movementsUSD = movements.map(movement => Math.trunc(movement * eurToUsd));

console.log(movements);
console.log(movementsUSD);

const movementsDescription = movements.map(
  (movement, i) =>
    `Movement ${i + 1}: You ${
      movement > 0 ? 'deposited' : 'withdrew'
    } ${Math.abs(movement)}`
);
console.log(movementsDescription);

//Filter Method
const deposits = movements.filter(movement => movement > 0);
console.log(movements);
console.log(deposits);

const withdrawals = movements.filter(movement => movement < 0);
console.log(withdrawals);

//Reduce Method
const globalBalance = movements.reduce(
  (accum, currentVallue, index) => accum + currentVallue,
  0
);

console.log(globalBalance);*/

//Maximum value
/*const max = movements.reduce((accum, movement) =>
  // accum < movement ? accum + movement : accum + 0
  {
    if (accum > movement) {
      return accum;
    } else {
      return (accum = movement);
    }
  }, movements[0]);

console.log(max);*/

/*************** Coding Challenge #2 ***************/
/*
Create a function 'calcAverageHumanAge', which accepts
an array of dog's ages ('ages') and does
the following things in order:

1.Calculate the dog age in human years using the
following formula: if the dog is <= 2 years old, 
humanAge = 2 * dogAge. If the dog is > 2 years old
humanAge = 16 + dogAge * 4.

2.Exclude all dogs that are less than 18 human years
old (which is the same as keeping dogs that are at
least 18 years old)

3.Calculate the average human age of all adult dogs

4.Run the function for both test datasets

TEST DATA: [5,2,4,1,15,8,3]

TEST  DATA: [16,6,10,5,6,1,4]
*/

/*const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));

  const adultAges = humanAges.filter(age => age >= 18);

  // const averageAges =
  //   adultAges.reduce((accum, age) => accum + age, 0) / adultAges.length;

  const averageAges = adultAges.reduce(
    (accum, age, i, arr) => accum + age / arr.length,
    0
  );

  return averageAges;
};

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));*/

/*************** The Magic of Chaining Methods ***************/
/*const totalDepositsUSD = movements
  .filter(movement => movement > 0)
  .map((movement, i, arr) => {
    console.log(arr);
    return movement * 1.1;
  })
  .reduce((accum, movement) => accum + movement, 0);

console.log(totalDepositsUSD);*/

/*************** Coding Challenge #3 ***************/
/*
Rewrite the 'calcAverageHumanAge' function from the 
previouse challenge, but this time as an arraw function
and using chaining!

TEST DATA 1: [5,2,4,1,15,8,3]

TEST DATA 2: [16,6,10,5,6,1,4]

*/

/*const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((accum, age, i, arr) => accum + age / arr.length, 0);

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));*/

/*************** Find Method ***************/
/*const firstWithdrawal = movements.find(movement => movement < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);
const account = accounts.find(account => account.owner === 'Jessica Davis');
console.log(account);

for (const account of accounts) {
  const account2 = account.owner === 'Sarah Smith' ? account : undefined;
  console.log(account2);
}*/

/*************** Some and Every Methods ***************/
//Some Method
/*console.log(movements);
console.log(movements.includes(-130));

const anyDeposits = movements.some(movement => movement > 0);
console.log(anyDeposits);

//Every Method
console.log(movements);
console.log(account4.movements.every(movement => movement > 0));

//Separate callback
const deposit = movement => movement > 0;

console.log(movements.some(deposit));
console.log(movements.every(deposit));*/

/*************** Flat and flatMap Methods ***************/
/*const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

//Flat method
const overallBalance = accounts
  //Make new array with arrays
  .map(account => account.movements)
  //Create new array with all values
  .flat()
  //Add all values
  .reduce((accum, movement) => accum + movement, 0);

console.log(overallBalance);

//flatMap method
const overallBalance2 = accounts
  .flatMap(account => account.movements)
  .reduce((accum, movement) => accum + movement);
console.log(overallBalance2);*/

/*************** Sorting Arrays ***************/
//Strings
/*const owners = ['Toli', 'Marc', 'Katja', 'Anatolii', 'Babushka'];
console.log(owners);
owners.sort();
console.log(owners);

//Numbers
console.log(movements);
console.log(movements.sort());

//movements.sort((a, b) => (a > b ? 1 : 0));
movements.sort((a, b) => a - b);

console.log(movements);*/

/*************** Ways of Creating and Filling Arrays ***************/
/*console.log([1, 2, 3, 4, 5, 6, 7]);
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x);
console.log(x.fill(1, 3)); //Only this method works

const y = Array.from({ length: 5 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, index) => index + 1);
console.log(z);

const dice = Array.from(
  { length: 10 },
  () => Math.trunc(Math.random() * 10) + 1
);

console.log(dice);

labelBalance.addEventListener('click', () => {
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('EUR', ''))
  );

  console.log(movementUI);
});*/

/*************** Which Array Method to Use ***************/

/*************** Array Method Practice ***************/
// 1.
/*const bankDepositSum = accounts
  .map(account => account.movements)
  .flat()
  .filter(deposit => deposit > 0)
  .reduce((accum, value) => accum + value);
console.log(bankDepositSum);

const bankDepositSum = accounts
  .flatMap(account => account.movements)
  .filter(deposit => deposit > 0)
  .reduce((accum, value) => accum + value, 0);
console.log(bankDepositSum);

//2.
const numDeposits1000 = accounts
  .flatMap(account => account.movements)
  .filter(deposit => deposit >= 1000).length;
console.log(numDeposits1000);

const numDeposits1000 = accounts
  .flatMap(account => account.movements)
  .reduce((count, value) => (value >= 1000 ? ++count : count), 0);
console.log(numDeposits1000);*/

//3.
/*const { deposits, withdrawals } = accounts
  .flatMap(account => account.movements)
  .reduce(
    (sum, value) => {
      value > 0 ? (sum.deposits += value) : (sum.withdrawals += value);
      return sum;
    },
    { deposits: 0, withdrawals: 0 }
  );

const { deposits, withdrawals } = accounts
  .flatMap(account => account.movements)
  .reduce(
    (sum, value) => {
      sum[value > 0 ? 'deposits' : 'withdrawals'] += value;
      return sum;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);*/

//4.
// this is a nice title -> This Is a Nice Title
/*const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.some(exception => exception === word)
        ? word
        : word.at(0).toUpperCase() + word.slice(1)
    )
    .join(' ');
  return titleCase;
};

const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];

  const capitalize = str => str.at(0).toUpperCase() + str.slice(1);

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.some(exception => exception === word) ? word : capitalize(word)
    )
    .join(' ');
  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too much'));
console.log(convertTitleCase('and here is another title'));*/

/*************** Coding Challenge #4 ***************/
/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. 
Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, 
and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). 
Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//recommendedFood = weight ** 0.75 * 28;
//1.
dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);

console.log(dogs);

//2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
dogSarah.curFood > dogSarah.recommendedFood
  ? console.log('Dog eats too much')
  : console.log('Dog eats too little');

console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
  }`
);

//3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .map(dog => dog.owners)
  .flat();

console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooLittle);

//4.
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);

console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

//5.
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

//6.
const checkEatingOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;

console.log(dogs.some(checkEatingOkay));

//7.
const okayAmount = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);

console.log(okayAmount);

//8.
const dogsCopy = dogs
  .slice()
  .sort((a, b) => (a.recommendedFood > b.recommendedFood ? 1 : 0));

console.log(dogsCopy);
