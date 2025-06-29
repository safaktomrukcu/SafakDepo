import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import ProductList from './pages/products/ProductList';
import CreateProduct from './pages/products/CreateProduct';
import UpdateProduct from './pages/products/UpdateProduct';
import Home from './pages/home';
import InboundShipment from './pages/shipments/InboundShipment';
import Navbar from './components/Navbar';
import ShipmentList from './pages/shipments/ShipmentList';
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import PalletList from './pages/pallets/PalletList';
import OutboundShipment from './pages/shipments/OutboundShipment';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster
        position="bottom-left"
        containerStyle={{ cursor: "pointer" }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <div
                style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                onClick={() => toast.dismiss(t.id)}
              >
                {icon}
                {message}
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>

      <Navbar />
      <main className="container mx-auto p-4 mt-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/urunler" element={<ProductList />} />
          <Route path="/urun-ekle" element={<CreateProduct />} />
          <Route path="/urun-duzenle/:id" element={<UpdateProduct />} />
          <Route path="/sevkiyatlar" element={<ShipmentList />} />
          <Route path="/gelen-sevkiyat" element={<InboundShipment />} />
          <Route path="/paletler" element={<PalletList />} />
          <Route path="/giden-sevkiyat" element={<OutboundShipment />} />
          <Route path="*" element={<div className="text-center text-red-500">404 - Sayfa Bulunamadı</div>} />

        </Routes>
      </main>
    </div>
  );
}

export default App;
