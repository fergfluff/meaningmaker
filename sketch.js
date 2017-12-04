//CREATE THREE WEBPAGES
//1) ALMOST DONE
//-why is NaN printing
//-how to make a dotted line around the edge
//2) START - HOW DO I WRITE OVER A CANVAS
//3) START - SAME QUESTION

//HOW DO I BETTER ORGANIZE MY CODE - VERY LONG


//VARIABLES FOR SOUND recorder
let oldWords = [];
let newWord;
let hearCompButton;
let textbox;
let spelling;
let spellButton;
let recordButton;
let stopRecordButton;
let saveButton;
let name;
let nameBox;

//Aarons code
let currentKey = null;

//VARIABLES FOR SERIAL IN P5 SKETCH
let serial; // variable to hold an instance of the serialport library
let portName = '/dev/cu.usbmodem1421'; // fill in your serial port name here

//VARIABLES FOR PHONEMES
//MOUTH SENSORS 0 AND 1
let mouthOpenSensors = ['aeh', 'ahh', 'oahhh', 'uhh', 'hah', 'yah'];
let mouthOpenIndex = 0;
let mouthOpenSounds = [];

let mouthHalfwaySensors = ['ehh', 'ee', 'uouhh', 'er', 'aiy', 'aehh', 'ooo'];
let mouthHalfwayIndex = 0;
let mouthHalfwaySounds = [];

let mouthClosedSensors = ['mmm', 'pah', 'bah', 'wah'];
let mouthClosedIndex = 0;
let mouthClosedSounds = [];

//TEETH SENSOR 3 = PINCHING TOP OF TEETH = CONSONANTS
let teethSensors = ['vah', 'fah', 'rah'];
let teethIndex = 0;
let teethSounds = [];

//TONGUE SENSOR 4 = PRESSING TIP OF TONGUE = CONSONANTS
let tipTongueSensors = ['sah', 'zah', 'tha', 'lah'];
let tipTongueIndex = 0;
let tipTongueSounds = [];

//TONGUE SENSOR 5 = PRESSING MIDDLE OF TONGUE = CONSONANTS
let middleTongueSensors = ['nah', 'cha', 'tah', 'sha', 'zjyah', 'dah', 'juh'];
let middleTongueIndex = 0;
let middleTongueSounds = [];

//TONGUE SENSOR 6 = PRESSING BACK OF TONGUE = CONSONANTS
let backTongueSensors = ['kah', 'gah', 'eng'];
let backTongueIndex = 0;
let backTongueSounds = [];


//VARIABLES FOR BUILDING WORDS
let currentSyllable = "uhh";
let word = [];
let syllableArray;


//VARIABLES FOR RECEIVING SERIAL
var code;

//CODES
var arduinoToCodes = {
  //Order: mouthpressed, mouthclosed/mouthhalfway/mouthopen, teethpressed, tiptongue, middletongue, backtongue
  //No sounds
  '0,0,0,0,0,0': 90,
  '0,2,0,0,0,0': 88,
  '0,3,0,0,0,0': 67,
  //Sounds
  //Mouth closed
  '0,1,0,0,0,0': 65,
  //Mouth pressed and half way open
  '1,2,0,0,0,0': 83,
  //Mouth pressed and all the way open
  '1,3,0,0,0,0': 68,
  //Teeth
  '0,0,1,0,0,0': 70,
  //Tip of tongue
  '0,0,0,1,0,0': 71,
  //Middle of tongue
  '0,0,0,0,1,0': 72,
  //Back of tongue
  '0,0,0,0,0,1': 74,
}

var previousData;
var scheduled;
var previousSum = 0;


//PRELOAD

