# CTU Event Registration System

A web-based event registration system for Cebu Technological University, allowing students and faculty to manage university events.

## Features

- **User Authentication**
  - Student and Faculty registration
  - Secure login/logout
  - Session persistence
  - Role-based access control

- **Event Management**
  - View upcoming events
  - Register for events (students)
  - Create and manage events (faculty)
  - Track event capacity and registrations
  - Filter events by category
  - Search functionality

- **User Dashboard**
  - View registered events
  - Manage profile information
  - Track event participation

- **Admin Features**
  - Manage event participants
  - Export participant lists
  - View registration statistics

## Tech Stack

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (ES6+)
- Local Storage for data persistence
- Font Awesome for icons
- Python HTTP Server for development

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ctu-event-registration.git
   cd ctu-event-registration
   ```

2. Start a local server (using Python):
   ```bash
   # Python 3.x
   python -m http.server 8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Default Admin Account

- Email: admin.faculty@university.edu
- Password: admin123

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Cebu Technological University
- All contributors and testers 