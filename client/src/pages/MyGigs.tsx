import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Assuming GigCard is properly defined elsewhere, import it
import GigCard from '@/components/GigCards';

const MyGigs = () => {
  const [gigData, setGigData] = useState({ my_gigs: [], my_applications: [] });
  const [activeTab, setActiveTab] = useState('APPLIED'); // 'APPLIED' for my_gigs, 'POSTED' for my_applications
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await fetch('/api/mygigs/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`, // verifying auth if required
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGigData(data); 
      } catch (error) {
        console.error('There was a problem fetching the gigs:', error);
        navigate('/Profile'); // Redirect to login if there's an issue (e.g., not authenticated)
      }
    };

    fetchGigs();
  }, [user, navigate]);

  const getGigsToDisplay = () => {
    return activeTab === 'APPLIED' ? gigData.my_gigs : gigData.my_applications;
  };

  return (
    <div>
      <div>
        <button className={activeTab === 'APPLIED' ? 'active' : ''} onClick={() => setActiveTab('APPLIED')}>APPLIED GIGS</button>
        <button className={activeTab === 'POSTED' ? 'active' : ''} onClick={() => setActiveTab('POSTED')}>POSTED GIGS</button>
      </div>
      <div className="my-gigs-cards">
        {getGigsToDisplay().map((gig, index) => (
          <GigCard key={index}
            id={gig.id}
            estimateFlatRate={gig.estimate_flat_rate}
            name={gig.name}
            bio={gig.bio}
            eventStart={gig.event_start}
            eventEnd={gig.event_end}
            gigRoleTags={gig.gig_role_tags}
          />
        ))}
      </div>
    </div>
  );
};

export default MyGigs;
