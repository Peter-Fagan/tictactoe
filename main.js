
var backgroundAudio = new Audio ("audio/ipanema.mp3");
var xWinAudio = new Audio("audio/BM_thanks.mp3");
var oWinAudio = new Audio("audio/NC_thanks.mp3");
var drawAudio = new Audio("audio/BM_drunk.mp3");

var winner = "none";                            //starts winner at none

var winningConditions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var buttonClicks = [ "_", "_", "_", "_", "_", "_", "_", "_", "_" ];

var counter = 0;                                // starts a turn counter
var crossTurn = true;                           //starts the "turncounter" at cross
$("#noughtTurn").fadeTo(200, 0.5);              //fades the nought image

function getHistory() {
  var XWins =localStorage.getItem("XWins");     //gets the X score form storage
  var OWins =localStorage.getItem("OWins");     //gets the O score from storage
  if (XWins === null) {                         //checks if there is a number stored
    localStorage.setItem ("XWins","0");         //Sets score to 0 if none there
  }
  if (OWins === null) {                         //checks if there is a number stored
    localStorage.setItem ("OWins","0");         //sets score to 0 if none there
  }
 }
 getHistory();

var addEventHandlers = function () {            //keeps all events in the right order
  $(".gameButton").off();
  function oneHandler (){                       //registers buttons first click
    if (crossTurn) {
      $("#noughtTurn").fadeTo(200, 1);
      $("#crossTurn").fadeTo(200, 0.5);
      $(this).addClass("cross");                //adds a class of cross if crosses turn
      // console.log("X");
    } else {
      $("#noughtTurn").fadeTo(200, 0.5);
      $("#crossTurn").fadeTo(200, 1);
      $(this).addClass("nought");               //adds a class of nought if noughts turn
      // console.log("O");
    }
    counter=counter+1;                            //increments counter to help determine draw
  }
  $(".gameButton").one("click", oneHandler);
  $(".gameButton").one("click", function() {       //when a gamebutton is clicked
    var position = $(this).attr("data-position"); //set the position to the number in data-position
    if ( crossTurn ) {                            //sets an X or an O depending on crossTurn
      turn = "X";
    } else {
      turn = "O";
    }
    crossTurn = !crossTurn;                       //flips the turn
    buttonClicks[position] = turn;                //stores X or O in the correct position in array
    console.log(buttonClicks);                    //logs the array

    for (var i=0; i<winningConditions.length; i+=1) { //iterate through the winning conditions
      var currentTest = winningConditions[i];         // for each array
      var firstElement = currentTest[0];              //store the first element
      var secondElement = currentTest[1];             //store the second element
      var thirdElement = currentTest[2];              //store the third element

      if (buttonClicks[firstElement] === buttonClicks[secondElement] && buttonClicks[secondElement] === buttonClicks[thirdElement] && buttonClicks[thirdElement] === "X") { //test if each element are the same and they equal X
        winner = "X";                                 //sets X as winner
        winning("X");
      } else if (buttonClicks[firstElement] === buttonClicks[secondElement] && buttonClicks[secondElement] === buttonClicks[thirdElement] && buttonClicks[thirdElement] === "O") {                                //else test if the elements are all the same and equal O
        winner = "O";                                 //sets O as winner
        winning("O");
      } else if (winner==="none" && counter===9) {  //if the counter is 9 and no winner, its a draw
        winner = "draw";
        winning("draw");
      }
    }
  });
};

function startGame () {                         //starts the game
  addEventHandlers();                           // initiates event handlers
  backgroundAudio.play();                       //start the background music
  $("#crossWins").html("Cross wins: " + (localStorage.getItem("XWins"))); //displays the score from storage
  $("#noughtWins").html("Nought wins: " + (localStorage.getItem("OWins"))); //displays the score from storage

}
startGame();

$("#reset").click(function(e) {                   //when the reset button is clicked
  if (e.altKey) {                                 //by holding the alt key when you click on the reset button , it will reset stored scores
  localStorage.setItem ("XWins","0");
  localStorage.setItem ("OWins","0");
}
  $(".gameButton").removeClass("cross");          //remove the cross class
  $(".gameButton").removeClass("nought");         //remove the nought class
  $(".gameButton").prop("disabled", false);       //re-enables the game buttons
  crossTurn = true;                               //resets turns to cross first
  buttonClicks.fill ("_");                        //resets buttonClicks
  counter = 0;                                    //resets the counter
  winner = "none";                                //resets the winner
  $("#crossTurn").fadeTo(200, 1).height(151);     //resets to cross turn
  $("#noughtTurn").fadeTo(200, 0.5).height(151);  //resets nought faded
  backgroundAudio.currentTime = 0;                //restarts the background music
  startGame();                                    //initiates start of game
});


var winning = function (winner) {
  $(".gameButton").prop("disabled", true);        //disables all unused buttons
  backgroundAudio.pause();                        //pause the background music
  if (winner === "X") {                           //sets X winning conditions
    $("#noughtTurn").fadeTo(200, 0);              //hides the nought image
    localStorage.XWins = parseInt(localStorage.getItem("XWins")) + 1; //Increments wins
    xWinAudio.play();                             //plays the X audio
    $("#crossTurn").animate({                     //enlarges the X image
      height:300,
      opacity: 1
    });
  } else if ( winner === "O") {                   //sets O winning conditions
    $("#crossTurn").fadeTo(200, 0);               //hides the nought image
    localStorage.OWins = parseInt(localStorage.getItem("OWins")) + 1; //increments wins
    oWinAudio.play();                             //plays the O audio
    $("#noughtTurn").animate({                    //enlarges the O image
      height:300,
      opacity: 1
    });
  } else if (winner === "draw") {                 //if there is a draw
    drawAudio.play();                             //plays draw audio
  }
  var xScore = parseInt(localStorage.getItem("XWins")); //gets the X score from storage
  var oScore = parseInt(localStorage.getItem("OWins")); //gets the O score from storage
  $("#crossWins").html("Cross wins: " + xScore);   //X scoreboard
  $("#noughtWins").html("Nought wins: " + oScore); //O scoreboard
};
