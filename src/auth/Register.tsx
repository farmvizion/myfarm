import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png"; // Adjust the path if needed

const Register: React.FC<{ onToggle: () => void }> = ({ onToggle }) => {
  const backend_api_url = import.meta.env.VITE_APP_API_URL;
  //`${backend_api_url}/api/register`
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    role: "",
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          
          // Call your own backend instead
          const res = await axios.get(`${backend_api_url}/api/reverse-geocode?lat=${latitude}&lon=${longitude}`);

          //console.log('Location response:', res.data);

  
          const location = res.data.location;
          //console.log('Parsed location:', location);
          setFormData((prev) => ({ ...prev, location }));
        } catch (err) {
          console.warn("Location fetch failed", err);
        }
      });
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      //console.log(formData);
      await axios.post(`${backend_api_url}/api/register`, formData);
      alert("Registration successful!");
      navigate("/");
    } catch (err: any) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <div className="mb-6 text-center">
          <img src={Logo} alt="Logo" className="mx-auto h-16 w-16" />
          <h2 className="text-2xl font-bold mt-4">Farmer Registration</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            readOnly
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            required
          >
            <option value="">Select Role</option>
            <option value="farmer">Farmer</option>
            <option value="integrator">System Integrator</option>
            <option value="other">Other</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <button onClick={onToggle} className="text-blue-600 hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
