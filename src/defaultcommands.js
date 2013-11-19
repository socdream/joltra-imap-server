var IMAPServer = require("./server.js");

exports.SetDefaultCommands = function(){
  IMAPServer.IMAPCommands.LOGIN.callback = DefaultLogin;
  IMAPServer.IMAPCommands.LOGOUT.callback = DefaultLogout;
  IMAPServer.IMAPCommands.CAPABILITY.callback = DefaultCapability;
  IMAPServer.IMAPCommands.NOOP.callback = DefaultNoop;
  IMAPServer.IMAPCommands.SELECT.callback = DefaultSelect;
  IMAPServer.IMAPCommands.EXAMINE.callback = DefaultExamine;
  //IMAPServer.IMAPCommands.CREATE.callback = DefaultExamine;
  //IMAPServer.IMAPCommands.DELETE.callback = DefaultDelete;
  IMAPServer.IMAPCommands.RENAME.callback = DefaultRename;
  IMAPServer.IMAPCommands.SUBSCRIBE.callback = DefaultSubscribe;
  IMAPServer.IMAPCommands.UNSUBSCRIBE.callback = DefaultUnsubscribe;
  //IMAPServer.IMAPCommands.LIST.callback = DefaultList;
  //IMAPServer.IMAPCommands.UNSUBSCRIBE.callback = DefaultLsub;
  IMAPServer.IMAPCommands.STATUS.callback = DefaultStatus;
  //IMAPServer.IMAPCommands.APPEND.callback = DefaultAppend;
  IMAPServer.IMAPCommands.CHECK.callback = DefaultCheck;
  IMAPServer.IMAPCommands.CLOSE.callback = DefaultClose;
  IMAPServer.IMAPCommands.CHECK.callback = DefaultExpunge;
  //IMAPServer.IMAPCommands.SEARCH.callback = DefaultSearch;
  //IMAPServer.IMAPCommands.FETCH.callback = DefaultFetch;
  //IMAPServer.IMAPCommands.STORE.callback = DefaultStore;
  //IMAPServer.IMAPCommands.COPY.callback = DefaultCopy;
  //IMAPServer.IMAPCommands.UID.callback = DefaultUid;
}

function DefaultLogin(command, socket){
  if(command.args[0] == "user" && command.args[1]=="pass"){
  	socket.IMAPState = IMAPServer.IMAPState.Authenticated;
    socket.write(command.tag + " OK Welcome " + command.args[0] + "\r\n");
  }else{
    socket.write(command.tag + " NO Wrong user or password.\r\n");
  }
}

function DefaultLogout(command, socket){
  socket.write("* BYE Logging out\r\n" + command.tag + " OK Logout completed\r\n");
  socket.end();
}

function DefaultCapability(command, socket){
  socket.write("* CAPABILITY IMAP4rev1\r\n" + command.tag + " OK CAPABILITY completed\r\n");
}

function DefaultNoop(command, socket){
  socket.write(command.tag + " OK NOOP completed");
}

function DefaultSelect(command, socket){
  var mailbox = command.args[0];

  //get existent messages in mailbox
  var numExist = 0;
  var res = "* " + numExist + " EXISTS\r\n";

  //get recent messages
  var numRecent = 0;
  res += "* " + numRecent + " RECENT\r\n";

  //get unseen messages
  var numUnseen = 0;
  res += "* OK [UNSEEN " + numUnseen + "] Message" + numUnseen + "is first unseen\r\n";

  res += "* OK [UIDVALIDITY 3857529045] UIDs valid\r\n";

  res += "* OK [UIDNEXT 4392] Predicted next UID\r\n";

  res += "* FLAGS (\Answered \Flagged \Deleted \Seen \Draft)\r\n";

  res += "* OK [PERMANENTFLAGS (\Deleted \Seen \*)] Limited\r\n";

  res += command.tag + " OK [READ-WRITE] SELECT completed\r\n";

  socket.write(res);
}

