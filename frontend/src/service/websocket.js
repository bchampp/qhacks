import WebSocket from 'isomorphic-ws';

const WS_URL = "wss://77gpzgd9yk.execute-api.us-east-1.amazonaws.com/dev" || "";

let WSService = null;

class WebSocketService {

  constructor() {    
    this.websocket = null;
    this.messageListeners = [];
    this.isOpen = false;
  }

  /**
   *  Set up WebSocket connection for a new user and
   *  basic listeners to handle events
   */
  initSocket = () => {    
    console.log(WS_URL);
    this.websocket = new WebSocket(WS_URL);
    this.websocket.onopen = this.onConnOpen;
    this.websocket.onmessage = this.onMessage;
    this.websocket.onclose = this.onConnClose;
  }

  /**
   *  Show connection status to us in the log
   */
  onConnOpen = () => {
    this.isOpen = true;
    console.log('Websocket connected!');   
  }

  /**
   *  Log lost connection for now
   */
  onConnClose = () => {
    console.log('Websocket closed!');
  }

  /**
   *  Used by application to send message to the WebSocket API Gateway
   *  @param routeKey The route key for WebSocket API Gateway
   *  @param message String message
   *  message {
   *    room,
   *    type,
   *    msg,
   *    username,
   *    for
   *  }
   */
  sendMessage = (routeKey, message) => {    
    if(this.websocket && this.isOpen){
      this.websocket.send(JSON.stringify({
        action: routeKey,
        data: JSON.stringify(message)
      }));
    }else{      
      console.log(`Websocket connection not found!!`);
    }    
  }

  /**
   *  Used by application to register different listeners for 
   *  different message types
   *  @param room Room name
   *  @param type Message type ['all', 'pm', 'userlist', 'useradd']
   *  @param listener Function to handle message type
   */
  addMessageListener = (room, type, listener) => {    
    if (!type || !room || typeof listener !== 'function') {
      return;
    }
    this.messageListeners.push({
      room,
      type,
      listener
    });
  }

  /**
   * Handler that receives the actual messages from the WebSocket API
   * For now it simply returns the parsed message body to the appropriate
   * registered handler
   * @param data Message body received from WebSocket 
   */
  onMessage = (data) => {
    if (data) {
      const message = JSON.parse(data.data);    
      const typeListener = this.messageListeners.find(listener => listener.type === message.type);

      if (typeListener && typeof typeListener.listener === "function") {      
        typeListener.listener(message);
      } else {
        console.log('No handler found for message type');
      }
    }
  }

  static initWSService() {    
    if (!WSService) {      
      WSService = new WebSocketService();
      WSService.initSocket();
      return WSService;
    }
    
    return WSService;
  }

}

export const getWSService = WebSocketService.initWSService;