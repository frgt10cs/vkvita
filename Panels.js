var userActionPanel;
var userSettingsPanel;
var keyChooser;
var keyChooserRow;
var askKeysButton;
var prefixSendSetter;
var prefixRecieveSetter;
var prefixSendSetterRow;
var prefixRecieveSetterRow;
var saver;
var encrypter;
var decrypter;
var loggerInput;
var russer;
var actions;
var settings;
var actionHider;
var settingsHider;
var isActionHidded=false;
var isSettingsHidded=false;
var checker;

var isRus=false;

function ConnectStyles(){
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = ".vitaRow{display: flex;flex-wrap: wrap;margin-right: -15px;margin-left: -15px;} .vitaContainer{width: 100%;padding-right: 15px;padding-left: 15px;margin-right: auto;margin-left: auto;} .cursorDefault{cursor:default;} .vitaInput{border: solid 1px #d3d9de; padding-left:4px; width:80%;}";
    document.getElementsByTagName('head')[0].appendChild(style);    
}

function CreateMainPanel(){
    actionPanel = CreatePanel("acPanel");
    settingsPanel = CreatePanel("setPanel");
    actionHider=CreateActionHider();
    settingsHider = CreateSettingsHider();            
    keyChooserRow = CreateKeysChooser();                
    askKeysButton = CreateKeysAsker();            
    sender = CreateSenderEncrypted();  
    prefixSendSetterRow = CreatePrefixSendSetter();  
    prefixRecieveSetterRow = CreatePrefixRecieveSetter();    
    saver = CreateSaveButton();            
    encrypter = CreateEncryptButton();
    decrypter = CreateDecryptButton();
    russer = CreateRussianPicker();
    logger = CreateLogBox();
    checker = CreteKeysChecker();
    logger.style.height="auto"; 
    actions = [askKeysButton,checker, decrypter, encrypter, sender, russer];   
    settings = [keyChooserRow,prefixSendSetterRow, prefixRecieveSetterRow, saver, logger];
    actionPanel.appendChild(actionHider);
    for(var i=0;i<actions.length;i++){
        actionPanel.appendChild(actions[i]);
    }       
    settingsPanel.appendChild(settingsHider);             
    for(var i=0;i<settings.length-2;i++){        
        settingsPanel.appendChild(settings[i]);
    }  
    settingsPanel.appendChild(saver);        
    settingsPanel.appendChild(logger);   
    document.getElementsByClassName("im-right-menu")[0].appendChild(actionPanel);
    document.getElementsByClassName("im-right-menu")[0].appendChild(settingsPanel);
    userSettingsPanel = settingsPanel;
    userActionPanel = actionPanel;
}

function CreatePanel(id){
    var panel = document.createElement("div");        
    panel.id=id;
    panel.classList = "page_block ui_rmenu _im_right_menu ui_rmenu_pr";
    panel.style.zIndex = "9999";
    return panel;
}

function CreateSettingsHider(){
    var hider = document.createElement("span");
    hider.textContent = "Settings";        
    var row = SetToRow(hider, function(){
        var style = isSettingsHidded?"block":"none";
        for(var i=0;i<settings.length;i++){
            settings[i].style.display=style;
        }
        isSettingsHidded=!isSettingsHidded;       
    });    
    row.style.textAlign="center";
    row.style.paddingLeft="0px";
    return row;
}

function CreateActionHider(){
    var hider = document.createElement("span");
    hider.textContent = "Actions";        
    var row = SetToRow(hider, function(){
        var style = isActionHidded?"block":"none";
        for(var i=0;i<actions.length;i++){
            actions[i].style.display=style;
        }
        isActionHidded=!isActionHidded;       
    });    
    row.style.textAlign="center";
    row.style.paddingLeft="0px";
    return row;
}

function CreteKeysChecker(){
    var checker = document.createElement("span");
    checker.textContent="Check keys";
    checker.title = "Check your keys in case they are not same";
    var row = SetToRow(checker, function(){
        SendMessage((currentPrefixSend==""?defaultPrefixSend:currentPrefixSend)+" -c "+cryptico.publicKeyString(staticKeys.RSA));
    });
    return row;
}

function CreateKeysChooser(){
    var chooser = document.createElement("select");    
    chooser.classList.add("vitaInput");
    chooser.title="Choose key that will be use for encrypt";
    var firstElement = document.createElement("option");
    firstElement.textContent = "Choose keys";
    chooser.onchange = function(){
        currentKeys = allSelKeys[chooser.value];
    }
    chooser.appendChild(firstElement);
    keyChooser = chooser;    
    var row = SetToRow(chooser,function(){},true);    
    return row;
}

