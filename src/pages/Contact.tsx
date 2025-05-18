import React from 'react'

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
                  hello@farmvizion.com
                </a>
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Address</h2>
              <p className="text-gray-700">
                Hyderabad, Telangana<br />
                India
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Follow Us</h2>
              <p className="text-gray-700">
                LinkedIn, Twitter (Add your links here if available)
              </p>
            </div>
          </div>

          {/* Contact Form (optional logic can be added later) */}
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                placeholder="Your message..."
                className="w-full mt-1 px-4 py-2 border rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
