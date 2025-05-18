import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-16 border-t">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-xl font-bold text-green-600">Farmvizion</h2>
          <p className="mt-2 text-sm">
            Empowering agriculture with AI and IoT. Precision farming for a sustainable tomorrow.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-green-600">Home</Link></li>
            <li><Link to="/about" className="hover:text-green-600">About</Link></li>
            <li><Link to="/team" className="hover:text-green-600">Team</Link></li>
            <li><Link to="/contact" className="hover:text-green-600">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p className="text-sm">Hyderabad, Telangana, India</p>
          <p className="text-sm mt-1">
            Email: <a href="mailto:hello@farmvizion.com" className="text-green-600 hover:underline">hello@farmvizion.com</a>
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 py-4 border-t">
        © {new Date().getFullYear()} Farmvizion. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
