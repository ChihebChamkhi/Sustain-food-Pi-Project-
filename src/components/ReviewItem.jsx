// components/ReviewItem.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ReviewItem = ({ review }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">{review.emoji}</span>
        <span className="text-yellow-500 font-bold">
          {review.score}/10
        </span>
      </div>
      <p className="text-gray-700">{review.content}</p>
      <div className="text-sm text-gray-500 mt-2">
        {new Date(review.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

ReviewItem.propTypes = {
  review: PropTypes.object.isRequired
};








export default ReviewItem;