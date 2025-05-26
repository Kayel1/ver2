// UI Module
import { auth } from './auth.js';
import { events } from './events.js';

export const ui = {
    init() {
        this.attachEventListeners();
        this.updateUI();
        this.handleUrlRouting();
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleUrlRouting();
        });
    },

    attachEventListeners() {
        // Auth Modal
        document.querySelectorAll('[onclick^="openAuthModal"]').forEach(el => {
            el.onclick = (e) => {
                e.preventDefault();
                this.openAuthModal(el.getAttribute('onclick').includes('register') ? 'register' : 'login');
            };
        });

        document.querySelectorAll('[onclick^="closeAuthModal"]').forEach(el => {
            el.onclick = (e) => {
                e.preventDefault();
                this.closeAuthModal();
            };
        });

        document.querySelectorAll('[onclick^="showLoginForm"]').forEach(el => {
            el.onclick = (e) => {
                e.preventDefault();
                this.showLoginForm();
            };
        });

        document.querySelectorAll('[onclick^="showRegisterForm"]').forEach(el => {
            el.onclick = (e) => {
                e.preventDefault();
                this.showRegisterForm();
            };
        });

        // Login/Register Actions
        document.querySelectorAll('[onclick^="login"]').forEach(el => {
            el.onclick = (e) => {
                e.preventDefault();
                this.handleLogin();
            };
        });

        document.querySelectorAll('[onclick^="register"]').forEach(el => {
            el.onclick = (e) => {
                e.preventDefault();
                this.handleRegister();
            };
        });

        // Logout
        document.querySelectorAll('[onclick^="logout"]').forEach(el => {
            el.onclick = (e) => {
                e.preventDefault();
                this.handleLogout();
            };
        });

        // Tab Navigation
        document.querySelectorAll('[onclick^="showTab"]').forEach(el => {
            el.onclick = (e) => {
                e.preventDefault();
                const tabId = el.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.showTab(tabId);
            };
        });

        // Event Registration
        document.querySelectorAll('[onclick^="registerForEvent"]').forEach(el => {
            el.onclick = (e) => {
                e.preventDefault();
                const eventId = parseInt(el.getAttribute('onclick').match(/\((\d+)\)/)[1]);
                this.handleEventRegistration(eventId);
            };
        });

        // Mobile menu
        document.getElementById('mobileMenuButton').onclick = () => this.toggleSidebar();

        // Search and filter
        const searchInput = document.querySelector('#events input[type="text"]');
        const categorySelect = document.querySelector('#events select');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.updateEventsDisplay());
        }
        if (categorySelect) {
            categorySelect.addEventListener('change', () => this.updateEventsDisplay());
        }

        // Window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.remove('mobile-open');
                }
            }
        });

        // Click outside sidebar
        document.addEventListener('click', (event) => {
            const sidebar = document.getElementById('sidebar');
            const mobileMenuButton = document.getElementById('mobileMenuButton');
            
            if (window.innerWidth <= 768 && 
                !sidebar.contains(event.target) && 
                !mobileMenuButton.contains(event.target) &&
                sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
            }
        });

        // Header Controls
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        if (mobileMenuButton) {
            mobileMenuButton.onclick = () => this.toggleSidebar();
        }

        const notificationButton = document.getElementById('notificationButton');
        if (notificationButton) {
            notificationButton.onclick = (e) => {
                e.preventDefault();
                this.toggleNotifications();
            };
        }

        const userMenuButton = document.getElementById('userMenuButton');
        if (userMenuButton) {
            userMenuButton.onclick = (e) => {
                e.preventDefault();
                this.toggleUserMenu();
            };
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            const notificationsDropdown = document.getElementById('notificationsDropdown');
            const userMenu = document.getElementById('userMenu');
            const sidebar = document.getElementById('sidebar');

            // Close notifications if clicking outside
            if (!e.target.closest('#notificationButton') && 
                !e.target.closest('#notificationsDropdown') && 
                notificationsDropdown) {
                notificationsDropdown.classList.add('hidden');
            }

            // Close user menu if clicking outside
            if (!e.target.closest('#userMenuButton') && 
                !e.target.closest('#userMenu') && 
                userMenu) {
                userMenu.classList.add('hidden');
            }

            // Close mobile sidebar if clicking outside on mobile
            if (window.innerWidth <= 768 && 
                !e.target.closest('#sidebar') && 
                !e.target.closest('#mobileMenuButton') && 
                sidebar) {
                sidebar.classList.remove('mobile-open');
            }
        });
    },

    // Auth Modal Functions
    openAuthModal(type) {
        document.getElementById('authModal').classList.remove('hidden');
        if (type === 'login') {
            document.getElementById('authModalTitle').textContent = 'Login';
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('registerForm').classList.add('hidden');
        } else {
            document.getElementById('authModalTitle').textContent = 'Register';
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
        }
    },

    closeAuthModal() {
        document.getElementById('authModal').classList.add('hidden');
    },

    showLoginForm() {
        document.getElementById('authModalTitle').textContent = 'Login';
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
    },

    showRegisterForm() {
        document.getElementById('authModalTitle').textContent = 'Register';
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
    },

    // Auth Actions
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            if (auth.login(email, password)) {
                this.closeAuthModal();
                this.showNotification('success', 'Login Successful', 'You have successfully logged in.');
                this.updateUI();
            } else {
                this.showNotification('error', 'Login Failed', 'Invalid email or password.');
            }
        } catch (error) {
            this.showNotification('error', 'Login Failed', error.message);
        }
    },

    handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const role = document.getElementById('registerRole').value;
        
        if (password !== confirmPassword) {
            this.showNotification('error', 'Registration Failed', 'Passwords do not match.');
            return;
        }
        
        try {
            auth.register(name, email, password, role);
            this.closeAuthModal();
            this.showNotification('success', 'Registration Successful', 'You have successfully registered.');
            this.updateUI();
        } catch (error) {
            this.showNotification('error', 'Registration Failed', error.message);
        }
    },

    handleLogout() {
        auth.logout();
        this.showNotification('success', 'Logged Out', 'You have been logged out successfully.');
        this.updateUI();
        this.showTab('events');
    },

    // Navigation
    showTab(tabId) {
        if (!auth.currentUser && (tabId === 'myRegistrations' || tabId === 'profile' || tabId === 'manageEvents' || tabId === 'participants')) {
            this.openAuthModal('login');
            this.showNotification('info', 'Login Required', 'Please login to access this feature.');
            return;
        }

        if (auth.currentUser && auth.currentUser.role === 'student' && (tabId === 'manageEvents' || tabId === 'participants')) {
            this.showNotification('error', 'Access Denied', 'Only faculty members can access this feature.');
            return;
        }

        document.getElementById('pageTitle').textContent = document.querySelector(`#${tabId} h2`).textContent;
        
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.getElementById(tabId).classList.add('active');
        
        // Update URL
        const newUrl = tabId === 'events' ? '/home' : `/${tabId}`;
        window.history.pushState({}, '', newUrl);
        
        // Update the appropriate table/view | when switching tabs
        switch(tabId) {
            case 'events':
                this.updateEventsDisplay();
                break;
            case 'myRegistrations':
                this.updateRegistrationsTable();
                break;
            case 'manageEvents':
                this.updateManageEventsTable();
                break;
            case 'participants':
                this.updateParticipantsTable();
                break;
            case 'profile':
                this.updateProfileInfo();
                break;
        }
    },

    // Handle URL routing
    handleUrlRouting() {
        const path = window.location.pathname;
        let tabId = 'events';

        if (path === '/home') {
            tabId = 'events';
        } else if (path === '/myRegistrations') {
            tabId = 'myRegistrations';
        } else if (path === '/profile') {
            tabId = 'profile';
        } else if (path === '/manageEvents') {
            tabId = 'manageEvents';
        } else if (path === '/participants') {
            tabId = 'participants';
        }

        this.showTab(tabId);
    },

    // Event Registration
    handleEventRegistration(eventId) {
        if (!auth.currentUser) {
            this.openAuthModal('login');
            this.showNotification('info', 'Login Required', 'Please login to register for events.');
            return;
        }

        if (auth.currentUser.role === 'faculty') {
            this.showNotification('error', 'Registration Not Allowed', 'Faculty members cannot register for events.');
            return;
        }

        try {
            events.registerForEvent(eventId, auth.currentUser.id);
            this.showNotification('success', 'Registration Successful', 'You have successfully registered for the event.');
            this.updateEventsDisplay();
            this.updateRegistrationsTable();
        } catch (error) {
            this.showNotification('error', 'Registration Failed', error.message);
        }
    },

    handleCancelRegistration(registrationId) {
        if (confirm('Are you sure you want to cancel this registration?')) {
            if (events.cancelRegistration(registrationId)) {
                events.saveToStorage();
                this.updateEventsDisplay();
                this.updateRegistrationsTable();
                this.showNotification('success', 'Registration Cancelled', 'Your registration has been cancelled successfully.');
            }
        }
    },

    // UI Updates
    updateUI() {
        this.updateHeader();
        this.updateSidebar();
        this.updateCurrentTab();
    },

    updateHeader() {
        const headerUserName = document.getElementById('headerUserName');
        const userMenuLoggedIn = document.getElementById('userMenuLoggedIn');
        const userMenuLoggedOut = document.getElementById('userMenuLoggedOut');
        
        if (auth.currentUser) {
            headerUserName.textContent = auth.currentUser.name;
            userMenuLoggedIn.classList.remove('hidden');
            userMenuLoggedOut.classList.add('hidden');
        } else {
            headerUserName.textContent = 'Guest';
            userMenuLoggedIn.classList.add('hidden');
            userMenuLoggedOut.classList.remove('hidden');
        }
    },

    updateSidebar() {
        const userSection = document.querySelector('.sidebar nav div:nth-child(2)');
        const adminSection = document.getElementById('adminSection');
        const userNotLoggedIn = document.getElementById('userNotLoggedIn');
        const userLoggedIn = document.getElementById('userLoggedIn');
        const sidebarUserName = document.getElementById('sidebarUserName');
        const sidebarUserRole = document.getElementById('sidebarUserRole');

        if (auth.currentUser) {
            userNotLoggedIn.classList.add('hidden');
            userLoggedIn.classList.remove('hidden');
            sidebarUserName.textContent = auth.currentUser.name;
            sidebarUserRole.textContent = auth.currentUser.role.charAt(0).toUpperCase() + auth.currentUser.role.slice(1);

            // Show user section for both student and faculty
            userSection.classList.remove('hidden');

            if (auth.currentUser.role === 'faculty') {
                this.updateFacultySidebar(userSection, adminSection);
            } else {
                this.updateStudentSidebar(userSection, adminSection);
            }
        } else {
            userNotLoggedIn.classList.remove('hidden');
            userLoggedIn.classList.add('hidden');
            userSection.classList.add('hidden');
            this.updateGuestSidebar(userSection, adminSection);
        }
    },

    updateFacultySidebar(userSection, adminSection) {
        userSection.innerHTML = `
            <p class="sidebar-text text-xs uppercase text-gray-500 font-semibold mb-2">User</p>
            <a href="#" onclick="ui.showTab('profile')" class="flex items-center py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100">
                <i class="sidebar-icon fas fa-user mr-3"></i>
                <span class="sidebar-text">Profile</span>
            </a>
        `;
        adminSection.classList.remove('hidden');
    },

    updateStudentSidebar(userSection, adminSection) {
        userSection.innerHTML = `
            <p class="sidebar-text text-xs uppercase text-gray-500 font-semibold mb-2">User</p>
            <a href="#" onclick="ui.showTab('myRegistrations')" class="flex items-center py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100">
                <i class="sidebar-icon fas fa-ticket-alt mr-3"></i>
                <span class="sidebar-text">My Registrations</span>
            </a>
            <a href="#" onclick="ui.showTab('profile')" class="flex items-center py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100 mt-1">
                <i class="sidebar-icon fas fa-user mr-3"></i>
                <span class="sidebar-text">Profile</span>
            </a>
        `;
        adminSection.classList.add('hidden');
    },

    updateGuestSidebar(userSection, adminSection) {
        userSection.classList.add('hidden');
        adminSection.classList.add('hidden');
    },

    updateCurrentTab() {
        const currentTab = document.querySelector('.tab-content.active');
        if (currentTab) {
            switch(currentTab.id) {
                case 'events':
                    this.updateEventsDisplay();
                    break;
                case 'myRegistrations':
                    this.updateRegistrationsTable();
                    break;
                case 'manageEvents':
                    this.updateManageEventsTable();
                    break;
                case 'participants':
                    this.updateParticipantsTable();
                    break;
                case 'profile':
                    this.updateProfileInfo();
                    break;
            }
        }
    },

    // Utility Functions
    showNotification(type, title, message) {
        const iconMap = {
            success: 'fas fa-check-circle text-green-500',
            error: 'fas fa-exclamation-circle text-red-500',
            info: 'fas fa-info-circle text-blue-500',
            warning: 'fas fa-exclamation-triangle text-yellow-500'
        };
        
        document.getElementById('notificationIcon').className = `${iconMap[type]} text-2xl`;
        document.getElementById('notificationTitle').textContent = title;
        document.getElementById('notificationMessage').textContent = message;
        
        const modal = document.getElementById('notificationModal');
        modal.classList.remove('hidden');
        
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 5000);
    },

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        
        if (window.innerWidth <= 768) {
            // Mobile behavior
            sidebar.classList.toggle('mobile-open');
        } else {
            // Desktop behavior
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('sidebar-collapsed');
        }
    },

    toggleNotifications() {
        const dropdown = document.getElementById('notificationsDropdown');
        const userMenu = document.getElementById('userMenu');
        
        if (dropdown) {
            dropdown.classList.toggle('hidden');
            // Close user menu when opening notifications
            if (userMenu) {
                userMenu.classList.add('hidden');
            }
        }
    },

    toggleUserMenu() {
        const menu = document.getElementById('userMenu');
        const notificationsDropdown = document.getElementById('notificationsDropdown');
        
        if (menu) {
            menu.classList.toggle('hidden');
            // Close notifications when opening user menu
            if (notificationsDropdown) {
                notificationsDropdown.classList.add('hidden');
            }
        }
    },

    closeNotification() {
        const modal = document.getElementById('notificationModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    },

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },

    getCategoryColor(category) {
        switch(category.toLowerCase()) {
            case 'workshop': return 'indigo';
            case 'seminar': return 'green';
            case 'conference': return 'blue';
            case 'social': return 'purple';
            default: return 'gray';
        }
    },

    updateEventsDisplay() {
        const eventsContainer = document.querySelector('#events .grid');
        if (!eventsContainer) return;

        // Get search and filter values
        const searchQuery = document.querySelector('#events input[type="text"]').value.toLowerCase();
        const categoryFilter = document.querySelector('#events select').value;
        
        // Filter and sort events
        let filteredEvents = [...events.eventsList].filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery) ||
                                event.description.toLowerCase().includes(searchQuery) ||
                                event.location.toLowerCase().includes(searchQuery);
            
            const matchesCategory = categoryFilter === 'All Categories' || 
                                  event.category.toLowerCase() === categoryFilter.toLowerCase();
            
            return matchesSearch && matchesCategory;
        });

        // Sort events: upcoming first, then by date
        filteredEvents.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            const now = new Date();
            
            const aIsUpcoming = dateA >= now;
            const bIsUpcoming = dateB >= now;
            
            if (aIsUpcoming && !bIsUpcoming) return -1;
            if (!aIsUpcoming && bIsUpcoming) return 1;
            
            return dateA - dateB;
        });

        eventsContainer.innerHTML = filteredEvents.length > 0 ? filteredEvents.map(event => {
            const registrationsCount = events.registrations.filter(r => r.eventId === event.id).length;
            const isRegistered = auth.currentUser && auth.currentUser.role === 'student' ? 
                events.registrations.some(r => r.eventId === event.id && r.userId === auth.currentUser.id) : false;
            const eventDate = new Date(event.date + ' ' + event.time);
            const isPastEvent = eventDate < new Date();
            
            let actionButton = '';
            if (auth.currentUser && auth.currentUser.role === 'faculty') {
                actionButton = `
                    <span class="text-gray-600 text-sm">
                        ${registrationsCount} ${registrationsCount === 1 ? 'registration' : 'registrations'}
                    </span>
                `;
            } else if (isPastEvent) {
                actionButton = '<span class="text-gray-500 text-sm">Event ended</span>';
            } else if (isRegistered) {
                actionButton = '<span class="text-green-600 text-sm"><i class="fas fa-check mr-1"></i>Registered</span>';
            } else if (!auth.currentUser) {
                actionButton = `
                    <button onclick="ui.openAuthModal('login')" 
                            class="gradient-bg text-white py-2 px-4 rounded-lg hover:opacity-90 transition text-sm">
                        Login to Register
                    </button>
                `;
            } else {
                actionButton = `
                    <button onclick="ui.handleEventRegistration(${event.id})" 
                            class="gradient-bg text-white py-2 px-4 rounded-lg hover:opacity-90 transition text-sm"
                            ${event.capacity > 0 && registrationsCount >= event.capacity ? 'disabled' : ''}>
                        ${event.capacity > 0 && registrationsCount >= event.capacity ? 'Full' : 'Register'}
                    </button>
                `;
            }

            return `
                <div class="event-card bg-white rounded-lg shadow-md overflow-hidden transition duration-300">
                    <div class="h-40 bg-${this.getCategoryColor(event.category)}-100 flex items-center justify-center">
                        <i class="fas fa-${event.image} text-4xl text-${this.getCategoryColor(event.category)}-600"></i>
                    </div>
                    <div class="p-5">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="font-semibold text-lg mb-1">${event.title}</h3>
                                <p class="text-gray-600 text-sm mb-2">${event.description}</p>
                            </div>
                            <span class="bg-${this.getCategoryColor(event.category)}-100 text-${this.getCategoryColor(event.category)}-800 text-xs px-2 py-1 rounded-full">
                                ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                            </span>
                        </div>
                        <div class="flex items-center text-gray-500 text-sm mb-3">
                            <i class="fas fa-calendar-day mr-2"></i>
                            <span>${this.formatDate(event.date)} • ${event.time}</span>
                        </div>
                        <div class="flex items-center text-gray-500 text-sm mb-4">
                            <i class="fas fa-map-marker-alt mr-2"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="text-sm text-gray-600">
                                    ${event.capacity > 0 
                                        ? `${event.capacity - registrationsCount}/${event.capacity} spots left`
                                        : 'Unlimited spots'}
                                </span>
                                ${event.capacity > 0 ? `
                                <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                    <div class="bg-${this.getCategoryColor(event.category)}-600 h-2 rounded-full" 
                                         style="width: ${Math.min((registrationsCount / event.capacity) * 100, 100)}%">
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                            ${actionButton}
                        </div>
                    </div>
                </div>
            `;
        }).join('') : `
            <div class="col-span-full text-center py-8 text-gray-500">
                No events found matching your criteria
            </div>
        `;
    },

    updateRegistrationsTable() {
        const tableBody = document.getElementById('registrationsTableBody');
        const noRegistrationsMessage = document.getElementById('noRegistrationsMessage');
        
        if (!auth.currentUser) {
            tableBody.innerHTML = '';
            noRegistrationsMessage.classList.remove('hidden');
            return;
        }
        
        const userRegistrations = events.registrations.filter(r => r.userId === auth.currentUser.id);
        
        if (userRegistrations.length === 0) {
            tableBody.innerHTML = '';
            noRegistrationsMessage.classList.remove('hidden');
            return;
        }
        
        noRegistrationsMessage.classList.add('hidden');
        
        tableBody.innerHTML = userRegistrations.map(reg => {
            const event = events.eventsList.find(e => e.id === reg.eventId);
            if (!event) return '';
            
            const eventDate = new Date(event.date + ' ' + event.time);
            const now = new Date();
            const isPastEvent = eventDate < now;
            
            return `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <i class="fas fa-${event.image} text-indigo-600"></i>
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">${event.title}</div>
                                <div class="text-sm text-gray-500">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${this.formatDate(event.date)}</div>
                        <div class="text-sm text-gray-500">${event.time}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${event.location}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reg.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                            ${reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        ${!isPastEvent ? `
                            <button onclick="ui.handleCancelRegistration(${reg.id})" class="text-red-600 hover:text-red-900 mr-3">
                                <i class="fas fa-times mr-1"></i>Cancel
                            </button>
                        ` : ''}
                        <button onclick="ui.showEventDetails(${event.id})" class="text-indigo-600 hover:text-indigo-900">
                            <i class="fas fa-info-circle mr-1"></i>Details
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    updateManageEventsTable() {
        const tableBody = document.getElementById('manageEventsTableBody');
        
        tableBody.innerHTML = events.eventsList.map(event => {
            const eventDate = new Date(event.date + ' ' + event.time);
            const now = new Date();
            const isPastEvent = eventDate < now;
            const registrationsCount = events.registrations.filter(r => r.eventId === event.id).length;
            
            return `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <i class="fas fa-${event.image} text-indigo-600"></i>
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">${event.title}</div>
                                <div class="text-sm text-gray-500">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${this.formatDate(event.date)}</div>
                        <div class="text-sm text-gray-500">${event.time}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${event.location}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${event.capacity > 0 ? `${registrationsCount}/${event.capacity}` : 'Unlimited'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isPastEvent ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}">
                            ${isPastEvent ? 'Completed' : 'Upcoming'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick="ui.showEditEventModal(${event.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                        <button onclick="ui.handleDeleteEvent(${event.id})" class="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    updateParticipantsTable() {
        const tableBody = document.getElementById('participantsTableBody');
        const eventFilter = document.getElementById('eventFilter').value;
        
        let participantsToShow = [];
        
        if (eventFilter === 'all') {
            participantsToShow = events.registrations;
        } else {
            const eventId = parseInt(eventFilter);
            participantsToShow = events.registrations.filter(reg => reg.eventId === eventId);
        }
        
        if (participantsToShow.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                        No participants found
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = participantsToShow.map(reg => {
            const user = auth.users.find(u => u.id === reg.userId);
            const event = events.eventsList.find(e => e.id === reg.eventId);
            
            if (!user || !event) return '';
            
            return `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${user.name}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${user.email}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${user.department || '-'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${event.title}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${this.formatDate(reg.registeredOn)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="ui.handleRemoveParticipant(${reg.id})" class="text-red-600 hover:text-red-900">
                            <i class="fas fa-user-minus mr-1"></i> Remove
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    updateProfileInfo() {
        if (!auth.currentUser) return;

        document.getElementById('profileName').textContent = auth.currentUser.name;
        document.getElementById('profileRole').textContent = auth.currentUser.role.charAt(0).toUpperCase() + auth.currentUser.role.slice(1);
        document.getElementById('profileEmail').textContent = auth.currentUser.email;
        document.getElementById('editName').value = auth.currentUser.name;
        document.getElementById('editEmail').value = auth.currentUser.email;
        document.getElementById('editRole').value = auth.currentUser.role;
        document.getElementById('editDepartment').value = auth.currentUser.department || '';
        document.getElementById('editBio').value = auth.currentUser.bio || '';
    },

    // Event Management
    showAddEventModal() {
        document.getElementById('eventModalTitle').textContent = 'Add Event';
        document.getElementById('eventId').value = '';
        document.getElementById('eventTitle').value = '';
        document.getElementById('eventDescription').value = '';
        document.getElementById('eventCategory').value = 'workshop';
        document.getElementById('eventCapacity').value = '0';
        document.getElementById('eventDate').value = '';
        document.getElementById('eventTime').value = '';
        document.getElementById('eventLocation').value = '';
        document.getElementById('eventModal').classList.remove('hidden');
    },

    showEditEventModal(eventId) {
        const event = events.eventsList.find(e => e.id === eventId);
        if (!event) return;

        document.getElementById('eventModalTitle').textContent = 'Edit Event';
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventCategory').value = event.category;
        document.getElementById('eventCapacity').value = event.capacity;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventModal').classList.remove('hidden');
    },

    closeEventModal() {
        document.getElementById('eventModal').classList.add('hidden');
    },

    saveEvent() {
        const eventId = document.getElementById('eventId').value;
        const eventData = {
            title: document.getElementById('eventTitle').value,
            description: document.getElementById('eventDescription').value,
            category: document.getElementById('eventCategory').value,
            capacity: parseInt(document.getElementById('eventCapacity').value) || 0,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value
        };

        if (!eventData.title || !eventData.description || !eventData.date || !eventData.time || !eventData.location) {
            this.showNotification('error', 'Validation Error', 'Please fill in all required fields.');
            return;
        }

        try {
            if (eventId) {
                // Update existing event
                const event = events.eventsList.find(e => e.id === parseInt(eventId));
                if (event) {
                    Object.assign(event, eventData);
                    this.showNotification('success', 'Event Updated', 'The event has been updated successfully.');
                }
            } else {
                // Add new event
                events.addEvent(eventData);
                this.showNotification('success', 'Event Added', 'The event has been added successfully.');
            }
            
            this.closeEventModal();
            // Update both the events display and manage events table
            this.updateEventsDisplay();
            this.updateManageEventsTable();
            events.saveToStorage();
        } catch (error) {
            this.showNotification('error', 'Error', error.message);
        }
    },

    handleDeleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            const eventIndex = events.eventsList.findIndex(e => e.id === eventId);
            if (eventIndex !== -1) {
                // Remove the event and its registrations
                events.eventsList.splice(eventIndex, 1);
                events.registrations = events.registrations.filter(r => r.eventId !== eventId);
                events.saveToStorage();
                
                // Update both the events display and manage events table
                this.updateEventsDisplay();
                this.updateManageEventsTable();
                this.updateParticipantsTable();
                
                this.showNotification('success', 'Event Deleted', 'The event has been deleted successfully.');
            }
        }
    },

    handleRemoveParticipant(registrationId) {
        if (confirm('Are you sure you want to remove this participant?')) {
            if (events.cancelRegistration(registrationId)) {
                events.saveToStorage();
                // Update all relevant views
                this.updateParticipantsTable();
                this.updateEventsDisplay();
                this.updateManageEventsTable();
                this.showNotification('success', 'Participant Removed', 'The participant has been removed successfully.');
            }
        }
    }
};

// Make ui functions globally available
window.ui = ui;

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => ui.init()); 
