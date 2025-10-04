// API Service Module - Handles all backend communication
const API_BASE = 'http://localhost:8000';

const ApiService = {
  // Authentication
  async register(username, password) {
    console.log('API: Registering user:', username);
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const result = await response.json();
      console.log('API: Registration response:', result);
      return result;
    } catch (error) {
      console.error('API: Registration error:', error);
      throw error;
    }
  },

  async login(username, password) {
    console.log('API: Logging in user:', username);
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const result = await response.json();
      console.log('API: Login response:', result);
      return result;
    } catch (error) {
      console.error('API: Login error:', error);
      throw error;
    }
  },

  // Trades
  async getAllTrades() {
    console.log('API: Fetching all trades');
    try {
      const response = await fetch(`${API_BASE}/trades`);
      const result = await response.json();
      console.log('API: Trades fetched:', result.data?.length || 0);
      return result;
    } catch (error) {
      console.error('API: Error fetching trades:', error);
      throw error;
    }
  },

  async getTrade(tradeId) {
    console.log('API: Fetching trade:', tradeId);
    try {
      const response = await fetch(`${API_BASE}/trades/${tradeId}`);
      const result = await response.json();
      console.log('API: Trade details:', result.data);
      return result;
    } catch (error) {
      console.error('API: Error fetching trade:', error);
      throw error;
    }
  },

  async createTrade(sellerId, asset, amount) {
    console.log('API: Creating trade:', { sellerId, asset, amount });
    try {
      const response = await fetch(`${API_BASE}/trades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller_id: sellerId, asset, amount })
      });
      const result = await response.json();
      console.log('API: Trade created:', result.data);
      return result;
    } catch (error) {
      console.error('API: Error creating trade:', error);
      throw error;
    }
  },

  async buyTrade(tradeId, buyerId) {
    console.log('API: Buying trade:', tradeId);
    try {
      const response = await fetch(`${API_BASE}/trades/${tradeId}/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyer_id: buyerId })
      });
      const result = await response.json();
      console.log('API: Trade purchased:', result);
      return result;
    } catch (error) {
      console.error('API: Error buying trade:', error);
      throw error;
    }
  },

  async releaseTrade(tradeId, sellerId) {
    console.log('API: Releasing escrow for trade:', tradeId);
    try {
      const response = await fetch(`${API_BASE}/trades/${tradeId}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller_id: sellerId })
      });
      const result = await response.json();
      console.log('API: Escrow released:', result);
      return result;
    } catch (error) {
      console.error('API: Error releasing escrow:', error);
      throw error;
    }
  },

  async cancelTrade(tradeId, userId) {
    console.log('API: Canceling trade:', tradeId);
    try {
      const response = await fetch(`${API_BASE}/trades/${tradeId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      const result = await response.json();
      console.log('API: Trade cancelled:', result);
      return result;
    } catch (error) {
      console.error('API: Error canceling trade:', error);
      throw error;
    }
  },

  // Chat
  async getUserChats(userId) {
    console.log('API: Fetching chats for user:', userId);
    try {
      const response = await fetch(`${API_BASE}/trades/user/${userId}/chats`);
      const result = await response.json();
      console.log('API: User chats fetched:', result.data?.length || 0);
      return result;
    } catch (error) {
      console.error('API: Error fetching user chats:', error);
      throw error;
    }
  },

  async getTradeMessages(tradeId) {
    console.log('API: Fetching messages for trade:', tradeId);
    try {
      const response = await fetch(`${API_BASE}/trades/${tradeId}/messages`);
      const result = await response.json();
      console.log('API: Messages fetched:', result.data?.length || 0);
      return result;
    } catch (error) {
      console.error('API: Error fetching messages:', error);
      throw error;
    }
  }
};