function DefaultExamine(command, socket){
  var mailbox = command.args[0];

  //get existent messages in mailbox
  var numExist = 0;
  var res = "* " + numExist + " EXISTS\r\n";

  //get recent messages
  var numRecent = 0;
  res += "* " + numRecent + " RECENT\r\n";

  //get unseen messages
  var numUnseen = 0;
  res += "* OK [UNSEEN " + numUnseen + "] Message" + numUnseen + "is first unseen\r\n";

  res += "* OK [UIDVALIDITY 3857529045] UIDs valid\r\n";

  res += "* OK [UIDNEXT 4392] Predicted next UID\r\n";

  res += "* FLAGS (\Answered \Flagged \Deleted \Seen \Draft)\r\n";

  res += "* OK [PERMANENTFLAGS ()] No permanent flags permitted\r\n";

  res += command.tag + " OK [READ-ONLY] EXAMINE completed\r\n";

  socket.write(res);
}

function DefaultCreate(command, socket){
  /*C: A003 CREATE owatagusiam/
  S: A003 OK CREATE completed
  C: A004 CREATE owatagusiam/blurdybloop
  S: A004 OK CREATE completed*/
}

function DefaultDelete(command, socket){
  var mailbox = command.args[0];
}

function DefaultRename(command, socket){
	var origin = command.args[0];
	var destination = command.args[1];
	var canCopy = false;
	if(canCopy){
		socket.write(command.tag + "OK RENAME completed\r\n");
	}else{
		socket.write(command.tag + "NO RENAME failure\r\n");
	}
}

function DefaultSubscribe(command, socket){
	var canSubscribe = false;
	if(canSubscribe){
		socket.write(command.tag + "OK SUBSCRIBE completed\r\n");
	}else{
		socket.write(command.tag + "NO SUBSCRIBE failure: can't subscribe to that name\r\n");
	}
}

function DefaultUnsubscribe(command, socket){
	var canSubscribe = false;
	if(canSubscribe){
		socket.write(command.tag + "OK UNSUBSCRIBE completed\r\n");
	}else{
		socket.write(command.tag + "NO UNSUBSCRIBE failure: can't unsubscribe to that name\r\n");
	}
}

function DefaultList(command, socket){
	
}

function DefaultLsub(command, socket){
	
}

function DefaultStatus(command, socket){
	var mailbox = command.args[0];
	var res = "";
	for(var i = 0; i<command.args.length; i++){
		var request = command.args[i].replace("(", "").replace(")", "");
		switch(request){
			case "MESSAGES":
				var numMessages = 0;
				res += " " + request + " " + numMessages;
				break;
			case "RECENT":
				var numRecent = 0;
				res += " " + request + " " + numRecent;
				break;
			case "UIDNEXT":
				var uidnext = 0;
				res += " " + request + " " + uidnext;
				break;
			case "UIDVALIDITY":
				var uidvality = 0;
				res += " " + request + " " + uidvality;
				break;
			case "UNSEEN":
				var unseen = 0;
				res += " " + request + " " + unseen;
				break;
		}//switch
	}//for
	socket.write("* STATUS " + command.args[0] + "(" + res + ")\r\n" + command.tag + " OK STATUS completed\r\n");
}

function DefaultAppend(command, socket){
	
}

function DefaultCheck(command, socket){
	socket.write(command.tag + " OK CHECK completed\r\n");
}

function DefaultClose(command, socket){
	//delete messages and return to authenticated
	socket.write(command.tag + " OK CLOSE completed\r\n");
	socket.IMAPState = IMAPServer.IMAPState.Authenticated;
}

function DefaultExpunge(command, socket){
	var messagesFlagged = [];
	var res = "";
	for(var i = 0; i<messagesFlagged.length; i++){
		//delete message and return relative id
		var id = 0;
		res += "* " + id + " EXPUNGE\r\n";
	}
	socket.write(res + command.tag + " OK EXPUNGE completed\r\n");
}

function DefaultSearch(command, socket){
	
}

function DefaultFetch(command, socket){
	
}

function DefaultStore(command, socket){
	
}

function DefaultCopy(command, socket){
	var destMailbox = command.args[1];
	var msgIds = command.args[0].split(":");
	for(var i = parseInt(msgIds[0]); i <= parseInt(msgIds[1]); i++){
		//copy message
	}
	
	var copied = false;
	if(copied){
		socket.write(command.tag + " OK COPY completed\r\n");
	}else{
		socket.write(command.tag + " NO COPY error: can't copy those messages or to that name\r\n");
	}
}

function DefaultUid(command, socket){
	
}