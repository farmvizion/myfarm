import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo at top */}
      <header className="bg-green-700 py-6 flex justify-center items-center">
        <img src={Logo} alt="Farmvizion Logo" className="h-20 w-20 object-contain" />
      </header>

      {/* Navbar below logo */}
      <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
        {/* Title */}
        <div className="text-xl font-bold select-none">Farmvizion</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center text-sm md:text-base">
          <NavItem to="/" label="Home" />
          <NavItem to="/farmplan" label="My Farm" />
          <NavItem to="/about" label="About" />
          <NavItem to="/team" label="Team" />
          <NavItem to="/contact" label="Contact" />
          {isAuthenticated && userRole === "admin" && <NavItem to="/admin" label="Admin" />}
          {isAuthenticated ? (
            <li>
              <button
                onClick={handleLogout}
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
              >
                Sign Out
              </button>
            </li>
          ) : (
            <>
              <NavItem to="/signin" label="Sign In" />
              <NavItem to="/register" label="Register" />
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-2xl focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <ul className="bg-green-500 text-white flex flex-col space-y-2 p-4 md:hidden text-base">
          <MobileNavItem to="/" label="Home" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavItem to="/farmplan" label="My Farm" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavItem to="/about" label="About" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavItem to="/team" label="Team" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavItem to="/contact" label="Contact" onClick={() => setMobileMenuOpen(false)} />
          {isAuthenticated && userRole === "admin" && (
            <MobileNavItem to="/admin" label="Admin" onClick={() => setMobileMenuOpen(false)} />
          )}
          {isAuthenticated ? (
            <li>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-left hover:underline w-full focus:outline-none focus:ring-2 focus:ring-white rounded"
              >
                Sign Out
              </button>
            </li>
          ) : (
            <>
              <MobileNavItem to="/signin" label="Sign In" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavItem to="/register" label="Register" onClick={() => setMobileMenuOpen(false)} />
            </>
          )}
        </ul>
      )}

      {/* Page Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white p-4 text-center text-sm md:text-base select-none">
        © 2025 Farmvizion. All rights reserved.
      </footer>
    </div>
  );
};

const NavItem = ({ to, label }: { to: string; label: string }) => (
  <li>
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        isActive
          ? "underline"
          : "hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
      }
    >
      {label}
    </NavLink>
  </li>
);

const MobileNavItem = ({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick: () => void;
}) => (
  <li>
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        isActive ? "underline block" : "block hover:underline"
      }
    >
      {label}
    </NavLink>
  </li>
);

export default Layout;
