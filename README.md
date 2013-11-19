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
function ImapLogin(command, socket){
  if(command.args[0] == "user" && command.args[1]=="pass"){
    socket.write(command.tag + " OK Welcome overwritten " + command.args[0] + "\r\n");
    socket.IMAPState = ImapServer.IMAPState.Authenticated;
  }else{
    socket.write(command.tag + " NO Wrong user or password.\r\n");
  }
}
ImapServer.IMAPCommands.LOGIN.callback = ImapLogin;
```
## Notes

* Default port : 143

[imap]: http://tools.ietf.org/html/rfc3501 "RFC 3501"