//PRELOAD BACKGROUND IMAGE
function preload() {
  felt = loadImage("feltbackground.jpg");

  //PRELOAD MP3S USING ARRAYS
  for (let i = 0; i < mouthOpenSensors.length; i++) {
    mouthOpenSounds.push(loadSound("soundfiles/" + mouthOpenSensors[i] + ".mp3"));
  }
  for (let j = 0; j < mouthHalfwaySensors.length; j++) {
    mouthHalfwaySounds.push(loadSound("soundfiles/" + mouthHalfwaySensors[j] + ".mp3"));
  }
  for (let k = 0; k < mouthClosedSensors.length; k++) {
    mouthClosedSounds.push(loadSound("soundfiles/" + mouthClosedSensors[k] + ".mp3"));
  }
  for (let m = 0; m < teethSensors.length; m++) {
    teethSounds.push(loadSound("soundfiles/" + teethSensors[m] + ".mp3"));
  }
  for (let n = 0; n < tipTongueSensors.length; n++) {
    tipTongueSounds.push(loadSound("soundfiles/" + tipTongueSensors[n] + ".mp3"));
  }
  for (let o = 0; o < middleTongueSensors.length; o++) {
    middleTongueSounds.push(loadSound("soundfiles/" + middleTongueSensors[o] + ".mp3"));
  }
  for (let p = 0; p < backTongueSensors.length; p++) {
    backTongueSounds.push(loadSound("soundfiles/" + backTongueSensors[p] + ".mp3"));
  }
}

//SET UP
function setup() {
  //SET UP CANVAS
  createCanvas(windowWidth, windowHeight);
  background(felt);
  smooth(); // antialias drawing lines


  //ADD A PHONEME
  let addSoundButton = createButton('Add');
  addSoundButton.mousePressed(addSoundFunction);
  addSoundButton.position(width / 3 + 120, height / 3 + 100);
  addSoundButton.style('font-size', '30px');
  addSoundButton.size(125, 50);

  //DELETE A PHONEME
  let deleteSoundButton = createButton('Delete');
  deleteSoundButton.mousePressed(deleteSoundFunction);
  deleteSoundButton.position(width / 3 + 260, height / 3 + 100);
  deleteSoundButton.style('font-size', '30px');
  deleteSoundButton.size(125, 50);

  //INPUT FIELD FOR USER SPELLING
  spellingBox = createInput();
  spellingBox.position(width / 2, height / 3 + 275);
  spellingBox.size(300, 30);

  //RECORD BUTTON
  let recordButton = createButton('Record');
  recordButton.mousePressed(recordFunction);
  recordButton.position(width / 2, height / 3 + 350);
  recordButton.style('font-size', '20px');
  recordButton.size(100, 50);

  //STOP RECORDING BUTTON
  let stopRecordButton = createButton('Stop');
  stopRecordButton.mousePressed(stopRecordFunction);
  stopRecordButton.position(width / 2 + 125, height / 3 + 350);
  stopRecordButton.style('font-size', '20px');
  stopRecordButton.size(100, 50);

  //INPUT FIELD FOR USER NAME
  nameBox = createInput();
  nameBox.position(width / 2, height / 3 + 425);
  nameBox.size(300, 30);

  //BUTTON FOR SAVING WORD
  let saveButton = createButton('Save Word');
  saveButton.mousePressed(saveFunction);
  saveButton.position(width / 3 + 175, height / 3 + 475);
  saveButton.style('font-size', '30px', 'color', '#ff0000')
  saveButton.size(200, 60);


  //SET UP SERIAL PORT
  try {
    serial = new p5.SerialPort(); // make a new instance of the serialport library
    serial.on('list', printList); // set a callback function for the serialport list event
    serial.on('connected', serverConnected); // callback for connecting to the server
    serial.on('open', portOpen); // callback for the port opening
    serial.on('data', serialEvent); // callback for when new data arrives
    serial.on('error', serialError); // callback for errors
    serial.on('close', portClose); // callback for the port closing

    serial.list(); // list the serial ports
    serial.open(portName); // open a serial port

    serial.write('x');
  } catch (err) {
    console.log("oops");
  }

  //SET UP RECORDER
  mic = new p5.AudioIn();
  mic.start();
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  newWord = new p5.SoundFile();

}

function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    print(i + " " + portList[i]);
  }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}

