const uuidv1 = require('uuid/v1');
const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });



// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

wss.broadcast = function broadcast(data) {
  //give the information to the client server
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

function randomColorFunction() {
  //generate random font color
  const randomColor = Math.floor(Math.random()*16777215).toString(16);
  const cssRandomColor = '#' + randomColor;
  return cssRandomColor;
}

function broadcastUsersCount() {
  //counting for users how many people are connected.
  const usersNum = {
    type : 'incomingUser',
    count : wss.clients.size,
    id : uuidv1()
  }
  wss.broadcast(JSON.stringify(usersNum)); 
}

wss.on('connection', (ws) => {
  //connet between server and client side
  broadcastUsersCount();  
  const color = randomColorFunction();
  ws.on('message', (messages) => {
    let msg;
    
    try {
       msg = JSON.parse(messages);
    } catch (err) {
      console.error(err);
      return ;
    }
    msg.id = uuidv1();
    if(msg.type === 'postNotification') {
      msg.type = 'incomingNotification'
    } 
    if(msg.type === 'postMessage'){
      msg.color = color;
      msg.type = 'incomingMessage' 
    }
    wss.broadcast(JSON.stringify(msg));
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    broadcastUsersCount();
  });
});