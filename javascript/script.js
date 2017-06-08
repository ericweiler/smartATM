// Store frame for motion functions
var previousFrame = null;
var paused = false;
var waitGesture = true;
var frameCount = 0;
var prevSelect = 0;
var selected = false;
var selection = "59389eaeceb8abe24251788e";
// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: true};

//variables for webpages
var swipe = 0;
var inputNum = 0;
var inputArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var thumbsUp = 0;
var thumbsDown = 0;
var thumbConfirm = "";
  var inputString = "";
var urls = ["index.html", "welcome.html", "account.html"];

// to use HMD mode:
// controllerOptions.optimizeHMD = true;

Leap.loop(controllerOptions, function(frame) {

//get the current page
var currentPage = getIndex(window.location.pathname.split("/").pop());


  if (frameCount > 50)
  {
      waitGesture = false;
  }
  
  frameCount++;
 
  // Display Frame object data
  var frameOutput = document.getElementById("frameData");

  var frameString = "Frame ID: " + frame.id  + "<br />"
                  + "Timestamp: " + frame.timestamp + " &micro;s<br />"
                  + "Hands: " + frame.hands.length + "<br />"
                  + "Fingers: " + frame.fingers.length + "<br />"
                  + "Tools: " + frame.tools.length + "<br />"
                  + "Gestures: " + frame.gestures.length + "<br />";
  // Frame motion factors
  if (previousFrame && previousFrame.valid) {
    var translation = frame.translation(previousFrame);
    frameString += "Translation: " + vectorToString(translation) + " mm <br />";

    var rotationAxis = frame.rotationAxis(previousFrame);
    var rotationAngle = frame.rotationAngle(previousFrame);
    frameString += "Rotation axis: " + vectorToString(rotationAxis, 2) + "<br />";
    frameString += "Rotation angle: " + rotationAngle.toFixed(2) + " radians<br />";

    var scaleFactor = frame.scaleFactor(previousFrame);
    frameString += "Scale factor: " + scaleFactor.toFixed(2) + "<br />";
  }
  frameOutput.innerHTML = "<div style='width:300px; float:left; padding:5px'>" + frameString + "</div>";


  var extendedOutput = document.getElementById("extended");
  var extendedString = "";
  var extendedFingers = 0;

  // var inputOutput = document.getElementById("inputData");

  //loop through hand and count extended fingers
  if (frame.hands.length > 0) {
   for (var i = 0; i < frame.hands.length; i++) {
      var hand = frame.hands[i];
      extendedFingers = countExtended(hand);

   if (hand.type == "right") {
    if (hand.palmNormal[0] <= -.5) {
      var thumbPosition = "Thumbs Up";  
      thumbsUp += 1
    }
    else if (hand.palmNormal[0] >= .5) {
      thumbPosition = "Thumbs Down";
      thumbsDown += 1 
    }
    else {
      thumbPosition = "Fail";
    }
  }
  else {
    if (hand.palmNormal[0] <= -.5) {
      thumbPosition = "Thumbs Down";  
      thumbsDown ++; 
    }
    else if (hand.palmNormal[0] >= .5) {
      thumbPosition = "Thumbs Up";
      thumbsUp ++;
    }
    else {
      thumbPosition = "Fail";
    }
  }

  if (currentPage != 0)
  {
    var inputNum = findMax();
    var foo = document.getElementById("inputmax");
    foo.innerHTML = inputNum;
   
   switch (inputNum)
    {
     
      case 1:
        if (prevSelect != 1)
        {
         reset();
          var select = document.getElementById("select1");
          select.innerHTML = "<img class='options' src='images/RightHand-1-select.svg'/>";
        }
        break;
      case 2:
        if (prevSelect != 2)
        {
         reset();
        var select = document.getElementById("select2");
        select.innerHTML = "<img class='options' src='images/RightHand-2-select.svg'/>";
        }
        break;
      case 3:
        if (prevSelect != 3)
        {
         reset();  
        var select = document.getElementById("select3");
        select.innerHTML = "<img class='options' src='images/RightHand-3-select.svg'/>";
       }
        break;
    }

    //set previously selected option
    prevSelect = inputNum;

      if (confirmThumbs() == 1)
      {
        confirmSelection();
      }
      else
      {
       if (extendedFingers > 0)
       {
          inputArray[extendedFingers - 1]++;
        }
      }
  }

    
    }
  }

 if (currentPage != 0)
  //extendedOutput.innerHTML = extendedFingers;

  if (frame.gestures.length > 0) {
    if (!waitGesture)
    {
    for (var i = 0; i < frame.gestures.length; i++) {
      var gesture = frame.gestures[i];
      switch (gesture.type) {
        case "circle":
          break;
        case "swipe":
         navigate(currentPage);        
          break;
        case "screenTap":
          break;
        case "keyTap":
          break;
        default:
          
      }
    }
  }
}
  // Store frame for motion functions
  previousFrame = frame;
})

