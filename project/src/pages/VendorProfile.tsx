import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Vendor, Item } from '../types';
import { Store, MapPin, Phone, Clock, Share2, ShoppingBag } from 'lucide-react';

const VendorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!id) return;
      
      try {
        const vendorDoc = await getDoc(doc(db, 'vendors', id));
        
        if (vendorDoc.exists()) {
          const vendorData = vendorDoc.data() as Vendor;
          setVendor({ ...vendorData, id: vendorDoc.id });
          
          // Fetch items
          const itemsRef = collection(db, 'vendors', id, 'items');
          const itemsSnapshot = await getDocs(itemsRef);
          const itemsList: Item[] = [];
          
          itemsSnapshot.forEach(doc => {
            itemsList.push({ id: doc.id, ...doc.data() } as Item);
          });
          
          setItems(itemsList);
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendorData();
  }, [id]);

  const handleShareVendor = () => {
    if (navigator.share) {
      navigator.share({
        title: vendor?.shopName,
        text: `Check out ${vendor?.shopName} on Smart Bazaar!`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.error('Could not copy text: ', error));
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Vendor Not Found</h2>
        <p className="mb-6">The vendor you're looking for doesn't exist or has been removed.</p>
        <Link to="/map" className="text-emerald-600 hover:text-emerald-800">
          Back to Map
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-emerald-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Store className="h-8 w-8" />
              <h1 className="text-2xl font-bold">{vendor.shopName}</h1>
            </div>
            <button 
              onClick={handleShareVendor}
              className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium flex items-center"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 p-2 rounded-full mr-3">
                  <ShoppingBag className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium text-sm">Category</h3>
                  <p className="text-lg">{vendor.category}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 p-2 rounded-full mr-3">
                  <Phone className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium text-sm">Contact</h3>
                  <a href={`tel:${vendor.contact}`} className="text-lg text-emerald-600 hover:underline">
                    {vendor.contact}
                  </a>
                </div>
              </div>
              
              {vendor.openingTime && vendor.closingTime && (
                <div className="flex items-center mb-4">
                  <div className="bg-emerald-100 p-2 rounded-full mr-3">
                    <Clock className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 font-medium text-sm">Business Hours</h3>
                    <p className="text-lg">{vendor.openingTime} - {vendor.closingTime}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-start mb-4">
                <div className="bg-emerald-100 p-2 rounded-full mr-3 mt-1">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium text-sm">Location</h3>
                  <p className="text-lg mb-2">Lat: {vendor.lat.toFixed(6)}, Lng: {vendor.lng.toFixed(6)}</p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${vendor.lat},${vendor.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 text-sm font-medium hover:text-emerald-800 inline-flex items-center"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {vendor.description && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">About</h3>
              <p className="text-gray-700">{vendor.description}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Products & Services</h3>
            
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map(item => (
                  <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-lg">{item.name}</h4>
                      <span className="font-bold text-emerald-600">₹{item.price.toFixed(2)}</span>
                    </div>
                    {item.description && (
                      <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No products or services listed yet.</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 flex justify-between">
            <Link to="/map" className="text-emerald-600 hover:text-emerald-800">
              Back to Map
            </Link>
            <a 
              href={`https://wa.me/${vendor.contact.replace(/[^0-9]/g, '')}?text=Hi, I found your shop on Smart Bazaar!`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              Contact via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;