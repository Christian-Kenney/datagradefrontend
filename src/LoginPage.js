// LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import './login.css'
import RegistrationModal from './RegistrationModal';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { setLoggedInUser } = useUser();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://datagradebackend-f2ecd09dee7f.herokuapp.com/users');
            if (response.ok) {
                const userData = await response.json();
                setUsers(userData);
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleLogin = () => {
        const matchedUser = users.find(user => user.username === username && user.password === password);
        if (matchedUser) {
            setLoggedInUser(matchedUser);
            navigate('/gradebook');
        } else {
            alert('Invalid username or password');
        }
    };

    const handleRegister = async (newUser) => {
        try {
            const createdUser = await createUser(newUser);
            console.log('User created:', createdUser);
            // Handle any further actions after user creation
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const createUser = async (newUser) => {
        let roleId;
        if (newUser.role === "Teacher") {
            roleId = 1;
        } else if (newUser.role === "Student") {
            roleId = 2;
        } else {
            roleId = 3;
        }

        try {
            const response = await fetch('https://datagradebackend-f2ecd09dee7f.herokuapp.com/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: newUser.username,
                    name: newUser.fullName,
                    password: newUser.password,
                    email: newUser.email,
                    role: {
                        role: roleId
                    }
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create user');
            }
            const createdUser = await response.json();
            setIsModalOpen(false);
            return createdUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error; // Re-throw the error to be caught by the caller
        }
    };
    return (
        <div className="login-container">
        <div className={"login-page"}>
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
            <div class={"divider"}/>
            <button onClick={() => setIsModalOpen(true)}>Register</button>
        </div>
            <RegistrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRegister={handleRegister}
            />
        </div>
    );
};

export default LoginPage;
