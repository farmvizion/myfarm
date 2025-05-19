import React from 'react'
import { FaLinkedin } from 'react-icons/fa'

const Contact = () => {
  return (
    <div className="bg-white text-gray-800 px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <p className="text-center text-lg text-gray-600 mb-12">
          Got questions or want to collaborate? Reach out to us!
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Email</h2>
              <p className="text-gray-700">
                <a
                  href="mailto:hello@farmvizion.com"
                  className="text-green-600 hover:underline"
                >
                  developer@farmvizion.com
                </a>
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Address</h2>
              <p className="text-gray-700">
                Munich, Bavaria<br />
                Germany
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Follow Us</h2>
              <a
                href="https://www.linkedin.com/company/farmvizion.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 hover:text-blue-800 text-3xl mt-2"
                aria-label="Farmvizion LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Removed contact form */}
          <div className="flex items-center justify-center text-gray-500 italic">
            You can also connect with us directly on LinkedIn.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