function CreateKeysAsker(){
    var asker = document.createElement("span");      
    asker.textContent="Ask keys";
    asker.title = "Tells your interlocutor generate keys and send it to your";   
    var row = SetToRow(asker,function(){
        SendMessage((currentPrefixSend==""?defaultPrefixSend:currentPrefixSend)+" -a "+cryptico.publicKeyString(staticKeys.RSA));
    });
    return row;
}

function CreateSenderEncrypted(){
    var sender = document.createElement("span");
    sender.title="Encrypt message and send";    
    sender.innerHTML = "Send Encrypted";
    var row = SetToRow(sender, function(){
        var text = messageTextBox.textContent;        
        SendEncryptMessage(text);        
    });
    return row;
}

function CreatePrefixSendSetter(){
    var setter = document.createElement("input");
    setter.type="text";
    setter.placeholder="Prefix for your encrypted message for detect it";
    setter.id="prefixSend"; 
    setter.title="Add prefix for your encrypted message for detect it";    
    setter.classList.add("vitaInput");
    prefixSendSetter = setter;
    var row=SetToRow(setter,function(){},true);
    return row;
}

function CreatePrefixRecieveSetter(){
    var setter = document.createElement("input");
    setter.type="text";
    setter.placeholder="Prefixes that you find for detect encrypted messages. Use ; for enumeration";
    setter.id="prefixRecieve";      
    setter.title="Prefixes that you find for detect encrypted messages. Use ; for enumeration";
    setter.classList.add("vitaInput");
    prefixRecieveSetter = setter;
    var row=SetToRow(setter,function(){},true);
    return row;
}

function CreateSaveButton(){
    var saver = document.createElement("span");
    saver.textContent = "Save prefxies";    
    var row = SetToRow(saver, function(){
        var p1 = prefixSendSetter.value;
        var p2=prefixRecieveSetter.value;
        if(p1!="" && p2!=""){
            localStorage.setItem("vita_presend",p1);
            localStorage.setItem("vita_prerec",p2);
            UploadPrefixes();
        }   
        LogWrite("Saved");        
    });
    return row;
}

function CreateEncryptButton(){
    var encrypter = document.createElement("span");
    encrypter.title="Encrypt text in textbox"; 
    encrypter.textContent="Encrypt";  
    var row =  SetToRow(encrypter, function(){
        if(keyChooser.value!=-1){
            var message = messageTextBox.textContent;
            if(isRus){
                message=encodeURI(message);
            }  
            var crypted = cryptico.encrypt(message, cryptico.publicKeyString(currentKeys.RSA));
            messageTextBox.textContent = (currentPrefixSend==""?defaultPrefixSend:currentPrefixSend)+" -m "+crypted.cipher+" -k "+keyChooser.value +(isRus?" -r":"");            
        }
        else{
            LogWrite("Choose keys for encryption");
        }
    });  
    return row;
}

function CreateDecryptButton(){
    var decrypter = document.createElement("span");
    decrypter.title="Decrypt all messages on page";    
    decrypter.textContent="Decrypt";
    var row = SetToRow(decrypter, function(){
        DecryptMessages();
        LogWrite("Decrypted");        
    });
    return row;
}

function CreateRussianPicker(){
    var russer = document.createElement("div");
    russer.classList="ui_toggler_wrap";
    russer.title="Messages with russian symbols are bigger in incrypted form than english. Select only when you need to send russian message.";
    russer.style.paddingLeft="0px";
    russer.style.paddingTop="7px";
    var togler = document.createElement("div");
    togler.classList="_ui_toggler ui_toggler";
    var label = document.createElement("div");
    label.classList="ui_toggler_label";
    label.textContent="Cyrillic symbols";
    russer.appendChild(togler);
    russer.appendChild(label);    
    var row = SetToRow(russer, function(){
        isRus=!isRus;
        if(isRus){
            togler.classList="_ui_toggler ui_toggler  on";
            LogWrite("Encrypt for russian");
        }            
        else{
            togler.classList="_ui_toggler ui_toggler";
            LogWrite("Don't encrypt for russian");
        }            
    });
    return row;
}

function CreateLogBox(){
    var logger = document.createElement("textarea");
    logger.style.marginTop="4.5px";
    logger.style.resize="none";
    logger.style.overflow="auto";    
    logger.style.height="30px";
    logger.classList.add("vitaInput");
    logger.readOnly="readonly";
    loggerInput=logger;
    var row = SetToRow(logger,function(){},true);
    return row;
}

function SetToRow(element, action, def=false){    
    var row = document.createElement("div");    
    row.appendChild(element);
    var add = def?"cursorDefault":"";    
    row.classList="ui_rmenu_item _ui_item_all "+add;
    row.onclick=action;
    return row;
}