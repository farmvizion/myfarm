import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/fvtrans.png";
import NatureBg from "../assets/nature.jpg";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import CountryCodeSelect from "../components/CountryCodeSelect";
import AlertBox from "../components/AlertBox";

// Define interface for form data
interface FormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
  confirmPassword: string;
}

// Define interface for API payload
interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const Register: React.FC<{ onToggle: () => void }> = ({ onToggle }) => {
  const { t } = useTranslation();
  const { login } = useAuth();

  const backend_api_url = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    countryCode: "+49", // Default to India
    password: "",
    confirmPassword: "",
  });


  const handleCodeChange = (code: string) => {
    setFormData((prev) => ({ ...prev, countryCode: code }));
  };

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
    const payload: RegisterPayload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    // Append mobile to payload if mobile is provided
    if (formData.phone) {
      payload.phone = `${formData.countryCode}${formData.phone}`;
    } else {
      payload.phone = formData.email;
    }

    await axios.post(`${backend_api_url}/api/register`, payload);

    const loginResponse = await axios.post(`${backend_api_url}/api/login`, {
      email: formData.email,
      password: formData.password,
    });

    if (loginResponse.data.token) {
      const { token, role, user } = loginResponse.data;
      login(token, role, user); // updated tpdmunich9872@gmail.como pass the full user object
      setSuccessMessage("🎉 Registration Successful!");
       // Wait 2 seconds before navigating to allow alert to be seen
      setTimeout(() => {
        navigate("/farmplan"); // or wherever you want to go
      }, 2000);

    }
  } catch (err: any) {
    console.error("Registration failed:", err.response?.data || err.message);

    if (
      err.response?.data?.errno === 19 &&
      err.response?.data?.code === "SQLITE_CONSTRAINT" &&
      err.response?.data?.message.includes("users.phone")
    ) {
      alert(
        "This phone number is already registered. Please enter a different number or generate a new one."
      );
      setFormData({ ...formData, phone: "" });
    } 


  }

};


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${NatureBg})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-md w-full bg-white/90 p-8 shadow-2xl rounded-xl backdrop-blur-md">
        <div className="mb-6 text-center">
          <img src={Logo} alt="Logo" className="mx-auto h-16 w-16" />
          <h2 className="text-2xl font-bold mt-4 text-green-700">
            Farmer Registration
          </h2>
        </div>
        {successMessage && (
          <div className="relative z-10 max-w-md w-full mb-4">
            <AlertBox message={successMessage} onClose={() => setSuccessMessage("")} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <div className="flex flex-col space-y-4">
                <CountryCodeSelect
                  onChange={handleCodeChange}
                  selectedValue={formData.countryCode}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Register
          </button>

          <p className="text-sm text-gray-700">
            {t("registerAgreement")}{" "}
            <Link
              to="/terms"
              className="text-green-700 underline hover:text-green-900"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-green-700 underline hover:text-green-900"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </form>

        <p className="text-center text-sm text-gray-700 mt-4">
          Already have an account?{" "}
          <button
            onClick={onToggle}
            className="text-green-700 hover:underline font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
export default Register;

