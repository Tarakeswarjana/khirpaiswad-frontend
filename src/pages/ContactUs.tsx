import { Mail, Phone, MapPin } from 'lucide-react';

const ContactUs = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* Contact Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h2>

                            <div className="flex items-start gap-4 mb-6">
                                <Mail className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-800">Email</h3>
                                    <p className="text-gray-600">info@heritage.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 mb-6">
                                <Phone className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-800">Phone</h3>
                                    <p className="text-gray-600">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-800">Address</h3>
                                    <p className="text-gray-600">123 Furniture Street<br />Heritage City, HC 12345</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input type="text" required placeholder="Your full name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" required placeholder="your.email@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea rows={4} required placeholder="Your message here..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
                                </div>
                                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