function serialEvent() {
  //Takes string from serial communication, logs that string to the console,
  //finds out if the data is more than 0 (if data is coming in), splits the dataset
  //by looking for values in between commas, stores those values into spots in arrays
  //if there are no sensors pressed, store that in old data to compare to new dataset
  //if there is data that's different than the old data and is more than 0/less than 6
  //clear the data first, then store the new data into old data, then match data
  //to codes written above, and then call the function below for each code/sensor combination
  //being pressed.
  var data = serial.readLine();
  console.log(data);
  if (data.length > 0) {
    var states = data.split(',');
    var sum = int(states[0]) + int(states[1]) + int(states[2]) + int(states[3]) + int(states[4]) + int(states[5] + int(states[6]));
    if (sum == 0) {
      previousSum = 0;
      previousData = data;
    } else if (data != previousData && sum > previousSum && sum < 6) {
      clearTimeout(scheduled);
      previousData = data;
      previousSum = sum;
      scheduled = setTimeout(function() {
        code = arduinoToCodes[data];
        playCode(code);
      }, 200);
    }
    serial.write('x'); // send a byte requesting more serial data
  }
}
//SHOW CURRENT PHONEME IN CENTER AND SHOW USER'S SELECTED SOUNDS
//TO BOTTOM OF SCREEN
function draw() {
  background(felt);
  textSize(200);
  fill(0);
  text(currentSyllable, width / 3 + 75, 275);
  line(800, 500, 1500, 500);

  //SET UP TEXT, BUTTONS, INPUTS ON SCREEN
  //TITLE
  fill(0);
  textAlign(width / 2, height / 2);
  textSize(50);
  text('Build an Original Word', width / 3, 60);

  //CURRENT PHONEME
  //Found in draw()

  //PRINT OUT CURRENT WORD
  textSize(50);
  text('Current Word:', width / 3 - 200, height / 3 + 225);
  text(word, width / 3 + 250, height / 3 + 225);

  fill(0);
  textSize(30);
  text('My spelling:', spellingBox.x - 200, spellingBox.y + spellingBox.height - 8);
  spelling = spellingBox.value();

  text('My pronunciation:', width / 2 - 275, height / 3 + 375);

  fill(0);
  textSize(30);
  text('My name:', nameBox.x - 175, nameBox.y + nameBox.height - 8);
}

//FUNCTIONS THAT ARE CALLED WHEN SENSORS ARE PRESSED

//This function is called when the mouthOpenSensor is triggered.
//Finds the next element in the mouth0Index by using an index pointer/counter
//and stores it into the currentSyllable variable which is GLOBAL so it can be used
//in other functions in my code.
function mouthOpenFunction() {
  print("Mouth Open!");
  let sound = mouthOpenSensors[mouthOpenIndex];
  //Takes created array of mouth0Sounds with the index counter's value
  //and plays that sound
  mouthOpenSounds[mouthOpenIndex].play();
  currentSyllable = sound;
  print(sound);
  mouthOpenIndex++;
  if (mouthOpenIndex > mouthOpenSensors.length - 1) {
    mouthOpenIndex = 0;
  }
}

function mouthHalfwayFunction() {
  print("Mouth Halfway Open!");
  let sound = mouthHalfwaySensors[mouthHalfwayIndex];
  mouthHalfwaySounds[mouthHalfwayIndex].play();
  currentSyllable = sound;
  print(sound);
  mouthHalfwayIndex++;
  if (mouthHalfwayIndex > mouthHalfwaySensors.length - 1) {
    mouthHalfwayIndex = 0;
  }
}

function mouthClosedFunction() {
  print("Mouth Closed!");
  let sound = mouthClosedSensors[mouthClosedIndex];
  mouthClosedSounds[mouthClosedIndex].play();
  currentSyllable = sound;
  print(sound);
  mouthClosedIndex++;
  if (mouthClosedIndex > mouthClosedSensors.length - 1) {
    mouthClosedIndex = 0;
  }
}

function teethFunction() {
  print("Teeth Pinched!");
  let sound = teethSensors[teethIndex];
  teethSounds[teethIndex].play();
  currentSyllable = sound;
  print(sound);
  teethIndex++;
  if (teethIndex > teethSensors.length - 1) {
    teethIndex = 0;
  }
}

function tipTongueFunction() {
  print("Tip of tongue pressed!");
  let sound = tipTongueSensors[tipTongueIndex];
  tipTongueSounds[tipTongueIndex].play();
  currentSyllable = sound;
  print(sound);
  tipTongueIndex++;
  if (tipTongueIndex > tipTongueSensors.length - 1) {
    tipTongueIndex = 0;
  }
}

