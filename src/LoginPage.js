
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogin = () => {
        // Simulating login logic, you would replace this with your actual authentication logic
        if (username === 'example' && password === 'password') {
            setLoggedIn(true);
        } else {
            alert('Invalid username or password');
        }
    };

    return (
        <div>
            {loggedIn ? (
                <div>
                    <h2>Welcome, {username}!</h2>
                    <button onClick={() => setLoggedIn(false)}>Logout</button>
                </div>
            ) : (
                <div>
                    <h2>Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <button onClick={handleLogin}>Login</button>
                </div>
            )}
        </div>
    );
};

export default LoginPage;