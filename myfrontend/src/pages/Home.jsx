import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
    const [message, setMessage] = useState("");

    useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/test/")
      .then((res) => setMessage(res.data.message))
      .catch((err) => console.error(err));
    }, []);

    return (
        <div class="bg-red">
            <h1>Welcome Home!</h1>
            <Link to="/login">Logout</Link>
            <div>
                <h1>React + Django REST API</h1>
                <p>Message from Django: {message}</p>
            </div>
        </div>
    )
}

export default Home; 