function middleTongueFunction() {
  print("Middle of tongue pressed!!");
  let sound = middleTongueSensors[middleTongueIndex];
  middleTongueSounds[middleTongueIndex].play();
  print(sound);
  currentSyllable = sound;
  middleTongueIndex++;
  if (middleTongueIndex > middleTongueSensors.length - 1) {
    middleTongueIndex = 0;
  }
}

function backTongueFunction() {
  print("Back of tongue pressed!!");
  let sound = backTongueSensors[backTongueIndex];
  backTongueSounds[backTongueIndex].play();
  print(sound);
  currentSyllable = sound;
  backTongueIndex++;
  if (backTongueIndex > backTongueSensors.length - 1) {
    backTongueIndex = 0;
  }
}

function saveFunction() {
  //Save results to "server"
  print("Save results");
}


//VARIABLES FOR ASSIGNING SERIAL DATA TO KEY BUTTONS
//GETS MAPPED DATA OF WHICH SENSOR COMBINATIONS EQUAL WHICH CODES BELOW,
//AND ASSIGNS THEM TO FUNCTIONS TO BE CALLED

function playCode(code) {
  print(code);

  //NO SOUNDS
  if (code === 90) {
    //Key Z
    noSoundsFunction();
  }
  if (code === 88) {
    //Key X
    noSoundsFunction();
  }
  if (code === 67) {
    //Key C
    noSoundsFunction();
  }
  //SOUNDS
  if (code === 65) {
    //Key a;
    mouthClosedFunction();
  }
  if (code === 83) {
    //Key s;
    mouthHalfwayFunction();
  }
  if (code === 68) {
    //Key d;
    mouthOpenFunction();
  }
  if (code === 70) {
    //Key e;
    teethFunction();
  }
  if (code === 71) {
    //Key f;
    tipTongueFunction();
  }
  if (code === 72) {
    //Key g;
    middleTongueFunction();
  }
  if (code === 74) {
    //Key h;
    backTongueFunction();
  }
}


function keyPressed() {
  console.log('hellloooo')

  currentKey = keyCode;

  //retrieve the value from keyCode and assign it to my own variable currentKey
  if (keyCode === 32) {
    //Space bar
    enterFunction();
  }

  //NO SOUNDS
  if (currentKey === 90) {
    //Key Z
    noSoundsFunction();
  }
  if (currentKey === 88) {
    //Key X
    noSoundsFunction();
  }
  if (currentKey === 67) {
    //Key C
    noSoundsFunction();

  }
  //SOUNDS
  if (currentKey === 49) {
    //Key 1;
    mouthClosedFunction();
  }
  if (currentKey === 50) {
    //Key 2;
    mouthHalfwayFunction();
  }
  if (currentKey === 51) {
    //Key 3;
    mouthOpenFunction();
  }
  if (currentKey === 52) {
    //Key 4;
    teethFunction();
  }
  if (currentKey === 53) {
    //Key 5;
    tipTongueFunction();
  }
  if (currentKey === 54) {
    //Key 6;
    middleTongueFunction();
  }
  if (currentKey === 55) {
    //Key 7;
    backTongueFunction();
  }


  //NOT WRITTEN YET
  //Not written yet
  //When delete is pressed, clear the result
  if (currentKey === 8) {
    //Delete key
    deleteFunction();
  }
  //Not written yet
  //When Command button is pressed, save the result
  if (currentKey === 91) {
    //Command button
    saveFunction();
  }
}


//FUNCTIONS FOR RECORDING
function addSoundFunction() {
  console.log("heyooo");
  word += currentSyllable;
}

function deleteSoundFunction() {
  console.log("haii");
  word -= currentSyllable;
}

function recordFunction() {
  if (mic.enabled) {
    console.log("helllooo")
    recorder.record(newWord);
  }
}

function stopRecordFunction() {
  recorder.stop();
  console.log("hiiiii")
}

function nameFunction() {
  console.log("yooooo")
  name = nameBox.value();
  console.log(name);
}

function saveFunction() {
  newWord.play(); // play the result!
  save(newWord, spelling + 'by' + name + '.wav'); // save the result
}
