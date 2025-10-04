// WebSocket Service Module - Handles real-time chat communication
const WS_URL = 'ws://localhost:8080';

const WebSocketService = {
  ws: null,
  tradeId: null,
  userId: null,
  isJoined: false,
  reconnectDelay: 3000,
  onMessageCallback: null,
  onStatusCallback: null,

  // Initialize WebSocket connection
  connect(tradeId, userId, onMessage, onStatus) {
    console.log('WS: Connecting to chat server for trade:', tradeId);
    this.tradeId = tradeId;
    this.userId = userId;
    this.onMessageCallback = onMessage;
    this.onStatusCallback = onStatus;

    this.updateStatus('connecting', 'Connecting to chat server...');
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('WS: Connection established');
      this.updateStatus('connected', 'Connected - Joining chat...');
      this.joinChat();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WS: Message received:', data);
        this.handleMessage(data);
      } catch (error) {
        console.error('WS: Error parsing message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WS: Connection error:', error);
      this.updateStatus('disconnected', 'Connection error');
    };

    this.ws.onclose = () => {
      console.log('WS: Connection closed');
      this.updateStatus('disconnected', 'Disconnected from chat server');
      this.isJoined = false;

      // Auto-reconnect
      setTimeout(() => {
        if (!this.isJoined) {
          console.log('WS: Attempting to reconnect...');
          this.connect(this.tradeId, this.userId, this.onMessageCallback, this.onStatusCallback);
        }
      }, this.reconnectDelay);
    };
  },

  // Join chat room
  joinChat() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WS: Cannot join - WebSocket not ready');
      return;
    }

    console.log('WS: Joining chat room');
    this.ws.send(JSON.stringify({
      action: 'join',
      trade_id: parseInt(this.tradeId),
      sender_id: parseInt(this.userId)
    }));
  },

  // Handle incoming messages
  handleMessage(data) {
    if (data.action === 'joined') {
      console.log('WS: Successfully joined chat');
      this.isJoined = true;
      this.updateStatus('connected', `Connected to Trade #${this.tradeId} chat`);
      if (this.onMessageCallback) {
        this.onMessageCallback({ type: 'joined', data });
      }
      return;
    }

    if (data.action === 'left') {
      console.log('WS: Left chat room');
      if (this.onMessageCallback) {
        this.onMessageCallback({ type: 'left', data });
      }
      return;
    }

    if (data.action === 'message' && data.trade_id == this.tradeId) {
      console.log('WS: New message from:', data.sender_name);
      if (this.onMessageCallback) {
        this.onMessageCallback({ type: 'message', data });
      }
      return;
    }

    if (data.error) {
      console.error('WS: Server error:', data.error);
      if (this.onMessageCallback) {
        this.onMessageCallback({ type: 'error', data });
      }
    }
  },

  // Send message
  sendMessage(message) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WS: Cannot send message - not connected');
      return false;
    }

    console.log('WS: Sending message:', message);
    this.ws.send(JSON.stringify({
      action: 'message',
      message: message
    }));
    return true;
  },

  // Leave chat
  leaveChat() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WS: Leaving chat room');
      this.ws.send(JSON.stringify({
        action: 'leave',
        trade_id: parseInt(this.tradeId)
      }));
    }
  },

  // Disconnect
  disconnect() {
    console.log('WS: Disconnecting');
    this.leaveChat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isJoined = false;
  },

  // Update status
  updateStatus(status, message) {
    console.log(`WS: Status changed to ${status}:`, message);
    if (this.onStatusCallback) {
      this.onStatusCallback(status, message);
    }
  }
};