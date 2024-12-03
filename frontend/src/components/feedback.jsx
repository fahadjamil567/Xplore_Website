import React, { useState, useEffect } from 'react';
import './Review.css';

const Feedback = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loadingName, setLoadingName] = useState(true); // Track if the name is loading

  useEffect(() => {
    // Fetch destinations
    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/destinations/');
        if (!response.ok) throw new Error('Failed to fetch destinations');
        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch user data based on logged-in email
    const fetchUserData = async () => {
      const loggedInEmail = localStorage.getItem("userEmail");
      if (loggedInEmail) {
        setEmail(loggedInEmail); 
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/user-profile/?email=${loggedInEmail}`);
          if (!response.ok) throw new Error('Failed to fetch user data');
          const userData = await response.json();
          setName(userData.email);  // Set name from fetched user data
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingName(false); // Stop loading once data is fetched
        }
      }
    };

    fetchDestinations();
    fetchUserData();
  }, []);

  const validateForm = () => {
    if (!name || !email || !message || !rating || !destinationId) {
      alert('Please fill out all fields and select a rating.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const feedbackData = { name, email, destinationId, message, rating };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      if (!response.ok) throw new Error('Failed to submit feedback');
      alert('Feedback submitted successfully!');
      setName('');
      setEmail('');
      setDestinationId('');
      setMessage('');
      setRating('');
    } catch (error) {
      console.error(error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  return (
    <div className="feedback-body">
      <header>
        <nav>
          <ul>
            <li><a href="Home">Home</a></li>
            <li><a href="tours">Tours</a></li>
            <li><a href="Trek">Treks</a></li>
            <li><a href="Faqs">FAQs</a></li>
            <li><a href="UserProfile">Profile</a></li>
            <li><a href="AboutUs">About Us</a></li>
          </ul>
        </nav>
      </header>

      {/* Displaying Full Name */}
      <div className="user-name">
        {loadingName ? <h3>Loading...</h3> : <h3>Welcome, {name}!</h3>}
      </div>

      <div className="feedback-container">
        <h2>Feedback Form</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled 
            />
          </div>

          {/* Select Destination */}
          <div className="form-group">
            <label htmlFor="destination">Select Destination</label>
            <select
              id="destination"
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              required
            >
              <option value="">Select a destination</option>
              {destinations.length > 0 ? (
                destinations.map((destination) => (
                  <option key={destination.DestinationId} value={destination.DestinationId}>
                    {destination.DestinationId} - {destination.Name}
                  </option>
                ))
              ) : (
                <option>No destinations available</option>
              )}
            </select>
          </div>

          {/* Message */}
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="5"
              required
            />
          </div>

          {/* Rating */}
          <div className="form-group">
            <label>Rating</label>
            <div className="rating">
              {[5, 4, 3, 2, 1].map((star) => (
                <React.Fragment key={star}>
                  <input
                    type="radio"
                    id={`star${star}`}
                    name="rating"
                    value={star}
                    checked={rating === star.toString()}
                    onChange={() => setRating(star.toString())}
                    required
                  />
                  <label htmlFor={`star${star}`}>&#9733;</label>
                </React.Fragment>
              ))}
            </div>
          </div>

          <button type="submit" className="btn">Send Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
