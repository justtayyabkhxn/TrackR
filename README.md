# TrackR – A Lost & Found System

TrackR is a web application designed to help users report lost items and find them through an organized lost-and-found system. The system enables users to list their lost or found items, communicate with others, and increase the chances of finding their belongings.

## Features

- **User Authentication**: Sign up, log in, and secure your account with authentication.
- **Lost Item Posting**: Report items you’ve lost and provide details like location, date, and description.
- **Found Item Reporting**: Let others know about items you’ve found, so they can reclaim their belongings.
- **Search Functionality**: Easily search for lost and found items.
- **Responsive Design**: The application is responsive and works on a variety of devices.

## Tech Stack

- **Frontend**: 
  - React (with React Router DOM)
  - Axios
  - Bootstrap
  - Vite bundler

- **Backend**: 
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)

- **Other Tools**:
  - JWT (for authentication)
  - Axios (for API communication)

## Setup

To set up the project on your local machine, follow these steps:

### Prerequisites

- Node.js installed on your system.
- MongoDB set up locally or using MongoDB Atlas.
- Git (optional for cloning the repository).

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/justtayyabkhxn/Track-it
   cd Track-it
   ```

2. **Install dependencies for both frontend and backend**:

   - For the **frontend**:

     ```bash
     cd frontend
     npm install
     ```

   - For the **backend**:

     ```bash
     cd backend
     npm install
     ```

3. **Create a `.env` file** in the backend folder and configure it with the following environment variables:

   ```
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

4. **Run the project**:

   - Run the backend server:

     ```bash
     cd backend
     npm start
     ```

   - Run the frontend:

     ```bash
     cd frontend
     npm run dev
     ```

   The frontend should now be running on [http://localhost:5173](http://localhost:5173) and the backend on [http://localhost:5000](http://localhost:5000).

## Usage

1. **Sign Up/Login**: Users can sign up with their email or log in to an existing account.
2. **Report a Lost Item**: After logging in, users can fill out a form to report a lost item.
3. **Report a Found Item**: Users can report items they've found and include relevant details.
4. **View/Search Items**: Browse through the lost-and-found listings to search for a specific item.

## API Endpoints

### Authentication

- **POST** `/signup`: Register a new user.
- **POST** `/login`: Log in an existing user.

### Lost & Found Items

- **POST** `/additem`: Add a new lost or found item.
- **POST** `/deleteitem`: Delete an item from the database.
- **GET** `/getitems`: Get a list of all lost/found items.

## Future Enhancements

- **Notification System**: Notify users when items are found or matched with their lost items.
- **Item Tracking**: Track items in real-time as they get closer to being found.
- **Enhanced Search**: Include filters for location, date, and item category.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -m "added a feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a pull request and describe your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any queries or issues, feel free to reach out:

- **Email**: tayyabkhangk4734@gmail.com.com
- **GitHub**: [justtayyabkhxn](https://github.com/justtayyabkhxn)

----# TrackR