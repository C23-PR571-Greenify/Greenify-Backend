<div align="center">

  <img src="https://github.com/C23-PR571-Greenify/Greenify-Documentation/blob/main/logo.png" alt="logo" width="350" height="auto" />
  <h1>Greenify Backend</h1>
  
  <p>
    Backend For Bangkit 2023 Final Capstone Project  
  </p>

</div>








<!-- Getting Started -->
## 	:toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

This project uses NPM as package manager

* Install node.js version 16.13.1 <a href="https://nodejs.org/en/blog/release/v16.13.1">*here*<a/> <br />
  Make sure your node.js and npm already install in your device using, open cmd and run:
  ```bash
  node -v
  npm -v
  ```
* Google Cloud Platform Account (If You want to to deploy it in GCP)
  
  _Note: We already deploy our API on Cloud RUN, and for cloud run we are setting to maximun 2 instances, this for saving GCP money, and for databases we use CloudSQL to store our data_
  
  <!-- Architecture -->

<div align="center">

  <img src="https://github.com/C23-PR571-Greenify/Greenify-Documentation/blob/main/Greenify%20architecture.png" alt="architecture" width="800" height="auto" />
 

</div>

  <!-- Installation -->
### :running: Run Locally With NPM

Follow this step to run this repostory code in your local device:
  1. Open git bash and Clone the repo
   ```sh
   git clone https://github.com/C23-PR571-Greenify/Greenify-Backend.git
   ```
  2. Go to project folder 
  ``` sh
  cd Greenify-Backend
  ``` 
3. Open the project at VS Code 
  ``` sh
  code . 
  ``` 
  4. open terminal & install Package
  ``` sh
  npm install
  ``` 
  5.  Start the server
   ```sh
   npm start, or
   npm run dev (using nodemon)
   ```
  
  _Note:_
  1. Make sure you change the value of .env file
  2. Setup .env file to your local environment

  ### :whale2: Run Locally With Docker
  Using Docker so you dont need to configure `node version`
  1. Open git bash and Clone the repo
   ```sh
   git clone https://github.com/C23-PR571-Greenify/Greenify-Backend.git
   ```
  2. Go to project folder 
  ``` sh
  cd Greenify-Backend
  ``` 
  3. Open the project at VS Code 
  ``` sh
  code . 
  ``` 
  4. open terminal & build docker image
  ``` sh
  docker build -t greenify-backend .
  ``` 
  5. Run the docker image
  ```sh
  docker run -p 8080:8080 greenify-backend
  ```
  
  <!-- Deployment -->
### :cloud: Deployment

To deploy this project we are using cloud run at GCP (you can use another service), this is the way to deploy it at cloud run:

1. Build Container Image
```bash
  docker build -t IMAGE-NAME . 
```
2. Run the docker image for make sure everything okay
  ```bash
  docker run -p 8080:8080 IMAGE-NAME
  ```
 3. Make a <a href="https://cloud.google.com/artifact-registry/docs/repositories/create-repos">repository at artifact registry</a>
 4. Push the <a href="https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling">Docker image to a artifact registry</a>
  5. Create a <a href="https://cloud.google.com/run/docs/deploying">cloud run service </a> and use your image at artifact registry repository
  6. Check your deployed API Link
  
<!-- Usage -->
## :eyes: Usage
  After you running the server you can testing it at postman, you can see our <a href="https://documenter.getpostman.com/view/27581920/2s93sZ6E96">**API Documentation**</a> for more detail 

<!-- TechStack -->
### :space_invader: Tech Stack
  <h4>BackEnd:</h4>
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" />
  <img src="https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white" />
  
  <h4>Database:</h4>
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" />

<h4>Cloud:</h4>
  <img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" />

<h4>Tools:</h4>
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" />
  <img src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white" />


