// Authentication Service Module - Handles user authentication state
const AuthService = {
  // Get current user ID
  getUserId() {
    const userId = localStorage.getItem('user_id');
    console.log('Auth: Current user ID:', userId);
    return userId ? parseInt(userId) : null;
  },

  // Get current username
  getUsername() {
    const username = localStorage.getItem('username');
    console.log('Auth: Current username:', username);
    return username;
  },

  // Get user wallets
  getWallets() {
    const wallets = localStorage.getItem('wallets');
    console.log('Auth: User wallets:', wallets);
    return wallets ? JSON.parse(wallets) : null;
  },

  // Check if user is logged in
  isLoggedIn() {
    const loggedIn = !!this.getUserId();
    console.log('Auth: User logged in:', loggedIn);
    return loggedIn;
  },

  // Save user data after login/register
  saveUser(userId, username, wallets = null) {
    console.log('Auth: Saving user data:', { userId, username });
    localStorage.setItem('user_id', userId.toString());
    localStorage.setItem('username', username);
    if (wallets) {
      localStorage.setItem('wallets', JSON.stringify(wallets));
    }
  },

  // Clear user data (logout)
  clearUser() {
    console.log('Auth: Clearing user data (logout)');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('wallets');
  },

  // Redirect to login if not authenticated
  requireAuth() {
    if (!this.isLoggedIn()) {
      console.log('Auth: User not authenticated, redirecting to login');
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  // Redirect to index if already authenticated
  redirectIfAuthenticated() {
    if (this.isLoggedIn()) {
      console.log('Auth: User already authenticated, redirecting to index');
      window.location.href = 'index.html';
      return true;
    }
    return false;
  },

  // Display user info in navbar
  displayUserInfo(elementId = 'user-info') {
    const element = document.getElementById(elementId);
    const username = this.getUsername();
    const userId = this.getUserId();

    if (element && username) {
      element.innerHTML = `
        Logged in as: <strong>${username}</strong> (ID: ${userId}) | 
        <a href="#" onclick="AuthService.logout(); return false;" class="text-red-600 hover:text-red-800">Logout</a>
      `;
      console.log('Auth: User info displayed');
    }
  },

  // Logout with confirmation
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      console.log('Auth: User confirmed logout');
      this.clearUser();
      window.location.href = 'login.html';
    }
  }
};