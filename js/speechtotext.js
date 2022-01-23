$(document).ready(function(){


  // ************************************************
  // Web Speech API Speech Recognition
  // ************************************************

    var speechRecognition = window.webkitSpeechRecognition;

    var recognition = new speechRecognition();

    var textbox = $("#textbox");
    var instructions = $("#instructions");

    var content = '';

    recognition.continuous = true;

    //when speech is detected

    recognition.onstart = function(){
        instructions.text("Voice Recognition is on");
    }

    recognition.onspeechend = function(){
        instructions.text("No Activity");
    }

    recognition.onerror = function(){
        instructions.text("Try Again");
    }

    recognition.onresult = function(event){
        var current  = event.resultIndex;

        var transcript = event.results[current][0].transcript;

        content += transcript;
        textbox.val(content);

        if ((transcript == 'Burger Hut') 
            || (transcript == 'burger hut')
            || (transcript == 'burger Hut')){
            window.location.href='burgerhut.html';
        }
        else if ((transcript == "Hot And Spicy") 
            || (transcript == 'hot and spicy') 
            || (transcript == 'Hot and spicy') 
            || (transcript == 'hot and Spicy')
            || (transcript == 'hot And spicy')
            || (transcript == 'Hot And spicy')
            || (transcript == 'hot And Spicy')) {
            window.location.href='hotnspicy.html';
        }
        else if ((transcript == 'Pizza Plex') 
            || (transcript == 'pizza plex')
            || (transcript == 'pizza Plex')
            || (transcript == 'Pizza plex')
            || (transcript == 'pizzaplex')
            || (transcript == 'PizzaPlex')) {
            window.location.href='pizzaplex.html';
        }
        else if (transcript == 'Raphaellos') {
            window.location.href='raphaellos.html';
        }
        else  {
            instructions.text("Not a valid option");
        }
    }

    $("#start-btn").click(function(event){
        if(content.length){
            content += '';
        }

        recognition.start();
    });

}); 