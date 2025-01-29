# AI Employee

An intelligent automation platform that acts as a virtual employee, capable of performing various tasks using AI and automation technologies.

## Features

- Task Automation
- Browser Control
- WhatsApp Integration
- Email Marketing via HubSpot
- Google Colab Integration
- MongoDB and PostgreSQL Database Support
- Docker Containerization

## Tech Stack

- Node.js
- TypeScript
- MongoDB
- PostgreSQL
- Docker
- NX Monorepo
- Various AI Services Integration

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/felpst/ai-employee.git
cd ai-employee
```

2. Copy the environment template:
```bash
cp .env.example .env
```

3. Fill in your environment variables in `.env`

4. Install dependencies:
```bash
npm install
```

5. Start the services:
```bash
docker-compose up
```

## Project Structure

- `/apps` - Application services
  - `/app` - Frontend application
  - `/server` - Backend API
  - `/python_api` - Python services
- `/libs` - Shared libraries
- `.nx` - NX workspace configuration

## Development

- Main Branch: Production-ready code
- Develop Branch: Development and integration
- Backup-Main: Backup of stable releases

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

This project uses environment variables for all sensitive information. Never commit actual secrets to the repository.

## License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.
