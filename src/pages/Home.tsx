import { Link } from 'react-router-dom';
import BackgroundImage from '../assets/iot.png'

const Home = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section with background image */}
      <section
        className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-green-100 to-white px-4 py-16 text-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${BackgroundImage})` }}      >
        {/* Optional: overlay to darken the background for better text readability */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Content container to position above overlay */}
        <div className="relative z-10 max-w-3xl">
       
          <p className="text-lg md:text-xl mb-6 text-white">
            Farmvizion leverages AI and IoT to transform farms into intelligent ecosystems—monitor, diagnose, and act in real time.
          </p>
          <a
            href="#contact"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Farmvizion?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'AI Crop Diagnostics',
                desc: 'Identify plant diseases, pests, and health issues using AI-powered analysis of images and data.',
              },
              {
                title: 'IoT Sensor Integration',
                desc: 'Monitor soil, climate, and crop conditions in real-time with intelligent sensor networks.',
              },
              {
                title: 'Actionable Insights',
                desc: 'Receive alerts and treatment suggestions tailored to each crop and region.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

   {/* Contact CTA */}
    <section
      id="contact"
      className="bg-green-600 text-white py-16 px-4 text-center"
    >
      <h2 className="text-3xl font-bold mb-4">Ready to revolutionize your farm?</h2>
      <p className="mb-6">Connect with us and bring intelligence to your fields.</p>
      <Link
        to="/contact"
        className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
      >
        Contact Us
      </Link>
    </section>
    </div>
  )
}

export default Home;
