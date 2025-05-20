import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Logo from '../assets/logo.svg' // Adjust the path if needed

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <img src={Logo} alt="Farmvizion Logo" className="h-8 w-8 object-contain" />
            
          <div className="text-xl font-bold">Farmvizion</div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
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
        </ul>
      )}

      {/* Page Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white p-4 text-center">
        &copy; 2025 Farmvizion. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
