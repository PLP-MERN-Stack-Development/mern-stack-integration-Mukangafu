export default function Contact() {
  return (
    <section id="contact" className="py-16 text-center px-6">
      <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Have a question or property to list? We’d love to hear from you.
      </p>
      <form className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
        />
        <textarea
          placeholder="Your Message"
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent h-32"
        />
        <button className="w-full py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition">
          Send Message
        </button>
      </form>
    </section>
  );
}
