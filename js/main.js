import { auth } from './auth.js';
import { events } from './events.js';
import { ui } from './ui.js';

// Autoload/global
window.auth = auth;
window.events = events;
window.ui = ui;

// Init app
document.addEventListener('DOMContentLoaded', () => {
    // Load saved data
    auth.loadFromStorage();
    events.loadFromStorage();
    auth.initializeDefaultAccounts();

    // Init UI
    ui.init();

    // auto-save
    window.addEventListener('beforeunload', () => {
        auth.saveToStorage();
        events.saveToStorage();
    });
}); 
