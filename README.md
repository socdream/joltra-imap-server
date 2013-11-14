# joltra-imap-server

IMAP Server module for Nodejs

I needed an IMAP command parser and server which I could easily modify to integrate it in any storage system so I created this library in which every IMAP command can be easily overwritten.

## Installation

```sh
npm install joltra-imap-server
```

## Usage

```javascript
var ImapServer = require('joltra-imap-server');
ImapServer.IMAPServer();
```

## Command override example

```javascript
//login function override
function ImapLogin(command){
  if(command[2] == "user" && command[3]=="pass"){
    return { message: command[0] + " OK Welcome overwritten " + command[2] + "\r\n", action: function(socket){ socket.IMAPState = ImapServer.IMAPState.Authenticated; } };
  }else{
    return { message: command[0] + " NO Wrong user or password.\r\n" };
  }
}
ImapServer.IMAPCommands.LOGIN.callback = ImapLogin;
```
## Notes

* Default port : 143

[imap]: http://tools.ietf.org/html/rfc3501 "RFC 3501"
