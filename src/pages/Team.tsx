import React from 'react'

interface TeamMember {
  name: string
  role: string
  bio: string
  image?: string
}

const teamMembers: TeamMember[] = [
  {
    name: 'Ravindra Vemuri',
    role: 'Founder & CEO',
    bio: 'Ravindra brings decades of experience in AI and IoT, driving the vision of smart, sustainable agriculture through technology.',
    image: '/images/ravindra.jpg', // Optional: use real image path or leave empty
  },
  {
    name: 'Team Member 2',
    role: 'Agricultural Scientist',
    bio: 'Expert in crop health and diagnostics, helping train AI models with agricultural precision.',
    image: '', // Optional
  },
  // Add more members as needed
]

const Team = () => {
  return (
    <div className="bg-white text-gray-800 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Meet the Team</h1>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition text-center"
            >
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 mx-auto rounded-full bg-green-200 mb-4 flex items-center justify-center text-xl font-bold text-green-800">
                  {member.name[0]}
                </div>
              )}
              <h2 className="text-xl font-semibold">{member.name}</h2>
              <p className="text-green-600 font-medium">{member.role}</p>
              <p className="text-gray-600 mt-2 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Team

