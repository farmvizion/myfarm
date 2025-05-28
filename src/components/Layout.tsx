import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext"; // Adjust the path

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear token/cookie/etc.
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <img
            src={Logo}
            alt="Farmvizion Logo"
            className="h-8 w-8 object-contain"
          />
          <div className="text-xl font-bold">Farmvizion</div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "underline" : "hover:underline"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/farmplan"
              className={({ isActive }) =>
                isActive ? "underline" : "hover:underline"
              }
            >
              My Farm
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "underline" : "hover:underline"
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/team"
              className={({ isActive }) =>
                isActive ? "underline" : "hover:underline"
              }
            >
              Team
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "underline" : "hover:underline"
              }
            >
              Contact
            </NavLink>
          </li>
          {isAuthenticated && userRole === "admin" && (
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? "underline" : "hover:underline"
                }
              >
                Admin
              </NavLink>
            </li>
          )}
          {isAuthenticated ? (
            <li>
              <button onClick={handleLogout} className="hover:underline">
                Sign Out
              </button>
            </li>
          ) : (
            <li>
              <NavLink to="/signin" className="hover:underline">
                Sign In
              </NavLink>
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <ul className="bg-green-600 text-white flex flex-col space-y-2 p-4 md:hidden">
          <li>
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "underline block" : "block hover:underline"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/farmplan"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "underline block" : "block hover:underline"
              }
            >
              My Farm
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "underline block" : "block hover:underline"
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/team"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "underline block" : "block hover:underline"
              }
            >
              Team
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "underline block" : "block hover:underline"
              }
            >
              Contact
            </NavLink>
          </li>
          {isAuthenticated && userRole === "admin" && (
            <li>
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "underline block" : "block hover:underline"
                }
              >
                Admin
              </NavLink>
            </li>
          )}
          {isAuthenticated ? (
            <li>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-left hover:underline"
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li>
              <NavLink
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:underline"
              >
                Sign In
              </NavLink>
            </li>
          )}
        </ul>
      )}

      {/* Page Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white p-4 text-center">
        © 2025 Farmvizion. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
