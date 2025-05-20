import React from 'react'
import { FaLinkedin } from 'react-icons/fa'
// import ContactImage from '../assets/Home.png' // optional

const Contact = () => {
  return (
    <div className="bg-white text-gray-800 px-4 py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>
        <p className="text-center text-lg text-gray-600 mb-12">
          Got questions or want to collaborate? Reach out to us at  <a href="mailto:developer@farmvizion.com" className="text-green-600 hover:underline" >
          developer@farmvizion.com </a>{' '}
        </p>
        <p className="text-center text-lg text-gray-600 mb-12">

              <a
                href="https://www.linkedin.com/company/farmvizion.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-2xl transition-transform hover:scale-110"
                aria-label="Farmvizion LinkedIn"
              >
                <FaLinkedin className="mr-2" />
                LinkedIn
              </a>
        </p>        

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Details */}
          <div className="space-y-8">
           
            <div>
              <p className="text-gray-700 leading-relaxed">
                     {/* Location Maps */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          <iframe
            title="Munich Office"
            src="https://www.google.com/maps?q=Munich,Germany&output=embed"
            className="w-full h-64 rounded-xl shadow"
            loading="lazy"
          ></iframe>
          <iframe
            title="Amsterdam Office"
            src="https://www.google.com/maps?q=Amsterdam,Netherlands&output=embed"
            className="w-full h-64 rounded-xl shadow"
            loading="lazy"
          ></iframe>
          <iframe
            title="Hyderabad Office"
            src="https://www.google.com/maps?q=Hyderabad,India&output=embed"
            className="w-full h-64 rounded-xl shadow"
            loading="lazy"
          ></iframe>
        </div>
              </p>
            </div>
           
          </div>

          {/* Google Form Embed */}
          <div className="w-full">
            <iframe
              src="https://forms.gle/b3STPM36jYKKF6vF6"
              width="100%"
              height="800"
              
              className="rounded-lg shadow-lg"
              title="Contact Form"
            >
              Loading…
            </iframe>
          </div>
      
        </div>
      </div>
    </div>
  )
}

export default Contact
