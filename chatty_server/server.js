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

//user Information
const userInformation = {};

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

wss.randomColorFunction = function randomColorFunction() {
  //generate random font color
  const randomColor = Math.floor(Math.random()*16777215).toString(16);
  const cssRandomColor = '#' + randomColor;
  return cssRandomColor;
}

wss.countUser = function countUser(data) {
  //counting for users how many people are connected.
  const usersNum = {
    type : 'incomingUser',
    count : data,
    id : uuidv1(),
    styles: wss.randomColorFunction()
  }
  userInformation[usersNum.id] = {'id': usersNum.id, 'styles': usersNum.styles, 'count': usersNum.count}
  return usersNum;
}

wss.on('connection', (ws) => {
  //connet between server and client side
  const userCount = wss.countUser(wss.clients.size);
  wss.broadcast(JSON.stringify(userCount)); 
  
  ws.on('message', (messages) => {
    const Msg = JSON.parse(messages);
    if(Msg.type === 'postNotification') {
      Msg.type = 'incomingNotification'
      wss.broadcast(JSON.stringify(Msg));
    } 
    if(Msg.type === 'postMessage'){
      for(var userid in userInformation) {
        if(userInformation[userid].count === Msg.id[0].count) {
          Msg.styles = userInformation[userid].styles;
        }
      }
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