import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Vendor, Item } from '../types';
import { Store, Plus, Trash2, Edit } from 'lucide-react';

const VendorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  
  // For items
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!currentUser) return;
      
      try {
        const vendorsRef = collection(db, 'vendors');
        const q = query(vendorsRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const vendorDoc = querySnapshot.docs[0];
          const vendorData = vendorDoc.data() as Vendor;
          setVendor({ ...vendorData, id: vendorDoc.id });
          
          // Set form values
          setShopName(vendorData.shopName || '');
          setCategory(vendorData.category || '');
          setContact(vendorData.contact || '');
          setDescription(vendorData.description || '');
          setOpeningTime(vendorData.openingTime || '');
          setClosingTime(vendorData.closingTime || '');
          setLat(vendorData.lat || 0);
          setLng(vendorData.lng || 0);
          
          // Fetch items
          const itemsRef = collection(db, 'vendors', vendorDoc.id, 'items');
          const itemsSnapshot = await getDocs(itemsRef);
          const itemsList: Item[] = [];
          
          itemsSnapshot.forEach(doc => {
            itemsList.push({ id: doc.id, ...doc.data() } as Item);
          });
          
          setItems(itemsList);
        } else {
          // New vendor, get location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
              },
              (error) => {
                console.error('Error getting location:', error);
                // Default to a location if geolocation fails
                setLat(28.6139);  // Default to Delhi, India
                setLng(77.2090);
              }
            );
          }
          setIsEditing(true);
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendorData();
  }, [currentUser]);

  const handleSaveVendor = async () => {
    if (!currentUser) return;
    
    const vendorData: Vendor = {
      userId: currentUser.uid,
      shopName,
      category,
      contact,
      description,
      openingTime,
      closingTime,
      lat,
      lng
    };
    
    try {
      if (vendor?.id) {
        // Update existing vendor
        await setDoc(doc(db, 'vendors', vendor.id), vendorData, { merge: true });
        setVendor({ ...vendor, ...vendorData });
      } else {
        // Create new vendor
        const docRef = await addDoc(collection(db, 'vendors'), vendorData);
        setVendor({ ...vendorData, id: docRef.id });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving vendor data:', error);
    }
  };

  const handleAddItem = async () => {
    if (!vendor?.id || !newItemName || !newItemPrice) return;
    
    const itemData: Item = {
      name: newItemName,
      price: parseFloat(newItemPrice),
      description: newItemDescription,
      available: true
    };
    
    try {
      const docRef = await addDoc(collection(db, 'vendors', vendor.id, 'items'), itemData);
      setItems([...items, { ...itemData, id: docRef.id }]);
      
      // Reset form
      setNewItemName('');
      setNewItemPrice('');
      setNewItemDescription('');
      setIsAddingItem(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!vendor?.id || !itemId) return;
    
    try {
      await deleteDoc(doc(db, 'vendors', vendor.id, 'items', itemId));
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-emerald-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Store className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
            </div>
            {!isEditing && vendor && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSaveVendor(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Food">Food</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Services">Services</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Shop Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows={3}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : vendor ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-gray-500 font-medium">Shop Name</h3>
                  <p className="text-lg">{vendor.shopName}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-500 font-medium">Category</h3>
                  <p className="text-lg">{vendor.category}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-500 font-medium">Contact</h3>
                  <p className="text-lg">{vendor.contact}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-500 font-medium">Business Hours</h3>
                  <p className="text-lg">
                    {vendor.openingTime && vendor.closingTime 
                      ? `${vendor.openingTime} - ${vendor.closingTime}`
                      : 'Not specified'}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-gray-500 font-medium">Description</h3>
                  <p className="text-lg">{vendor.description || 'No description provided'}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-500 font-medium">Location</h3>
                  <p className="text-lg">Lat: {vendor.lat.toFixed(6)}, Lng: {vendor.lng.toFixed(6)}</p>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Products & Services</h3>
                  <button
                    onClick={() => setIsAddingItem(true)}
                    className="bg-emerald-600 text-white px-3 py-1 rounded-lg flex items-center text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </button>
                </div>
                
                {isAddingItem && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-3">Add New Item</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Item Name
                        </label>
                        <input
                          type="text"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Description
                        </label>
                        <textarea
                          value={newItemDescription}
                          onChange={(e) => setNewItemDescription(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          rows={2}
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsAddingItem(false)}
                        className="px-3 py-1 border border-gray-300 rounded-lg mr-2 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Add Item
                      </button>
                    </div>
                  </div>
                )}
                
                {items.length > 0 ? (
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">₹{item.price.toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">{item.description || '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDeleteItem(item.id!)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No items added yet. Add your first product or service.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Please create your vendor profile to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;