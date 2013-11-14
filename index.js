var IMAPServer = require("./src/server.js");

exports.IMAPCommands = IMAPServer.IMAPCommands;
exports.IMAPState = IMAPServer.IMAPState;

//default port is 143
exports.IMAPServer = function(imapPort){
  IMAPServer.IMAPServer();
  var IMAPState = IMAPServer.IMAPState;

  var DefaultCommands = require("./src/defaultcommands.js");
  DefaultCommands.SetDefaultCommands();
}


 
