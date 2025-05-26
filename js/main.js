// Main Application Module
import { auth } from './auth.js';
import { events } from './events.js';
import { ui } from './ui.js';

// Make modules globally available
window.auth = auth;
window.events = events;
window.ui = ui;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Load saved data
    auth.loadFromStorage();
    events.loadFromStorage();
    auth.initializeDefaultAccounts();

    // Initialize UI
    ui.init();

    // Set up auto-save
    window.addEventListener('beforeunload', () => {
        auth.saveToStorage();
        events.saveToStorage();
    });
}); 