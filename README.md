# Vk Vita

Safe messaging in vk

## Installing

### Chrome:

Go to ```chrome://extensions/``` and check the box for ```Developer mode``` in the top right.

Click the ```Load unpacked extension``` button and select the unzipped folder for your extension to install it.

### Firefox

Go to ```about:debugging#addons```

Click the ```Load temporary add-on```


## Using

Open dialog on vk.com

Use ```ctrl+m``` to show/hide extension panel

Also you can hide any panel by press on its title

### Exchange keys

First person press ```ask keys``` to  send request to second person for exchange keys.

Then second person press ```Send keys``` to generate keys and send to frist person.

First person press ```Set keys```

### Sending encrypted messages

Write something in Vk textbox

Select key in ```Settings panel``` which will be used to ecnrypt message

If your message contains russian symbols turn on ```Russian symbols``` in ```Action panel```. It will correctly encrypt your message

Press ```Send encrypted``` in ```Action panel```

### Prefixes

In ```Settings panel``` you can see two textboxes

They contain prefixes

Extension use prefixes to detect or mark encrypted messages

Default prefix for mark message is ```vita```

Default prefixes for detect message is ```vita``` and ```VITA``` 

You can use some prefixes for detect message. Just use ```;``` to separate

If you want to edit, write new prefixes and  press ```Save prefixes``` in ```Settings panel``` to save changes

## Problems with decryption

If you can`t decrypt message then you and your conversationalist have different keys

### Fix problems with different keys

First person press ```Check keys``` on ```Action panel```

Second person press ```Send keys for check```

First person press ```Check keys``` 

Result will be written in ```Log```

### Another functions

* Button ```Encrypt``` on ```Action panel``` encrypts message in vk textbox
* Button ```Decrypt``` on ```Action panel``` calls function ```Decrypt messages``` which scans all messages and decrypts them

## Errors

Let me know if you found errors, bugs or vulnerabilities
