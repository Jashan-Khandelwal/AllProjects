import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";

function Home() {
  return (
    <div className="home">
      <section className="hero-section">
        <img src={heroImg} alt="" className="hero-img" />
        <div className="hero-text">
          <h1>Welcome to Pokémon</h1>
          <p>
            Your one-stop shop for everything you don't actually need. Browse
            real products pulled live from the FakeStore API and fill up your
            cart.
          </p>
          <Link to="/shop" className="cta-button">
            Start Shopping →
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h2>🚚 Fast Shipping</h2>
          <p>Imaginary orders delivered at the speed of thought.</p>
        </div>
        <div className="feature">
          <h2>💸 Great Prices</h2>
          <p>Prices so fake, you can't afford to miss them.</p>
        </div>
        <div className="feature">
          <h2>⭐ Top Rated</h2>
          <p>Loved by developers building portfolio projects everywhere.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
