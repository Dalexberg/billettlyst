import { useEffect, useState } from 'react';
import { sanity, urlFor } from '../lib/sanityClient';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('username'));
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);

  const fetchUser = async (usernameToFetch) => {
    const foundUser = await sanity.fetch(`*[_type == "user" && name == $username][0]{
      _id,
      name,
      gender,
      birthdate,
      image,
      wishlist[]->{ title, apiId },
      previousPurchases[]->{ title, apiId },
      friends[]->{
        _id,
        name,
        image,
        wishlist[]->{ title, apiId }
      }
    }`, { username: usernameToFetch });

    if (foundUser) {
      setUser(foundUser);
      setFriends(foundUser.friends || []);
      setIsLoggedIn(true);
      setUsername(usernameToFetch);
      localStorage.setItem('username', usernameToFetch);
    } else {
      alert('Ingen brukere med det navnet');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return;
    fetchUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUser(null);
    setUsername('');
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && !user) {
      fetchUser(storedUsername);
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <main className="dashboard-container">
        <h1>Dashboard</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Brukernavn:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <button type="submit">Logg inn</button>
        </form>
      </main>
    );
  }

  return (
    <main className="dashboard-container">
      <button onClick={handleLogout}>Logg ut</button>
      <h1>Dashboard</h1>

      {user && (
        <div className="dashboard-layout">
          <div>
            <h2>{user.name}</h2>
            {user.image && <img src={urlFor(user.image).width(200).url()} alt={user.name} />}
            <p>{user.birthdate}</p>
            <p>{user.gender}</p>
          </div>

          <div>
            <h2>Venner</h2>
            {friends.map(friend => {
              const commonWishlist = friend.wishlist.filter(event =>
                user.wishlist.some(ue => ue.apiId === event.apiId)
              );
              return (
                <div key={friend._id}>
                  {friend.image && <img src={urlFor(friend.image).width(100).url()} alt={friend.name} />}
                  <h3>{friend.name}</h3>
                  {commonWishlist.map(event => (
                    <p key={event.apiId}>
                      Du og {friend.name} ønsker begge å dra på <strong>{event.title}</strong>, hva med å dra sammen?
                    </p>
                  ))}
                </div>
              );
            })}
          </div>

          <div>
            <h2>Mine kjøp</h2>
            {user.previousPurchases.map(event => (
              <div key={event.apiId}>
                <p>{event.title}</p>
                <Link to={`/sanity-event/${event.apiId}`}>Se mer om dette kjøpet</Link>
              </div>
            ))}
            <h2>Min ønskeliste</h2>
            {user.wishlist.map(event => (
              <div key={event.apiId}>
                <p>{event.title}</p>
                <Link to={`/sanity-event/${event.apiId}`}>Se mer om dette arrangementet</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
