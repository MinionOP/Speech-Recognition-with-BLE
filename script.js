var message = document.querySelector('#message');
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammerList = SpeechGrammarList || webkitSpeechGrammerList; 

var grammer = '#JSGF V1.0;';

var recognition = new SpeechRecognition();
var speechRecognitionGrammerList = new SpeechGrammerList();

speechRecognitionGrammerList.addFromString(grammer, 1);

recognition.grammers = speechRecognitionGrammerList;
recognition.lang = 'en-US';
recognition.interimResults = false;

