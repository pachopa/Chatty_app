// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const WebSocket = require('ws');
// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });
const uuidv1 = require('uuid/v1');
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

wss.countUser = function countUser(data) {
  //counting for users how many people are connected.
  const usersNum = {
    type : 'incomingUser',
    count : data
  }
  return usersNum;
}

wss.on('connection', (ws) => {
  //connet between server and client side
  var userCount = wss.countUser(wss.clients.size);
  wss.broadcast(JSON.stringify(userCount)); 

  ws.on('message', (messages) => {
    var Msg = JSON.parse(messages);
    if(Msg.type === 'postNotification') {
      Msg.id = uuidv1();
      Msg.type = 'incomingNotification'
      wss.broadcast(JSON.stringify(Msg)); 
    } 
    if(Msg.type === 'postMessage'){
      Msg.id = uuidv1();
      Msg.type = 'incomingMessage'
      wss.broadcast(JSON.stringify(Msg)); 
    }
   
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    const userCount = wss.countUser(wss.clients.size);
    wss.broadcast(JSON.stringify(userCount)); 
  });
});