// Events
export const events = {
    eventsList: [],
    registrations: [],

    addEvent(eventData) {
        const newEvent = {
            id: this.eventsList.length > 0 ? Math.max(...this.eventsList.map(e => e.id)) + 1 : 1,
            ...eventData,
            registered: 0,
            image: this.getImageForCategory(eventData.category)
        };
        this.eventsList.push(newEvent);
        return newEvent;
    },

    registerForEvent(eventId, userId) {
        const event = this.eventsList.find(e => e.id === eventId);
        if (!event) throw new Error('Event not found');

        if (event.capacity > 0 && event.registered >= event.capacity) {
            throw new Error('Event is full');
        }

        if (this.registrations.some(r => r.userId === userId && r.eventId === eventId)) {
            throw new Error('Already registered');
        }

        const newRegistration = {
            id: this.registrations.length + 1,
            userId,
            eventId,
            registeredOn: new Date().toISOString().split('T')[0],
            status: 'confirmed'
        };

        this.registrations.push(newRegistration);
        event.registered++;
        return newRegistration;
    },

    cancelRegistration(registrationId) {
        const registration = this.registrations.find(r => r.id === registrationId);
        if (!registration) return false;

        const event = this.eventsList.find(e => e.id === registration.eventId);
        if (event) {
            event.registered--;
        }

        this.registrations = this.registrations.filter(r => r.id !== registrationId);
        return true;
    },

    getImageForCategory(category) {
        switch(category.toLowerCase()) {
            case 'workshop': return 'laptop-code';
            case 'seminar': return 'chalkboard-teacher';
            case 'conference': return 'users';
            case 'social': return 'users';
            default: return 'calendar-alt';
        }
    },

    loadFromStorage() {
        const savedEvents = localStorage.getItem('uniEvents_events');
        const savedRegistrations = localStorage.getItem('uniEvents_registrations');

        if (savedEvents) {
            this.eventsList = JSON.parse(savedEvents);
        }
        if (savedRegistrations) {
            this.registrations = JSON.parse(savedRegistrations);
        }
    },

    saveToStorage() {
        localStorage.setItem('uniEvents_events', JSON.stringify(this.eventsList));
        localStorage.setItem('uniEvents_registrations', JSON.stringify(this.registrations));
    }
}; 
