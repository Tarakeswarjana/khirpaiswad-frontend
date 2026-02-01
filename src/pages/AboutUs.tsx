const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Heritage is a leading provider of premium furniture and decor for modern living. Founded with a passion for quality and craftsmanship, we have been delivering exceptional products to our customers for years.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Our mission is to provide high-quality, stylish furniture and home decor that enhances the beauty and comfort of your living spaces.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We are committed to delivering excellence in every aspect of our business. From product selection to customer service, we strive to exceed expectations and create lasting relationships with our customers.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            <li>Premium quality products crafted with excellence</li>
                            <li>Wide selection of furniture and decor styles</li>
                            <li>Competitive pricing and regular promotions</li>
                            <li>Fast and reliable shipping</li>
                            <li>Excellent customer service and support</li>
                            <li>Easy returns and customer satisfaction guarantee</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Have questions? We'd love to hear from you! Visit our Contact page or reach out directly through our social media channels.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
