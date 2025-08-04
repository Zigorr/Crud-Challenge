const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: Listen for menu events
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-new-todo', callback);
  },
  
  // Example: Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },

  // Get app version
  getVersion: () => {
    return process.env.npm_package_version || '1.0.0';
  },

  // Check if running in Electron
  isElectron: () => {
    return true;
  }
});