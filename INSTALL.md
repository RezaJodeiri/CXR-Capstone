# CXR-Capstone Installation

This project is fully containerized using Docker Compose, which automatically handles all installation requirements:

* All Python dependencies for the backend are installed automatically
* All npm packages for the frontend are installed automatically
* No manual package installation is required

## Quick Start

Please refer to the **Getting Started** section in the [README.md](README.md) for complete installation instructions for developer.

## Uninstallation

```bash
# Stop and remove containers
docker-compose down

# Remove all related images and volumes
docker-compose down --rmi all --volumes

# Optional: Clean up Docker system
docker system prune -a
```