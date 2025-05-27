// Auth
export const auth = {
    currentUser: null,
    users: [],

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = { ...user };
            this.saveToStorage();
            return true;
        }
        return false;
    },

    register(name, email, password, role) {
        if (!email.endsWith('@university.edu')) {
            throw new Error('Please use your university email address.');
        }
        
        if (this.users.some(u => u.email === email)) {
            throw new Error('Email already in use.');
        }

        // Validate 
        if (role !== 'student' && role !== 'faculty') {
            throw new Error('Invalid role selected.');
        }

        const newUser = {
            id: this.users.length + 1,
            name,
            email,
            role,
            department: "",
            bio: "",
            password
        };

        this.users.push(newUser);
        this.currentUser = { ...newUser };
        this.saveToStorage();
        return newUser;
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('s_currentUser');
    },

    initializeDefaultAccounts() {
        if (this.users.length === 0) {
            const defaultFaculty = {
                id: 1,
                name: "Admin Faculty",
                email: "admin.faculty@university.edu",
                role: "faculty",
                department: "Administration",
                bio: "System Administrator",
                password: "admin123"
            };
            this.users.push(defaultFaculty);
            this.saveToStorage();
        }
    },

    loadFromStorage() {
        // Load users
        const savedUsers = localStorage.getItem('uniEvents_users');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        }

        // Load current user 
        const savedCurrentUser = localStorage.getItem('uniEvents_currentUser');
        if (savedCurrentUser) {
            const currentUserData = JSON.parse(savedCurrentUser);
            // Verify the user / user array
            const user = this.users.find(u => u.id === currentUserData.id && u.email === currentUserData.email);
            if (user) {
                this.currentUser = { ...user };
            } else {
                // Clear the session
                localStorage.removeItem('uniEvents_currentUser');
                this.currentUser = null;
            }
        } else {
            this.currentUser = null;
        }
    },

    saveToStorage() {
        localStorage.setItem('uniEvents_users', JSON.stringify(this.users));
        if (this.currentUser) {
            localStorage.setItem('uniEvents_currentUser', JSON.stringify(this.currentUser));
        }
    }
}; 
