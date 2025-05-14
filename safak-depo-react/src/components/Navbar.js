import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Şafak Depo</h1>
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:text-blue-200">Ana Sayfa</Link></li>
          <li><Link to="/urunler" className="hover:text-blue-200">Stoklar</Link></li>
          <li><Link to="/urun-ekle" className="hover:text-blue-200">Ürün Ekle</Link></li>
          <li><Link to="/sevkiyatlar" className="hover:text-blue-200">Sevkiyatlar</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
