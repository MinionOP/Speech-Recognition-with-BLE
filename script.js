
/*
const text = document.querySelector('.text');

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecongition;
const recognition = new window.SpeechRecognition();


recognition.interimResults = true;


let p = document.createElement('p');
recognition.addEventListener('result',(e)=>{
    console.log(e);
    })
recognition.start();

*/

/*
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var grammer = '#JSGF V1.0;';

var recognition = new SpeechRecognition();
var SpeechRecognitionGrammerList = new SpeechGrammarList();
SpeechRecognitionGrammerList.addFromString(grammer,1);
recognition.grammars = SpeechRecognitionGrammerList;
recognition.lang = 'en-US';
recognition.interimResults = false;


recognition.onspeechend = function(){
    recognition.stop();
}

recognition.onerror = function(event){

}
*/



function record(){
    var recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onspeechend = function(){
        recognition.stop();
    }

    recognition.onresult = function(event){
        console.log(event);
        document.getElementById('text').innerText = event.results[0][0].transcript;
    }
    recognition.start();
}

