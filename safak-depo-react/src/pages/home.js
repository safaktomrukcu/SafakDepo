import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Depo Stok Takip Sistemine Hoş Geldiniz</h2>
      <p className="text-gray-600 mb-4">
        Şafak Depo ile stoklarınızı kolayca yönetin, ürün ekleyin ve güncel stok durumunu takip edin.
      </p>
      <ul className="list-disc pl-6 text-gray-700 mb-4">
        <li>Stoklarınızı görüntüleyin</li>
        <li>Yeni ürün ekleyin</li>
        <li>Stok hareketlerini takip edin</li>
      </ul>
      <Link to="/urunler" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
        Stokları Görüntüle
      </Link>
    </div>
  );
}

export default Home;