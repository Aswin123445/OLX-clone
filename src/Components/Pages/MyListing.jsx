// pages/MyListings.jsx

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fireStore, auth } from '../Firebase/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const MyListings = () => {
  const [user] = useAuthState(auth);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user) return;

      try {
        const productsRef = collection(fireStore, 'products');
        const q = query(productsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const listings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMyListings(listings);
      } catch (err) {
        console.error("❌ Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [user]);

  if (!user) {
    return <div className="text-center p-10 text-xl">🔒 Please login to view your listings.</div>;
  }

  if (loading) {
    return <div className="text-center p-10 text-xl">⏳ Loading your listings...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="p-10 px-5 sm:px-15 md:px-30 lg:px-40 min-h-screen">
        <h1 className="text-2xl mb-6 text-[#002f34]">My Listings</h1>

        {myListings.length === 0 ? (
          <p>No listings found. Start selling something!</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {myListings.map(item => (
              <Link to="/details" state={{ item }} key={item.id}>
                <div className="relative w-full h-72 rounded-lg border border-gray-300 bg-gray-50 overflow-hidden cursor-pointer">
                  <div className="w-full flex justify-center p-2 overflow-hidden">
                    <img
                      className="h-36 object-contain"
                      src={item.imageUrl || 'https://via.placeholder.com/150'}
                      alt={item.title}
                    />
                  </div>
                  <div className="p-3">
                    <h1 className="font-bold text-xl text-[#002f34]">₹ {item.price}</h1>
                    <p className="text-sm pt-1">{item.category}</p>
                    <p className="pt-1">{item.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyListings;
