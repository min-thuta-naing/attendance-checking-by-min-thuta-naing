import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Dummy signup logic
    navigate('/home');
  }

  return (
    <div className="container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Name" required /><br/>
        <input type="email" placeholder="Email" required /><br/>
        <input type="password" placeholder="Password" required /><br/>
        <button type="submit">Signup</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}
