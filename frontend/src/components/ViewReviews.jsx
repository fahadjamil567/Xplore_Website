import React, { useState, useEffect } from 'react';
import './AllReviews.css';

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/feedback/view/'); // Updated API endpoint
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div className="all-reviews-container">
      <h2>User Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <h3>{review.email}</h3>
              <p>
                <strong>Rating:</strong> {review.rating} ⭐
              </p>
              <p>
                <strong>Message:</strong> {review.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllReviews;
