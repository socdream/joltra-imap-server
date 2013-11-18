// Load the TCP Library
net = require('net');
 
// Keep track of the chat clients
var clients = [];

var IMAPState = { NotAuthenticated: 0, Authenticated: 1, Selected: 2, Logout: 3 };
exports.IMAPState = IMAPState;

var IMAPFlag = { Seen: "\Seen", Answered:"\Answered", Flagged: "\Flagged", Deleted: "\Deleted", Draft: "\Draft", Recent: "\Recent" };

function IMAPServer(imapPort){
  if(!imapPort) imapPort = 143;

  // Start a TCP Server
  net.createServer(function (socket) {
 
    // Identify this client
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    socket.receivedData = "";
    socket.IMAPState = IMAPState.NotAuthenticated;

    // Put this new client in the list
    clients.push(socket);
 
    // Send a nice welcome message
    socket.write("* OK [CAPABILITY IMAP4REV1] Welcome " + socket.name + "\r\n");
 
    // Handle incoming messages from clients.
    socket.on('data', function (data) {
      socket.receivedData += data;
      var processedCommand = ProcessCommand(socket.receivedData);
      if(processedCommand){
        console.log(processedCommand);

        socket.receivedData = processedCommand.dataLeft;

        if(IMAPCommands[processedCommand.command.command]){
        	console.log("running: ", IMAPCommands[processedCommand.command.command]);
          var commandResult = IMAPCommands[processedCommand.command.command].callback(processedCommand.command);
          socket.write(commandResult.message);
          if(commandResult.action) commandResult.action(socket);
        }
      }
    });
 
    // Remove the client from the list when it leaves
    socket.on('end', function () {
      clients.splice(clients.indexOf(socket), 1);
      console.log(socket.name + " disconnected.\r\n");
    });
  
    // Send a message to all clients
    function broadcast(message, sender) {
      clients.forEach(function (client) {
        // Don't want to send it to sender
        if (client === sender) return;
        client.write(message);
      });
      // Log it to the server output too
      process.stdout.write(message)
    }
 
  }).listen(imapPort);

  // Put a friendly message on the terminal of the server.
  console.log("IMAP Server running at port " + imapPort + "\r\n");
}
exports.IMAPServer = IMAPServer;

function ProcessCommand(data){
	var offset = data.indexOf("\r\n");
	
	if(offset >= 0){
		var fullCommand = data.substr(0, offset);
		var params = fullCommand.split(" ");

		return { command: { tag: params[0], command: params[1], args: params.slice(2) }, dataLeft: data.substr(offset + 2)};
	}

	return null;
}

function NotImplementedCommand(command){
  return { message: command.tag + " BAD Not Implemented Command.\r\n", action: function(socket){} };
}
exports.NotImplementedCommand = NotImplementedCommand;

var IMAPCommands = {
  CAPABILITY: { callback: NotImplementedCommand, state: IMAPState.NotAuthenticated },
  NOOP: { callback: NotImplementedCommand, state: IMAPState.NotAuthenticated },
  LOGOUT: { callback: NotImplementedCommand, state: IMAPState.NotAuthenticated },
  LOGIN: { callback: NotImplementedCommand, state: IMAPState.NotAuthenticated },
  AUTHENTICATE: { callback: NotImplementedCommand, state: IMAPState.NotAuthenticated },
  STARTTLS: { callback: NotImplementedCommand, state: IMAPState.NotAuthenticated },
  //Selects a particular mailbox so that messages within it can be accessed. If the command is successful, the session transitions to the Selected state. The server will also normally respond with information for the client about the selected mailbox
  SELECT: { callback: NotImplementedCommand, state: IMAPState.Authenticated },
  //Exactly the same as the SELECT command, except that the mailbox is opened read-only; no changes are allowed to it.
  EXAMINE: { callback: NotImplementedCommand, state: IMAPState.Authenticated },
  //Creates a mailbox with the given name.
  CREATE: { callback: NotImplementedCommand, state: IMAPState.Authenticated },
  //Deletes the specified mailbox.
  DELETE: { callback: NotImplementedCommand, state: IMAPState.Authenticated },
  //Renames a mailbox.
  RENAME: { callback: NotImplementedCommand, state: IMAPState.Authenticated },
  //Adds the mailbox to the server's set of ?active? mailboxes. This is sometimes used when IMAP4 is employed for Usenet message access.
  SUBSCRIBE: { callback: NotImplementedCommand, state: IMAPState.Authenticated },
  //Removes the mailbox from the ?active? list.
  UNSUBSCRIBE: { callback: NotImplementedCommand, state: IMAPState.Authenticated },
  //Requests a partial list of available mailbox names, based on the parameter provided.
  LIST: { callback: NotImplementedCommand, state: IMAPState.Authenticated },
  //The same as LIST but only returns names from the ?active? list.
  LSUB: { callback: NotImplementedCommand, state: IMAPState.Authenticated },
  //Requests the status of the specified mailbox. The server responds providing information such as the number of messages in the box and the number of recently-arrived and unseen messages.
  STATUS: { callback: NotImplementedCommand, state: IMAPState.Authenticated },
  //Adds a message to a mailbox.
  APPEND: { callback: NotImplementedCommand, state: IMAPState.Authenticated },
  //Sets a ?checkpoint? for the current mailbox. This is used to mark when a certain sequence of operations has been completed.
  CHECK: { callback: NotImplementedCommand, state: IMAPState.Selected },
  //Explicitly closes the current mailbox and returns the session to the Authenticated state. When this command is issued, the server will also implicitly perform an EXPUNGE operation on the mailbox.
  CLOSE: { callback: NotImplementedCommand, state: IMAPState.Selected },
  //Permanently removes any messages that were flagged for deletion by the client. This is done automatically when a mailbox is closed.
  EXPUNGE: { callback: NotImplementedCommand, state: IMAPState.Selected },
  //Searches the current mailbox for messages matching the specified search criteria. The server response lists the message numbers meeting the criteria.
  SEARCH: { callback: NotImplementedCommand, state: IMAPState.Selected },
  //Retrieves information about a message or set of messages from the current mailbox.
  FETCH: { callback: NotImplementedCommand, state: IMAPState.Selected },
  //Stores a value for a particular message data item for a set of messages.
  STORE: { callback: NotImplementedCommand, state: IMAPState.Selected },
  //Copies the set of messages specified to the end of the specified mailbox.
  COPY: { callback: NotImplementedCommand, state: IMAPState.Selected },
  //Used to allow one of the other commands above to be performed using unique identifier numbers for specifying the messages to be operated on, rather than the usual message sequence numbers.
  UID: { callback: NotImplementedCommand, state: IMAPState.Selected }
};
exports.IMAPCommands = IMAPCommands;

