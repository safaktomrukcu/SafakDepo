import React, { useEffect, useState } from "react";
import axios from "axios";

const PalletList = () => {
  const [pallets, setPallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("https://localhost:7018/api/Pallet")
      .then((res) => setPallets(res.data))
      .catch(() => {
        setError("Paletler yüklenirken bir hata oluştu.");
        setPallets([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtrelenmiş paletler
  const filteredPallets = pallets.filter(
    (p) =>
      p.productName.toLowerCase().includes(filter.toLowerCase()) ||
      p.productCode.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1 className="flex justify-center text-2xl font-bold mb-4">Palet Listesi</h1>
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold">Filtrele:</label>
        <input
          type="text"
          className="border rounded px-2 py-1"
          placeholder="Ürün adı veya kodu"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : filteredPallets.length === 0 ? (
        <div>Kayıtlı palet bulunamadı.</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Palet No</th>
              <th className="border px-4 py-2">Ürün Adı</th>
              <th className="border px-4 py-2">Ürün Kodu</th>
              <th className="border px-4 py-2">Adet</th>
              <th className="border px-4 py-2">Lokasyon</th>
            </tr>
          </thead>
          <tbody>
            {filteredPallets.map((pallet) => (
              <tr key={pallet.id} className="hover:bg-blue-50 transition">
                <td className="border px-4 py-2">{pallet.palletNumber}</td>
                <td className="border px-4 py-2">{pallet.productName}</td>
                <td className="border px-4 py-2">{pallet.productCode}</td>
                <td className="border px-4 py-2">{pallet.quantity}</td>
                <td className="border px-4 py-2">{pallet.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PalletList;