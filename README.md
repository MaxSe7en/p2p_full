

## **Technical Stack**

**Frontend:**
- Vanilla JavaScript
- Tailwind CSS for responsive UI
- WebSocket for real-time communication
- localStorage for session management

**Backend:**
- PHP with Flight framework (RESTful API)
- MySQL database
- Ratchet WebSocket server
- PDO for secure database interactions

---

## **Core Features Implemented**

### **1. User Authentication & Authorization**
- User registration with password hashing (bcrypt)
- Secure login system
- Automatic wallet creation on registration

### **2. Wallet Management**
- Multi-currency wallet system (BTC, ETH, USDT, BNB, SOL, ADA, XRP, DOT, DOGE, LTC, USD)
- Real-time balance tracking
- Locked balance for escrow (funds in active trades)
- Available balance calculation
- Visual progress indicators for locked funds
- Transaction logging system

### **3. Trade Management**
- Create sell orders with automatic fund locking
- Browse available trades
- Buy trades (initiates escrow)
- Release escrow (completes transaction)
- Cancel trades (unlocks funds)
- Trade lifecycle: `open → in_progress → completed/cancelled`
- Validation to prevent self-trading

### **4. Real-time Chat System**
- WebSocket-based chat per trade
- Persistent message history
- Auto-reconnection on disconnect
- Connection status indicators
- Trade-specific chat rooms

### **5. Notification**
- Real-time toast notifications for new messages
- Monitors all user's active trades

---

## **Architecture & Code Quality**

### **Frontend**
- **api-service.js** - Centralized API communication
- **auth-service.js** - Authentication state management
- **ui-utils.js** - Reusable UI functions
- **websocket-service.js** - Real-time chat handling
- **notification-system.js** - Global notification manager

### **Backend Structure**
- MVC pattern (Models, Controllers, Routes)
- Separated concerns (DB helper, logging, config)
- Transaction management for data integrity
- Comprehensive error handling
- Consistent API response format
---

## **Database Design**

**Tables:**
1. **users** - User accounts
2. **wallets** - Multi-currency balances with locked amounts
3. **trades** - Trade orders with status tracking
4. **chat_messages** - Persistent chat history
5. **transactions** - Complete audit trail (deposit, lock, unlock, release)