function navigate(currentPage)
{
  if(currentPage==1){ window.location = "account.html"; }
  if (selected == true && currentPage > 0
    || currentPage == 0)
  {
    window.location = urls[currentPage + 1];
  }
  else
  {
    window.location = urls[currentPage - 1];
  }
}

function confirmSelection(currentPage)
{
    selected = true;
    
    switch (prevSelect)
    {
      case 1: 
        selection = "593882e4ceb8abe242517839";
        break;
      case 2:
        selection = "59389eaeceb8abe24251788e";
        break;
      case 3:
        selection = "59380fd0a73e4942cdafd723";
        break;
    }
    
    navigate(currentPage);

}

function getIndex(url)
{
  switch (url)
  {
    case "index.html":
      return 0;
    case "welcome.html":
      return 1;
    case "account.html":
      return 2;
    default:
      return -1;
  }
}

function countExtended(hand)
{
  var extended = 0;
      for(var f = 0; f < hand.fingers.length; f++){
          
          var finger = hand.fingers[f];
          if(finger.extended) extended++;
      }

    return extended;
}

function confirmThumbs() {
  if (thumbsUp >= 100) {
    return 1;
  }
  else if (thumbsDown >= 100) {
    return -1;
  }
  else
  {
    return 0;
  }

}

function findMax()
{
  var maxCount = 0;
  var maxIndex = 0;

  for (var i = 0; i < inputArray.length; i++)
  {
    if (maxCount < inputArray[i])
    {
      maxCount = inputArray[i];
      maxIndex = i;
    }
  }

  return maxIndex+1;
}

function vectorToString(vector, digits) {
  if (typeof digits === "undefined") {
    digits = 1;
  }
  return "(" + vector[0].toFixed(digits) + ", "
             + vector[1].toFixed(digits) + ", "
             + vector[2].toFixed(digits) + ")";
}

function togglePause() {
  paused = !paused;

  // if (paused) {
  //   document.getElementById("pause").innerText = "Resume";
  // } else {
  //   document.getElementById("pause").innerText = "Pause";
  // }
}

function pauseForGestures() {
  if (document.getElementById("pauseOnGesture").checked) {
    pauseOnGesture = true;
  } else {
    pauseOnGesture = false;
  }
}

function reset()
{
    //reset counting array
    for (var i = 0; i < inputArray.length; i++)
    {
      inputArray[i] = 0;
    }
    //reset counting variables
    thumbsUp = 0;
    thumbsDown = 0;

    var select1 = document.getElementById("select1");
    select1.innerHTML = "<img class='options' src='images/RightHand-1-tilt.svg'/>";
    var select2 = document.getElementById("select2");
    select2.innerHTML = "<img class='options' src='images/RightHand-2-tilt.svg'/>";
    var select3 = document.getElementById("select3");
    select3.innerHTML = "<img class='options' src='images/RightHand-3-tilt.svg'/>";
}

function displaySelected(){
  var nick = document.getElementById("nick");
  getNickname(selection, nick);

  var bal = document.getElementById("balance");
  getBalance(selection, bal);
}

var curPage = window.location.pathname.split("/").pop();

if(curPage === "account.html" && selection != ""){
  displaySelected();

}