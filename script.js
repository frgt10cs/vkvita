var url = document.URL;
var currentSelId;
var currentKeys;
var allSelKeys=[];

var phrases=[];

var currentPrefixSend;
var currentPrefixesRecieve = [];

var messageBox;

var opened=false;

setInterval(() => {
    if(IsInDialog()){
        DecryptMessages();
    }
}, 3000);

document.onkeydown = function(k){
    if(k.ctrlKey && k.which==77){
        OpenExt();        
    }                
}

var canDecrypt = true;

function IsInDialog(){
    return (document.URL.indexOf("vk.com") != -1 && document.URL.indexOf("sel") != -1 && GetSelId()!=null);
}

function OpenExt(){    
    if (IsInDialog()) {   
        if(!opened){
            currentSelId = GetSelId();                       
            messageTextBox = document.querySelectorAll('*[id^="im_editable"]')[0];
            messageSendButton =  document.getElementsByClassName("im-send-btn")[1];
            messageBox = document.getElementsByClassName("im-page-history-w")[0];        
            TurnOnGui();                        
            DecryptMessages();
        }
        else{
            TurnOffGui();
        }
        opened=!opened;
    }
    else{
        TurnOffGui();
        opened=false;
    }    
}

function TurnOffGui(){
    if(userSettingsPanel!=undefined)
            userSettingsPanel.style.display="none";
    if(userActionPanel!=undefined)
        userActionPanel.style.display="none";
}

function TurnOnGui(){
    if(!document.getElementById("setPanel") || !document.getElementById("acPanel")){            
        ConnectStyles();        
        CreateMainPanel(); 
        isActionHidded=false;
        isSettingsHidded=false;                         
    }
    else{
        userSettingsPanel.style.display="block";
        userActionPanel.style.display="block";
    }
    UploadSelData();        
}

function DecryptMessages(){      
    var mesDivs = messageBox.getElementsByClassName("im-mess--text");     
    for(var i=0; i<mesDivs.length;i++){       
        if(mesDivs[i].classList.contains("vita-checked")){            
            return;                               
        }                  
        if(IsEncrypted(mesDivs[i].textContent)){
            ExecuteMessage(mesDivs[i].textContent, mesDivs[i]); 
        }              
        mesDivs[i].classList.add("vita-checked");                      
    }          
}

var alphabit = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

var messageTextBox;
var messageSendButton;

var staticKeys;

var defaultPrefixSend="vita";

function GetSelId(){
    var params = document.URL.split("?")[1].split("&");
    for(var i=0;i<params.length;i++){
        if(params[i].indexOf("sel")!=-1){
            return params[i].split("=")[1][0]=="c"?null:params[i].split("=")[1];
        }
    }    
}

function SendMessage(message){     
    messageTextBox.textContent = message;
    messageSendButton.click();   
}

function SendEncryptMessage(message){  
    if(message!=undefined && message!="")   {
        if(isRus){
            message=encodeURI(message);
        }    
        if(keyChooser.value!=-1){
            var crypted = cryptico.encrypt(message, cryptico.publicKeyString(currentKeys.RSA));
            SendMessage((currentPrefixSend==""?defaultPrefixSend:currentPrefixSend)+" -m "+crypted.cipher+" -k "+keyChooser.value+(isRus?" -r":""));        
        }
        else{
            LogWrite("Choose keys for encryption");            
        }   
    }
    else{
        LogWrite("Message is empty");
    }
}

function GenerateKeys(passPhrase="r"){
    var rnd = Math.round(Math.random()*30+10);
    if(passPhrase=="r"){
        passPhrase="";
        for(var i=0;i<rnd;i++){
            var rand = Math.round(Math.random()*61);
            passPhrase+=alphabit[rand];
        } 
    }               
    var RSAKey = cryptico.generateRSAKey(passPhrase, 1024);      
    var key = new Key(RSAKey, passPhrase);             
    return key;
}

class Key{
    constructor(RSA, phrase){
        this.RSA = RSA;
        this.phrase = phrase;
    }
}

function IsEncrypted(message){       
    for(var i=0;i<currentPrefixesRecieve.length;i++){
        var current = currentPrefixesRecieve[i]+" ";
        if(message.length<current.length)                
            continue;
        var result=true;
        for(var j=0;j<current.length;j++){
            if(message[j]!=current[j]){
                result = false;
                break;
            }                
        }
        if(result)
            return true;
    }
    return false;
}

