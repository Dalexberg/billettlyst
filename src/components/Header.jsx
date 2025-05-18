import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="logo">
        <Link to="/">BillettLyst</Link>
      </div>
      <nav className="main-nav">
        <Link to="/category/music">Musikk</Link>
        <Link to="/category/sports">Sport</Link>
        <Link to="/category/arts&theatre">Teater/Show</Link>
      </nav>
      <div className="login-link">
        <Link to="/dashboard">Logg inn</Link>
      </div>
    </header>
  );
}
