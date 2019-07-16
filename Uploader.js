function UploadSelData(){    
    currentSelId = GetSelId();                       
    messageTextBox = document.querySelectorAll('*[id^="im_editable"]')[0];
    messageSendButton =  document.getElementsByClassName("im-send-btn")[1];
    messageBox = document.getElementsByClassName("im-page-history-w")[0];        
    UpdateKeys();
    UploadPrefixes();
    UploadStaticKeys();    
}

function UploadKeys(){    
    keyChooser.innerHTML="<option value=\"-1\">Choose keys</div>";
    for(var i=0;i<GetLastKeyIndex();i++){
        var option = document.createElement("option");
        option.textContent = "Key "+i;
        option.value = i;
        keyChooser.appendChild(option);
    }        
}

function UploadPrefixes(){
    currentPrefixSend = localStorage.getItem("vita_presend");
    if(currentPrefixSend==undefined || currentPrefixSend==""){
        currentPrefixSend = "vita";
    }
    prefixSendSetter.value=currentPrefixSend;  
    var curPreRec = localStorage.getItem("vita_prerec");
    if(curPreRec==undefined || curPreRec==""){
        currentPrefixesRecieve=["vita","VITA"];
    }
    else{
        currentPrefixesRecieve = curPreRec.split(";");
    }
    prefixRecieveSetter.value = currentPrefixesRecieve.join(";");
}

function GetLastKeyIndex(){
    var count=0;
    for(var i=0;;i++){
        if(localStorage.getItem("vita_k"+i+"_"+currentSelId)==undefined)
            break;
        count++;
    }
    return count;
}

function GetAllSelKeys(){
    allSelKeys=[];
    phrases=[];
    for(var i=0;;i++){
        var phrase = localStorage.getItem("vita_k"+i+"_"+currentSelId);
        if(phrase==undefined || phrase==""){
            break;
        }
        allSelKeys.push(
            new Key(cryptico.generateRSAKey(phrase,1024), phrase)
        );
        phrases.push(phrase);
    }    
}

function UpdateKeys(){
    GetAllSelKeys();
    UploadKeys();
}

function UploadStaticKeys(){
    if(staticKeys==undefined){        
        if(localStorage.getItem("vita_static")==undefined){
            var generated = GenerateKeys();                
            staticKeys =  generated;                               
            localStorage.setItem("vita_static",generated.phrase);                
        }
        else{
            var phrase = localStorage.getItem("vita_static");
            staticKeys = GenerateKeys(phrase);                
        }
    }
}