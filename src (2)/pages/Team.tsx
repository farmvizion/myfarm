import VedImage from "../assets/ved.png";
import RajuImage from "../assets/raju.png";
import PDImage from "../assets/pd.png";
import SubratImage from "../assets/subrat.png";
import JoachimImage from "../assets/joachim.jpg";
import AndreaImage from "../assets/andrea.jpg";

import { FaLinkedin } from "react-icons/fa";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Joachim",
    role: "Co-Founder & Chief Agriculture Scientist",
    bio: "Driving the vision of smart, sustainable agriculture through technology.",
    image: JoachimImage,
    linkedin: "https://www.linkedin.com/company/farmvizion.com/",
  },
  {
    name: "Subrat ",
    role: "COO",
    bio: "Proven business leader with decades of experience in FMCG, Retail and Food industry",
    image: SubratImage,
    linkedin: "https://www.linkedin.com/in/subrat-das-41a06812/",
  },
  {
    name: "Andrea ",
    role: "Co-Founder & CHRO",
    bio: "Agri Entrepreneur with 10+ years of experience in leading sustainability projects",
    image: AndreaImage,
    linkedin: "https://www.linkedin.com/company/farmvizion.com/",
  },
  {
    name: "Priyabrata",
    role: "CTO",
    bio: "Chief Engineer. Ex GE, Cisco, Samsung and Amazon. He brings decades of experience in IoT and software engineering.",
    image: PDImage,
    linkedin: "https://www.linkedin.com/in/priyabratadas/",
  },
  {
    name: "Raju",
    role: "Head of product and project management",
    bio: "Brings 15+ yeas of experience in program management and delivery",
    image: RajuImage,
    linkedin: "https://www.linkedin.com/company/farmvizion.com/",
  },
  {
    name: "Ved",
    role: "Co Founder and AI Engineer",
    bio: "Building AI models with agricultural precision.",
    image: VedImage,
    linkedin: "https://www.linkedin.com/in/ved-das-2b6703236/",
  },
];

const Team = () => {
  return (
    <div className="bg-white text-gray-800 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Team </h1>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => {
            const CardContent = (
              <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition text-center hover:bg-green-50">
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
            );

            return member.linkedin ? (
              <a
                key={index}
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                aria-label={`LinkedIn profile of ${member.name}`}
              >
                {CardContent}
              </a>
            ) : (
              <div key={index}>{CardContent}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Team;
