import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBusinesses } from '../../services/api';
import BusinessCard from './BusinessCard';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await getBusinesses();
        setBusinesses(data);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  if (loading) return <div>Loading businesses...</div>;

  return (
    <div className="business-list">
      <h2>Businesses to Review</h2>
      {businesses.map(business => (
        <Link to={`/business/${business._id}`} key={business._id}>
          <BusinessCard business={business} />
        </Link>
      ))}
    </div>
  );
};

export default BusinessList;