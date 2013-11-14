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

function DefaultLogin(command){
  if(command[2] == "user" && command[3]=="pass"){
    return { message: command[0] + " OK Welcome " + command[2] + "\r\n", action: function(socket){ socket.IMAPState = IMAPServer.IMAPState.Authenticated; } };
  }else{
    return { message: command[0] + " NO Wrong user or password.\r\n" };
  }
}

function DefaultLogout(command){
  return { message: "* BYE Logging out\r\n" + command[0] + " OK Logout completed\r\n", action:function(socket){socket.end();} };
}

function DefaultCapability(command){
  return { message: "* CAPABILITY IMAP4rev1\r\n" + command[0] + " OK CAPABILITY completed\r\n" };
}

function DefaultNoop(command){
  return{ message: command[0] + " OK NOOP completed" };
}

function DefaultSelect(command){
  var mailbox = command[2];

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

  res += command[0] + " OK [READ-WRITE] SELECT completed\r\n";

  return { message: res };
}

function DefaultExamine(command){
  var mailbox = command[2];

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

  res += command[0] + " OK [READ-ONLY] EXAMINE completed\r\n";

  return { message: res };
}

function DefaultCreate(command){
  /*C: A003 CREATE owatagusiam/
  S: A003 OK CREATE completed
  C: A004 CREATE owatagusiam/blurdybloop
  S: A004 OK CREATE completed*/
}

function DefaultDelete(command){
  var mailbox = command[2];
}

function DefaultRename(command){
	var origin = command[2];
	var destination = command[3];
	var canCopy = false;
	if(canCopy){
		return { message: command[0] + "OK RENAME completed\r\n" };
	}else{
		return { message: command[0] + "NO RENAME failure\r\n" };
	}
}

function DefaultSubscribe(command){
	var canSubscribe = false;
	if(canSubscribe){
		return { message: command[0] + "OK SUBSCRIBE completed\r\n" };
	}else{
		return { message: command[0] + "NO SUBSCRIBE failure: can't subscribe to that name\r\n" };
	}
}

function DefaultUnsubscribe(command){
	var canSubscribe = false;
	if(canSubscribe){
		return { message: command[0] + "OK UNSUBSCRIBE completed\r\n" };
	}else{
		return { message: command[0] + "NO UNSUBSCRIBE failure: can't unsubscribe to that name\r\n" };
	}
}

function DefaultList(command){
	
}

function DefaultLsub(command){
	
}

function DefaultStatus(command){
	var mailbox = command[2];
	var res = "";
	for(var i = 3; i<command.length; i++){
		var request = command[i].replace("(", "").replace(")", "");
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
	return { message: "* STATUS " + command[2] + "(" + res + ")\r\n" + command[0] + " OK STATUS completed\r\n" };
}

function DefaultAppend(command){
	
}

function DefaultCheck(command){
	return { message: command[0] + " OK CHECK completed\r\n"};
}

function DefaultClose(command){
	//delete messages and return to authenticated
	return { message: command[0] + " OK CLOSE completed\r\n", action: function(socket){ socket.IMAPState = IMAPServer.IMAPState.Authenticated; } };
}

function DefaultExpunge(command){
	var messagesFlagged = [];
	var res = "";
	for(var i = 0; i<messagesFlagged.length; i++){
		//delete message and return relative id
		var id = 0;
		res += "* " + id + " EXPUNGE\r\n";
	}
	return { message: res + command[0] + " OK EXPUNGE completed\r\n"};
}

function DefaultSearch(command){
	
}

function DefaultFetch(command){
	
}

function DefaultStore(command){
	
}

function DefaultCopy(command){
	var destMailbox = command[3];
	var msgIds = command[2].split(":");
	for(var i = parseInt(msgIds[0]); i <= parseInt(msgIds[1]); i++){
		//copy message
	}
	
	var copied = false;
	if(copied){
		return { message: command[0] + " OK COPY completed\r\n"};
	}else{
		return { message: command[0] + " NO COPY error: can't copy those messages or to that name\r\n"};
	}
}

function DefaultUid(command){
	
}