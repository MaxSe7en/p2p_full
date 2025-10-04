// Global WebSocket Notification System for P2P Escrow
// Include this on: index.html, trade.html, chats.html (not chat.html)

class NotificationSystem {
  constructor() {
    this.ws = null;
    this.userId = null;
    this.userTrades = [];
    this.reconnectDelay = 3000;
    this.isConnecting = false;
    this.toastContainer = null;
    this.activeToasts = [];
    
    this.init();
  }

  init() {
    // Get user ID from localStorage
    this.userId = localStorage.getItem('user_id');
    
    if (!this.userId) {
      console.log('No user logged in - notifications disabled');
      return;
    }

    // Create toast container
    this.createToastContainer();
    
    // Fetch user's trades to monitor
    this.fetchUserTrades();
    
    // Connect to WebSocket
    this.connect();
  }

  createToastContainer() {
    this.toastContainer = document.createElement('div');
    this.toastContainer.id = 'notification-container';
    this.toastContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      max-width: 350px;
      pointer-events: none;
    `;
    document.body.appendChild(this.toastContainer);
  }

  async fetchUserTrades() {
    try {
      const response = await fetch(`https://alphaseven.online/p2p_test/trades/user/${this.userId}/chats`);
      if (response.ok) {
        const trades = await response.json();
        console.log('Fetching user trades for notifications...', trades);
        this.userTrades = trades.data.map(t => t.id);
        console.log('Monitoring trades:', this.userTrades);
      }
    } catch (error) {
      console.error('Error fetching user trades:', error);
    }
  }

  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    console.log('Connecting to notification WebSocket...');

    this.ws = new WebSocket('wss://alphaseven.online/ws');

    this.ws.onopen = () => {
      console.log('✓ Notification WebSocket connected');
      this.isConnecting = false;
      
      // Join all user's trade rooms
      this.userTrades.forEach(tradeId => {
        this.ws.send(JSON.stringify({
          action: 'join',
          trade_id: tradeId,
          sender_id: parseInt(this.userId)
        }));
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('Notification WebSocket error:', error);
      this.isConnecting = false;
    };

    this.ws.onclose = () => {
      console.log('Notification WebSocket disconnected');
      this.isConnecting = false;
      
      // Attempt reconnection
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay);
    };
  }

  handleMessage(data) {
    // Only show notifications for new messages
    if (data.action === 'message' && data.sender_id != this.userId) {
      this.showToast(data);
    }

    // If joined a new trade, update monitoring list
    if (data.action === 'joined') {
      if (!this.userTrades.includes(data.trade_id)) {
        this.userTrades.push(data.trade_id);
      }
    }
  }

  showToast(messageData) {
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.style.cssText = `
      background: white;
      border-left: 4px solid #007bff;
      padding: 15px 20px;
      border-radius: 5px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      cursor: pointer;
      pointer-events: auto;
      transform: translateX(400px);
      opacity: 0;
      transition: all 0.3s ease-out;
      max-width: 350px;
    `;

    toast.innerHTML = `
      <div style="font-weight: bold; color: #333; margin-bottom: 5px;">
        New message from ${this.escapeHtml(messageData.sender_name)}
      </div>
      <div style="color: #666; font-size: 14px; margin-bottom: 5px;">
        Trade #${messageData.trade_id}
      </div>
      <div style="color: #333; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        ${this.escapeHtml(messageData.message)}
      </div>
    `;

    // Click to navigate to chat
    toast.addEventListener('click', () => {
      window.location.href = `chat.html?trade=${messageData.trade_id}`;
    });

    // Add to container and active list
    this.toastContainer.appendChild(toast);
    this.activeToasts.push(toast);

    // Trigger slide-in animation
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 10);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      this.dismissToast(toast);
    }, 5000);
  }

  dismissToast(toast) {
    // Fade out
    toast.style.transform = 'translateX(400px)';
    toast.style.opacity = '0';

    // Remove from DOM after animation
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      
      // Remove from active list
      const index = this.activeToasts.indexOf(toast);
      if (index > -1) {
        this.activeToasts.splice(index, 1);
      }
    }, 300);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Auto-initialize when script loads
let notificationSystem = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    notificationSystem = new NotificationSystem();
  });
} else {
  notificationSystem = new NotificationSystem();
}

// Clean up on logout
window.addEventListener('beforeunload', () => {
  if (notificationSystem) {
    notificationSystem.disconnect();
  }
});