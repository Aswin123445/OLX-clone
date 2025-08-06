import React from 'react';
import { useFavourite } from '../Context/fav';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { doc, deleteDoc } from "firebase/firestore";
import { fireStore, auth } from "../Firebase/Firebase"; 
export const FavoritePage = () => {
  const { favourite, setFavourite } = useFavourite();

const removeFromFavourites = async (productId) => {
  const user = auth.currentUser;
  if (!user) return alert("Please log in to remove favorites");

  try {
    const favRef = doc(fireStore, "users", user.uid, "favorites", productId);
    await deleteDoc(favRef); // 🔥 Deletes from Firestore

    // 🔁 Update local state
    setFavourite((prev) => prev.filter(item => item.productId !== productId));

    console.log("✅ Product removed from favorites");
  } catch (error) {
    console.error("❌ Error removing from favorites:", error.message);
  }
};


  if (favourite.length === 0) {
    return (
      <>
      <Navbar />
      <div className="text-center py-20">
        <h1 className="text-2xl">No favorites yet ❤️</h1>
        <Link to="/" className="text-blue-500 underline">Browse products</Link>
      </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-10 px-5 sm:px-15 md:px-30 lg:px-40 min-h-screen">
        <h1 className="text-2xl mb-6" style={{ color: '#002f34' }}>
          My Favorites
        </h1>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {favourite.map((item) => (
            <div key={item.productId} className="relative w-full h-72 rounded-lg border border-gray-300 bg-gray-50 overflow-hidden cursor-pointer">
              
              {/* Delete Icon */}
              <div 
                onClick={() => removeFromFavourites(item.productId)}
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-100 transition"
              >
                <DeleteOutlineIcon className="text-red-500 cursor-pointer" />
              </div>

              <Link to="/details" state={{ item }} className="block h-full">
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
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
