import React from 'react';
import { Artist } from "../api/types"; 
import DefaultArtist from "../assets/home/placeholderArtist.png";

type CardProps = {
    artist: Artist;
};

const ArtistCard: React.FC<CardProps> = ({ artist }) => {
    return (
        <div className="card">
            <img
                className="profile-photo"
                src={artist.profile_image?.public_url || DefaultArtist} 
                alt="Profile Photo"
            />
            <h2>{artist.name}</h2>
            <p>{artist.bio}</p>
            <div className="tags">
                {artist.user_role_tags.concat(artist.user_genre_tags).map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                ))}
            </div>
        </div>
    );
};

export default ArtistCard;
