import { Route, Routes } from 'react-router-dom'
import Home from './Components/Pages/Home'
import Details from './Components/Details/Details'
import { FavoritePage } from './Components/Pages/Favourite'
import MyListings from './Components/Pages/MyListing'
const App = () => {
  return (
   <>
   <Routes>
    <Route  path='/' element={<Home/>}/>
    <Route  path='/details' element={<Details/>}/>
    <Route path='/favorites' element = {<FavoritePage/>}/>
    <Route path="/my-listings" element={<MyListings />} />
   </Routes>
   </>
  )
}

export default App
