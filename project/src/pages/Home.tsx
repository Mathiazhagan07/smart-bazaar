import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Map, ShoppingBag, CreditCard, MessageSquare } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-8 md:p-12 mb-12 text-white shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Empowering Local Vendors</h1>
        <p className="text-xl mb-8">Connect with customers, manage your business, and grow your local shop with Smart Bazaar.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/register" className="bg-white text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg font-medium text-center">
            Register as Vendor
          </Link>
          <Link to="/map" className="bg-emerald-700 hover:bg-emerald-800 px-6 py-3 rounded-lg font-medium text-center">
            Find Local Vendors
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How Smart Bazaar Helps</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-emerald-100 p-3 rounded-full w-fit mb-4">
              <Store className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Digital Presence</h3>
            <p className="text-gray-600">Get your shop listed online with all your products and services for customers to discover.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-emerald-100 p-3 rounded-full w-fit mb-4">
              <Map className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Location Visibility</h3>
            <p className="text-gray-600">Mark your shop on Google Maps so customers can easily find your location.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-emerald-100 p-3 rounded-full w-fit mb-4">
              <ShoppingBag className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Inventory Management</h3>
            <p className="text-gray-600">Keep track of your products, prices, and availability all in one place.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-emerald-100 p-3 rounded-full w-fit mb-4">
              <CreditCard className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Digital Payments</h3>
            <p className="text-gray-600">Accept digital payments through various payment methods.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-emerald-100 p-3 rounded-full w-fit mb-4">
              <MessageSquare className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer Communication</h3>
            <p className="text-gray-600">Connect with your customers through WhatsApp or SMS directly from the app.</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-emerald-700">For Vendors</h3>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="bg-emerald-600 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">1</span>
                <span>Register your account and create your shop profile</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-emerald-600 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">2</span>
                <span>Add your shop location, business hours, and contact details</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-emerald-600 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">3</span>
                <span>List your products or services with prices</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-emerald-600 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">4</span>
                <span>Share your shop link with customers via WhatsApp or SMS</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-emerald-600 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">5</span>
                <span>Manage orders and track your business growth</span>
              </li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-emerald-700">For Customers</h3>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="bg-emerald-600 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">1</span>
                <span>Open the Smart Bazaar app or website</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-emerald-600 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">2</span>
                <span>Browse the map to find vendors near your location</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-emerald-600 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">3</span>
                <span>View vendor details, products, and services</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-emerald-600 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">4</span>
                <span>Contact vendors directly through WhatsApp or call</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-emerald-600 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">5</span>
                <span>Visit the shop or place orders digitally</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;