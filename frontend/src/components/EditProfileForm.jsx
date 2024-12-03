import React, { useState } from 'react';
import './EditProfile.css';

const EditProfile = ({ userProfile, onClose, onUpdate, refreshProfile }) => {
  const [email, setEmail] = useState(userProfile.Email);
  const [fullName, setFullName] = useState(userProfile.Name);
  const [phoneNumber, setPhoneNumber] = useState(userProfile.PhoneNumber);
  const [error, setError] = useState('');

  const handleSaveChanges = async () => {
    try {
      // Prepare the request payload
      const payload = {
        email, // Email is mandatory as per backend implementation
        ...(fullName && { name: fullName }), // Include only if provided
        ...(phoneNumber && { phoneNumber }), // Include only if provided
      };

      const response = await fetch('http://127.0.0.1:8000/api/user-profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if required
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        onUpdate(data.user); // Update parent component with updated profile
        refreshProfile(); // Fetch fresh data
        onClose(); // Close modal
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update profile.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error:', err);
    }
  };

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled // Disable email field if it should not be editable
          />
        </div>
        <div className="form-field">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="actions">
          <button className="save-btn" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
