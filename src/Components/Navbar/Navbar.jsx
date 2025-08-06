import './Navbar.css';
import logo from '../../assets/symbol.png';
import search from '../../assets/search1.svg';
import arrow from '../../assets/arrow-down.svg';
import searchWt from '../../assets/search.svg';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, fireStore } from '../Firebase/Firebase';
import { signOut } from 'firebase/auth';
import addBtn from '../../assets/addButton.png';
import { ItemsContext } from '../Context/Item';
import { collection, getDocs } from "firebase/firestore";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';

const Navbar = (props) => {
  const { items, setItems } = ItemsContext();
  const [user] = useAuthState(auth);
  const { toggleModal, toggleModalSell } = props;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("✅ Logged out");
    } catch (err) {
      console.error("❌ Logout error:", err.message);
    }
  };

  const setAllProducts = async () => {
    try {
      const productsCollection = collection(fireStore, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productsList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(productsList);
    } catch (error) {
      console.log(error, 'error fetching products');
    }
  };

  const filterCars = () => {
    setItems(prev => prev.filter(value => value.category === 'cars'));
  };

  const filterMotorCycle = () => {
    setItems(prev => prev.filter(value => value.category === 'motorcycles'));
  };

  const filtermobile = () => {
    setItems(prev => prev.filter(value => value.category === 'mobile phones'));
  };

  return (
    <div>
      <nav className="fixed z-50 w-full overflow-auto p-2 pl-3 pr-3 shadow-md bg-slate-100 border-b-4 border-solid border-b-white">
        <img src={logo} alt="logo" className='w-12' />

        {/* Location Search */}
        <div className='relative location-search ml-5'>
          <img src={search} alt="" className='absolute top-4 left-2 w-5' />
          <input
            placeholder='Search city, area, or locality...'
            className='w-[50px] sm:w-[150px] md:w-[250px] lg:w-[270px] p-3 pl-8 pr-8 border-black border-solid border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300'
            type="text"
          />
          <img src={arrow} alt="" className='absolute top-4 right-3 w-5 cursor-pointer' />
        </div>

        {/* Main Search */}
        <div className="ml-5 mr-2 relative w-full main-search">
          <input
            placeholder='Find Cars, Mobile Phones, and More...'
            className='w-full p-3 border-black border-solid border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300'
            type="text"
          />
          <div style={{ backgroundColor: '#002f34' }} className="flex justify-center items-center absolute top-0 right-0 h-full rounded-e-md w-12">
            <img className="w-5 filter invert" src={searchWt} alt="Search Icon" />
          </div>
        </div>

        {/* Favourites */}
        <Link to="/favorites" className="text-gray-700 hover:underline">
          <div className='flex font-bold cursor-pointer text-xl'>
            Favourite <FavoriteIcon className="text-red-500 text-xl ml-1" />
          </div>
        </Link>
<Link to="/my-listings" className="text-gray-700 hover:underline">
  <p className='font-bold ml-4 cursor-pointer'>Selling</p>
</Link>



        {/* Auth Buttons */}
        {!user ? (
          <p
            onClick={toggleModal}
            className='font-bold underline ml-5 cursor-pointer'
            style={{ color: '#002f34' }}
          >
            Login
          </p>
        ) : (
          <button
            onClick={handleLogout}
            className='font-bold ml-5 cursor-pointer text-red-600 underline hover:text-red-800 transition'
          >
            Logout
          </button>
        )}

        {/* Add Button */}
        <img
          src={addBtn}
          onClick={user ? toggleModalSell : toggleModal}
          className='w-24 mx-1 sm:ml-5 sm:mr-5 shadow-xl rounded-full cursor-pointer'
          alt="Add"
        />
      </nav>

      {/* Category List */}
      <div className='w-full relative z-0 flex shadow-md p-2 pt-20 pl-10 pr-10 sm:pl-44 md:pr-44 sub-lists'>
        <ul className='list-none flex items-center justify-between w-full'>
          <li className='flex items-center flex-shrink-0'>
            <p onClick={setAllProducts} className='font-semibold uppercase cursor-pointer all-cats'>
              All categories
            </p>
            <img className='w-4 ml-2' src={arrow} alt="" />
          </li>
          <li onClick={filterCars}>Cars</li>
          <li onClick={filterMotorCycle}>Motorcycles</li>
          <li onClick={filtermobile}>Mobile Phones</li>
          <li>For sale : Houses & Apartments</li>
          <li>Scooter</li>
          <li>Commercial & Other Vehicles</li>
          <li>For rent : Houses & Apartments</li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
