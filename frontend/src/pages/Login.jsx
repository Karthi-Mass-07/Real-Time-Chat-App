import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ phone: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5050/api/user/login", formData);
      console.log(response.data);
      const userId = response.data.userId;
      localStorage.setItem('userId', userId);
      onLogin(userId);
      toast.success("Login Successful!");
      setFormData({ phone: "" });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Register Failed..!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-violet-600">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              placeholder="Enter Your Phone"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Login
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-violet-500 hover:underline">
              Register here!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
