import React from 'react';
import { Artist } from "../api/types"; 
import DefaultArtist from "../assets/home/placeholderArtist.png";
import { useNavigate } from 'react-router-dom';


type CardProps = {
    artist: Artist;
};

const ArtistCard: React.FC<CardProps> = ({ artist }) => {
    const navigate = useNavigate();
    const handleClick = () => {
      navigate(`/artists/${artist.id}`);
    };
    return (
        <div className="card">
            <button onClick={handleClick} style={{ width:'100%', border: 'none', background: 'none', padding: 0, margin: 0 }}>
            <img
                className="profile-photo"
                src={artist.profileImage[0]?.public_url} 
                alt="Profile Photo"
            />
            </button>
            <h2>{artist.name}</h2>
            <p>{artist.bio}</p>
            <div className="tags">
                {artist.user_role_tags.concat(artist.user_genre_tags).slice(0, 2).map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                ))}
            </div>
        </div>
    );
};

export default ArtistCard;
