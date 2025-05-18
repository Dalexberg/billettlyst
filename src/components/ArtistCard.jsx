import './ArtistCard.css';

export default function ArtistCard({ artist }) {
  return (
    <div className="artist-card">
      {artist.image && (
        <img src={artist.image} alt={artist.name} className="artist-image" />
      )}
      <h3 className="artist-name">{artist.name}</h3>
    </div>
  );
}
