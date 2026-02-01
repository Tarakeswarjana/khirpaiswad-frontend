const ShippingPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Shipping Policy</h1>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Information</h2>
                        <p className="text-gray-600 leading-relaxed">
                            At Heritage, we are committed to delivering your orders quickly and safely. We work with trusted shipping partners to ensure your furniture and decor arrives in perfect condition.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Rates</h2>
                        <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                            <p className="text-gray-700"><strong>Standard Shipping:</strong> 5-7 business days</p>
                            <p className="text-gray-600 text-sm">Free for orders over $100</p>
                            <p className="text-gray-600 text-sm">$9.99 for orders under $100</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 space-y-2 mt-4">
                            <p className="text-gray-700"><strong>Express Shipping:</strong> 2-3 business days</p>
                            <p className="text-gray-600 text-sm">$19.99 for all orders</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Handling & Processing</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            All orders are carefully packaged to ensure safe delivery. Fragile items are wrapped with protective materials. Processing times are typically 1-2 business days after order confirmation.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Delivery Areas</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            We currently ship to all 50 states and select international locations. Delivery times may vary based on your location and the selected shipping method.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tracking Your Order</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Once your order ships, you will receive a tracking number via email. You can use this number to track your package in real-time on our website or the carrier's website.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Damaged or Lost Shipments</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            If your order arrives damaged or is lost in transit, please contact our customer service team immediately. We will work with the shipping carrier to resolve the issue and ensure you receive a replacement or refund.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Questions?</h2>
                        <p className="text-gray-600 leading-relaxed">
                            For any questions about shipping, please visit our Contact page or reach out to our customer service team at info@heritage.com or +1 (555) 123-4567.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
