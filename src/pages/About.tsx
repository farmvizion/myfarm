import React from 'react'

const About = () => {
  return (
    <div className="bg-white text-gray-800 px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        <p className="text-lg text-center max-w-3xl mx-auto mb-12">
          At <span className="font-semibold text-green-600">Farmvizion</span>, we are redefining the way agriculture works. By integrating AI-driven image analysis and IoT-based sensing into farming practices, we empower farmers with real-time, data-backed decisions to increase yield, reduce loss, and promote sustainable farming.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-green-50 p-6 rounded-xl shadow">
            <h3 className="text-2xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-700">
              We aim to build intelligent agricultural systems that help farmers make precise and timely decisions using modern technologies like computer vision, edge computing, and sensor fusion.
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-xl shadow">
            <h3 className="text-2xl font-semibold mb-2">Our Vision</h3>
            <p className="text-gray-700">
              To enable every farmer—regardless of scale—to harness the power of AI and IoT for smarter, more resilient farming across the globe.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">What Sets Us Apart</h2>
          <ul className="text-gray-700 space-y-3 max-w-2xl mx-auto list-disc list-inside">
            <li>Real-time plant health diagnostics from handheld and remote cameras</li>
            <li>Edge computing integration with offline-first support</li>
            <li>Custom AI models fine-tuned for specific crops and regions</li>
            <li>Multi-sensor compatibility with soil, moisture, and climate inputs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default About
