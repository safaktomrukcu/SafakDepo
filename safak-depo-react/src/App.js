import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import ProductList from './pages/products/ProductList';
import CreateProduct from './pages/products/CreateProduct';
import UpdateProduct from './pages/products/UpdateProduct';
import Home from './pages/home';
import Navbar from './components/Navbar';
import ShipmentList from './pages/shipments/ShipmentList';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <Navbar />
      <main className="container mx-auto p-4 mt-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/urunler" element={<ProductList />} />
          <Route path="/urun-ekle" element={<CreateProduct />} />
          <Route path="/urun-duzenle/:id" element={<UpdateProduct />} />
          <Route path="/sevkiyatlar" element={<ShipmentList/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
