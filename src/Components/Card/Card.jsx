import React from 'react';
import { Link } from 'react-router-dom';
import { useFavourite } from '../Context/fav';
import { doc, setDoc } from "firebase/firestore";
import { auth, fireStore } from "../Firebase/Firebase";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Card = ({ items }) => {
  const { favourite, setFavourite } = useFavourite();

  const addToFavorites = async (product) => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Please log in to favorite products");

      const favRef = doc(fireStore, "users", user.uid, "favorites", product.productId);
      await setDoc(favRef, {
        ...product,
        addedAt: new Date(),
      });

      setFavourite((prev) => {
        const alreadyExists = prev.some(item => item.productId === product.productId);
        if (alreadyExists) return prev;
        return [...prev, product];
      });

      console.log("✅ Product added to favorites");
    } catch (error) {
      console.error("❌ Error adding to favorites:", error.message);
    }
  };

  return (
    <div className="px-4 sm:px-10 md:px-16 lg:px-24 min-h-screen">
      <h1 className="text-2xl font-semibold text-[#002f34] mb-6">Fresh Recommendations</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            {/* Favorite Icon */}
            <div
              onClick={() => addToFavorites(item)}
              className="absolute top-3 right-3 z-10 p-1 bg-white rounded-full shadow cursor-pointer hover:scale-105 transition-transform"
            >
              {favourite.some((fav) => fav.productId === item.productId) ? (
                <FavoriteIcon className="text-red-500" />
              ) : (
                <FavoriteBorderIcon className="text-gray-500" />
              )}
            </div>

            {/* Image */}
            <div className="h-40 flex justify-center items-center bg-gray-100 overflow-hidden">
              <img
                className="max-h-full max-w-full object-contain"
                src={item.imageUrl || 'https://via.placeholder.com/150'}
                alt={item.title}
              />
            </div>

            {/* Product Info */}
            <Link to="/details" state={{ item }} className="block p-4">
              <h2 className="text-lg font-bold text-[#002f34] mb-1">₹ {item.price}</h2>
              <p className="text-sm text-gray-600 mb-1">{item.category}</p>
              <p className="text-sm text-gray-800 truncate">{item.title}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