function ExecuteMessage(message, block){
    var args = parse_cmdline(message);        
    if(args.indexOf("-a")==1){
        var exchangeBut = document.createElement("button");
        exchangeBut.innerHTML="Send Keys";
        exchangeBut.onclick=function(){
            ExchangeKeys(args[2]);
        }
        block.innerHTML="";
        block.appendChild(exchangeBut);
        return;
    }
    if(args.indexOf("-p")==1){
        var setBut = document.createElement("button");
        setBut.textContent="Set keys";
        setBut.onclick=function(){
            var phrase = cryptico.decrypt(args[2],staticKeys.RSA).plaintext;
            SetPhrase(phrase);
            UpdateKeys();
        }
        block.textContent="";
        block.appendChild(setBut);        
        return;
    }
    if(args.indexOf("-c")==1){
        var sendKeys = document.createElement("button");
        sendKeys.textContent="Send keys for check";
        sendKeys.onclick=function(){
            SendKeys(args[2]);
        }
        block.textContent="";
        block.appendChild(sendKeys);        
        return;
    }
    if(args.indexOf("-h")==1){
        var checkKeys = document.createElement("button");
        checkKeys.textContent="Check keys";
        checkKeys.onclick=function(){
            CheckKeys(args[2]);
        }        
        block.textContent="";
        block.appendChild(checkKeys);        
        return;
    }
    var numberM = args.indexOf("-m");
    var numberK = args.indexOf("-k");
    if(numberM!=-1 && allSelKeys.length>0){
        if(allSelKeys.length>Number(args[numberK+1])){
            var rus = (args.indexOf("-r")!=-1);
            var decrypted = cryptico.decrypt(args[numberM+1],allSelKeys[args[numberK+1]].RSA);                
            var text = decrypted.plaintext;
            if(rus){
                text=decodeURI(text);
            }
            block.textContent = text;
        }    
    }
}

function SendKeys(publicKey){
    var keys = phrases.join(" ");
    var crypted = cryptico.encrypt(keys, publicKey);
    SendMessage("vita -h "+crypted.cipher);
}

function CheckKeys(text){
    var phrases_ = cryptico.decrypt(text, staticKeys.RSA).plaintext.split(" ");
    var length=phrases.length;    
    if(phrases.length!=phrases_.length){
        length = phrases.length>phrases_.length?phrases.length:phrases_.length;
    }    
    var edited=false;    
    for(var i=0;i<length;i++){
        if(phrases[i]!=phrases_[i]){
            if(phrases_[i]==undefined){
                localStorage.removeItem("vita_k"+i+"_"+currentSelId);
                break;
            }          
            localStorage.setItem("vita_k"+i+"_"+currentSelId, phrases_[i]);                        
            edited=true;
        }
    }
    var answer="Keys are same";
    if(edited){
        answer="Keys was not same. Fixed.";
        UploadKeys();
    }
    LogWrite(answer); 
}

function ExchangeKeys(publicKey){    
    var generated = GenerateKeys();
    SetPhrase(generated.phrase, currentSelId);    
    var crypted = cryptico.encrypt(generated.phrase, publicKey);      
    SendMessage("vita -p "+crypted.cipher);
    UpdateKeys();
}

function SetPhrase(phrase){    
    var index = GetLastKeyIndex();
    if(phrases.indexOf(phrase)==-1){
        localStorage.setItem("vita_k"+index+"_"+currentSelId,phrase);
        LogWrite("Succesful");
    }
    else{
        LogWrite("You have these keys already");
    }
}

function parse_cmdline(cmdline) {
    var re_next_arg = /^\s*((?:(?:"(?:\\.|[^"])*")|(?:'[^']*')|\\.|\S)+)\s*(.*)$/;
    var next_arg = ['', '', cmdline];
    var args = [];
    while (next_arg = re_next_arg.exec(next_arg[2])) {
        var quoted_arg = next_arg[1];
        var unquoted_arg = "";
        while (quoted_arg.length > 0) {
            if (/^"/.test(quoted_arg)) {
                var quoted_part = /^"((?:\\.|[^"])*)"(.*)$/.exec(quoted_arg);
                unquoted_arg += quoted_part[1].replace(/\\(.)/g, "$1");
                quoted_arg = quoted_part[2];
            } else if (/^'/.test(quoted_arg)) {
                var quoted_part = /^'([^']*)'(.*)$/.exec(quoted_arg);
                unquoted_arg += quoted_part[1];
                quoted_arg = quoted_part[2];
            } else if (/^\\/.test(quoted_arg)) {
                unquoted_arg += quoted_arg[1];
                quoted_arg = quoted_arg.substring(2);
            } else {
                unquoted_arg += quoted_arg[0];
                quoted_arg = quoted_arg.substring(1);
            }
        }
        args[args.length] = unquoted_arg;
    }
    return args;
}

function LogWrite(text){
    loggerInput.value+=text+"\n";
    loggerInput.scrollTop = loggerInput.scrollHeight-48;
}