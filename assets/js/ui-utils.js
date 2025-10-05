
const UIUtils = {
  showMessage(containerId, message, type = 'info') {
    console.log(`UI: Showing ${type} message:`, message);
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('UI: Container not found:', containerId);
      return;
    }

    const alertClasses = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };

    container.innerHTML = `
      <div class="border rounded-lg p-4 mb-4 ${alertClasses[type] || alertClasses.info}">
        ${message}
      </div>
    `;
    container.style.display = 'block';
  },

  // Show loading state
  showLoading(containerId, message = 'Loading...') {
    console.log('UI: Showing loading state:', message);
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="flex items-center justify-center p-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span class="text-gray-600">${message}</span>
        </div>
      `;
    }
  },

  // Format time ago
  formatTimeAgo(timestamp) {
    if (!timestamp) return 'Never';

    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now - then) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';

    return then.toLocaleDateString();
  },

  // Escape HTML for XSS protection
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Disable/enable button with loading state
  setButtonLoading(buttonId, loading, loadingText = 'Processing...') {
    const button = document.getElementById(buttonId);
    if (!button) {
      console.error('UI: Button not found:', buttonId);
      return;
    }

    if (loading) {
      console.log('UI: Setting button to loading state:', buttonId);
      button.dataset.originalText = button.textContent;
      button.textContent = loadingText;
      button.disabled = true;
      button.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      console.log('UI: Removing loading state from button:', buttonId);
      button.textContent = button.dataset.originalText || 'Submit';
      button.disabled = false;
      button.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  },

  // Get status badge HTML
  getStatusBadge(status) {
    const statusColors = {
      open: 'bg-green-500',
      in_progress: 'bg-yellow-500',
      completed: 'bg-gray-500',
      cancelled: 'bg-red-500'
    };

    return `
      <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[status] || 'bg-gray-500'}">
        ${status.toUpperCase()}
      </span>
    `;
  },

  // Show empty state
  showEmptyState(containerId, icon, title, message, actionHtml = '') {
    console.log('UI: Showing empty state:', title);
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">${icon}</div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">${title}</h2>
          <p class="text-gray-600 mb-4">${message}</p>
          ${actionHtml}
        </div>
      `;
    }
  },

  // Show error
  showError(containerId, error) {
    console.error('UI: Showing error:', error);
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <strong class="font-bold">Error:</strong> ${error.message || error}
          <br><br>
          <span class="text-sm">Make sure your backend server is running on ${API_BASE || 'http://localhost:8000'}</span>
        </div>
      `;
    }
  },

  // Confirm action
  confirm(message) {
    console.log('UI: Showing confirmation dialog:', message);
    return window.confirm(message);
  }
};