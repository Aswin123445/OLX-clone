// context/FavouriteContext.jsx
import { collection, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { fireStore, auth } from "../Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
export const FavouriteContext = createContext(null);
export const useFavourite = () => useContext(FavouriteContext);

export const FavouriteProvider = ({ children }) => {
  const [favourite, setFavourite] = useState([]);

  const user = auth.currentUser;
  const userId = user?.uid;

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    try {
      const favouriteCollection = collection(fireStore, "users", user.uid, "favorites");
      const favouriteSnapshot = await getDocs(favouriteCollection);
      const favouriteList = favouriteSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavourite(favouriteList);
    } catch (error) {
      console.log("❌ Error fetching favourites:", error);
    }
  });

  return () => unsubscribe(); // Cleanup on unmount
}, []);

  return (
    <FavouriteContext.Provider value={{ favourite, setFavourite }}>
      {children}
    </FavouriteContext.Provider>
  );
};
