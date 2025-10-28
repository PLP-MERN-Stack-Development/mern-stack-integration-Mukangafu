// src/pages/About.jsx
export default function About() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-6 text-center rounded-b-3xl shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About Us</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          At Blogs by Dannie, we are passionate about delivering inspiring, informative, and engaging content across technology, lifestyle, travel, and more.
        </p>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Our mission is to empower our readers with high-quality content that informs, entertains, and inspires. We aim to explore topics that spark curiosity and encourage personal growth.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Our Vision</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          We envision a community of engaged readers who trust Blogs by Dannie as a reliable source for insights, ideas, and tips on trending topics. Our vision is to expand our reach while maintaining authenticity and quality.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Our Values</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
          <li>Integrity: Providing accurate and trustworthy content.</li>
          <li>Creativity: Sharing fresh perspectives and unique ideas.</li>
          <li>Community: Building a space where readers can connect and grow.</li>
          <li>Passion: Writing about topics we truly care about.</li>
        </ul>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-6">
          Thank you for visiting Blogs by Dannie. We hope you enjoy reading our posts as much as we enjoy creating them!
        </p>
      </section>
    </div>
  );
}
