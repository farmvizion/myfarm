import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../assets/logo.svg' // Adjust the path if needed

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Team', path: '/team' },
    { label: 'Contact', path: '/contact' },
  ]

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Farmvizion Logo" className="w-auto" />
          <span className="text-2xl font-bold text-green-600">Farmvizion</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-gray-700 hover:text-green-600 font-medium ${
                location.pathname === item.path ? 'underline font-semibold' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block py-2 text-gray-700 hover:text-green-600 font-medium ${
                location.pathname === item.path ? 'underline font-semibold' : ''
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar
