import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Vendor } from '../types';
import { Link } from 'react-router-dom';
import { MapPin, Store, Phone } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '70vh'
};

const defaultCenter = {
  lat: 28.6139, // Default to Delhi, India
  lng: 77.2090
};

const CustomerMap: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY' // Replace with your API key
  });

  const fetchVendors = useCallback(async () => {
    try {
      const vendorsRef = collection(db, 'vendors');
      const snapshot = await getDocs(vendorsRef);
      const vendorsList: Vendor[] = [];
      
      snapshot.forEach(doc => {
        vendorsList.push({ id: doc.id, ...doc.data() } as Vendor);
      });
      
      setVendors(vendorsList);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
    
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [fetchVendors]);

  const onMarkerClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const onMapClick = () => {
    setSelectedVendor(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-emerald-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <MapPin className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Find Local Vendors</h1>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600">
              Discover local vendors in your area. Click on a marker to see vendor details.
            </p>
          </div>
          
          {isLoaded ? (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
                onClick={onMapClick}
              >
                {/* User location marker */}
                <Marker
                  position={center}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                  }}
                />
                
                {/* Vendor markers */}
                {vendors.map(vendor => (
                  <Marker
                    key={vendor.id}
                    position={{ lat: vendor.lat, lng: vendor.lng }}
                    onClick={() => onMarkerClick(vendor)}
                  />
                ))}
                
                {selectedVendor && (
                  <InfoWindow
                    position={{ lat: selectedVendor.lat, lng: selectedVendor.lng }}
                    onCloseClick={() => setSelectedVendor(null)}
                  >
                    <div className="p-2 max-w-xs">
                      <h3 className="font-bold text-lg">{selectedVendor.shopName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{selectedVendor.category}</p>
                      {selectedVendor.description && (
                        <p className="text-sm mb-2">{selectedVendor.description}</p>
                      )}
                      {selectedVendor.openingTime && selectedVendor.closingTime && (
                        <p className="text-sm mb-2">
                          <span className="font-medium">Hours: </span>
                          {selectedVendor.openingTime} - {selectedVendor.closingTime}
                        </p>
                      )}
                      <div className="flex justify-between mt-3">
                        <Link 
                          to={`/vendor/${selectedVendor.id}`}
                          className="text-emerald-600 text-sm font-medium hover:text-emerald-800"
                        >
                          View Details
                        </Link>
                        <a 
                          href={`tel:${selectedVendor.contact}`}
                          className="text-emerald-600 text-sm font-medium hover:text-emerald-800"
                        >
                          Call Vendor
                        </a>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
              <p>Loading map...</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Vendors</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <p>Loading vendors...</p>
            </div>
          ) : vendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map(vendor => (
                <div key={vendor.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-emerald-50 p-4 border-b">
                    <h3 className="font-bold text-lg">{vendor.shopName}</h3>
                    <p className="text-sm text-gray-600">{vendor.category}</p>
                  </div>
                  <div className="p-4">
                    {vendor.description && (
                      <p className="text-sm mb-3 text-gray-700">{vendor.description}</p>
                    )}
                    
                    {vendor.openingTime && vendor.closingTime && (
                      <div className="flex items-center text-sm mb-2">
                        <span className="font-medium mr-2">Hours:</span>
                        <span>{vendor.openingTime} - {vendor.closingTime}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm mb-3">
                      <Phone className="h-4 w-4 mr-2 text-emerald-600" />
                      <a href={`tel:${vendor.contact}`} className="text-emerald-600 hover:underline">
                        {vendor.contact}
                      </a>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <Link 
                        to={`/vendor/${vendor.id}`}
                        className="text-emerald-600 text-sm font-medium hover:text-emerald-800 flex items-center"
                      >
                        <Store className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${vendor.lat},${vendor.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 text-sm font-medium hover:text-emerald-800 flex items-center"
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Directions
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No vendors found in your area.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerMap;