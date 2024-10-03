# CXR-Capstone

A deep learning-based chest X-ray analysis project using PyTorch and Flask for backend, and React for frontend.

## Project Overview
This project focuses on using PyTorch and deep learning to analyze chest X-rays and generate reports that predict potential diseases, along with demographic information such as race, age, and gender. By utilizing multi-task learning, the model aims to handle both medical diagnosis and demographic classification, addressing challenges in medical imaging, bias mitigation, and multi-label prediction.

## Project Structure

Below is the structure of the project and an explanation of the key folders and files.
```
CXR-Capstone/
├── .github/                        # GitHub Actions CI/CD pipeline
├── docs/                           # Documentation for capstone reports
├── src/                            # Source folder for all main code
│   ├── backend/                    # Backend code
│   │   ├── api/                    # API routes (Flask endpoints)
│   │   │   └── predict.py          # Endpoint for predicting disease
│   │   ├── uploads/                # User uploaded images
│   │   ├── app.py                  # Main Flask app
│   │   ├── Dockerfile              # Docker container for backend
│   │   ├── requirements.txt        # Python dependencies
│   ├── frontend/                   # Frontend code
│   │   ├── public/                 # Static assets like images, CSS
│   │   │   └── index.html          # HTML entry point
│   │   ├── src/                    # React components or JavaScript files
│   │   │   ├── services/           # Services (API calls to backend)
│   │   │   │   └── api.js          # API service for communicating with backend
│   │   │   ├── App.js              # Main React App component
│   │   │   └── index.js            # Main React entry point
│   │   ├── static/                 # Static files
│   │   ├── Dockerfile              # Docker container for frontend
│   │   └── package.json            # Frontend dependencies
│   ├── notebooks/                  # Jupyter notebooks for data model training
│   └── docker-compose.yml          # Docker Compose to orchestrate containers
├── test/                           # Unit tests
│   ├── backend/                    # Backend tests
│   └── frontend/                   # Frontend tests
├── .gitignore                      # Gitignore for files to exclude from Git
├── README.md                       # Main project documentation
├── LICENSE                         # License for the project
```

## Getting Started

This project is fully containerized using Docker and Docker Compose. There is no need to manually install any dependencies like `npm` or `pip`. The Docker configuration will take care of setting up both the frontend and backend.


### Prerequisites

Ensure that you have **Docker** installed on your system:

- **Docker**: [Download Docker](https://www.docker.com/get-started) and install it for your operating system.

### Steps to Run the Application

```bash
# 1.Direct terminal to the src folder where the docker-compose.yml file is located:
cd src 

# 2. Build and  Run the Application
docker-compose build
docker-compose up

# This will:
# - Start both the frontend and backend services.

# 3. Access the Application:
# - Frontend: Open your browser and go to http://localhost:3000 to access the web interface.
# - Backend (API): The Flask API will be available at http://localhost:8888.

# 4. Stopping the Containers
docker-compose down

# This will stop and remove the containers created by Docker Compose.

#Note: For the first time, the build may take a few minutes to install and cache dependencies. To remove cached images and free up space, you can use the following command:

docker system prune -a
```
