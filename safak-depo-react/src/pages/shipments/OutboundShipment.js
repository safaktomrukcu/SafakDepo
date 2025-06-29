import React, { useEffect, useState } from "react";
import axios from "axios";

// Yardımcı fonksiyon: Tarihi string olarak döndürür (yyyy-MM-dd)
const formatDate = (date) => date.toISOString().slice(0, 10);

const OutboundShipment = () => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setHours(today.getHours() - today.getTimezoneOffset() / 60, 0, 0, 0);
    return today;
  });
  const [customer, setCustomer] = useState("");
  const [pallets, setPallets] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedPallets, setSelectedPallets] = useState([]);
  const [palletQuantities, setPalletQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitResult, setSubmitResult] = useState("");

  useEffect(() => {
    axios
      .get("https://localhost:7018/api/Pallet")
      .then((res) => setPallets(res.data))
      .catch(() => setPallets([]))
      .finally(() => setLoading(false));
  }, []);

  // Tarihi bir gün arttır
  const incDate = () => setDate((d) => new Date(d.getTime() + 24 * 60 * 60 * 1000));
  // Tarihi bir gün azalt
  const decDate = () => setDate((d) => new Date(d.getTime() - 24 * 60 * 60 * 1000));

  // Palet seçimini yönet
  const togglePallet = (pallet) => {
    setSelectedPallets((prev) =>
      prev.some((p) => p.id === pallet.id)
        ? prev.filter((p) => p.id !== pallet.id)
        : [...prev, pallet]
    );
    setPalletQuantities((prev) =>
      prev[pallet.id]
        ? prev
        : { ...prev, [pallet.id]: pallet.quantity }
    );
  };

  // Palet miktarını değiştir
  const handleQuantityChange = (palletId, value) => {
    setPalletQuantities((prev) => ({
      ...prev,
      [palletId]: Math.max(1, Math.min(Number(value), pallets.find(p => p.id === palletId)?.quantity || 1))
    }));
  };

  // OutboundTotals hesapla
  const outboundTotals = selectedPallets.reduce((totals, pallet) => {
    const qty = Number(palletQuantities[pallet.id] || 0);
    const key = pallet.productId;
    if (!totals[key]) {
      totals[key] = {
        ProductName: pallet.productName,
        ProductCode: pallet.productCode,
        ProductId: pallet.productId,
        Quantity: 0,
      };
    }
    totals[key].Quantity += qty;
    return totals;
  }, {});
  const outboundTotalsArr = Object.values(outboundTotals);

  // Sevkiyat gönder
  const handleSubmit = async () => {
    setSubmitResult("");
    if (!customer) {
      setSubmitResult("Müşteri adı zorunlu.");
      return;
    }
    try {
      console.log("Outbound shipment data:", {
        ShipmentDate: formatDate(date),
        Customer: customer,
        OutboundPallets: selectedPallets.map((p) => ({
          PalletId: p.id,
          Quantity: Number(palletQuantities[p.id] || 0),
        })),
        OutboundTotals: outboundTotalsArr,
      });

      await axios.post("https://localhost:7018/api/shipment/outbound", {
        ShipmentDate: formatDate(date),
        Customer: customer,
        OutboundPallets: selectedPallets.map((p) => ({
          PalletId: p.id,
          Quantity: Number(palletQuantities[p.id] || 0),
        })),
        OutboundTotals: outboundTotalsArr,
      });
      setSubmitResult("Sevkiyat başarıyla oluşturuldu.");
      setSelectedPallets([]);
      setPalletQuantities({});
      setCustomer("");
      axios
        .get("https://localhost:7018/api/Pallet")
        .then((res) => setPallets(res.data))
        .catch(() => setPallets([]))
        .finally(() => setLoading(false));
    } catch {
      setSubmitResult("Sevkiyat oluşturulurken hata oluştu.");
    }
  };

  // Filtrelenmiş paletler
  const filteredPallets = pallets.filter(
    (p) =>
      p.productName.toLowerCase().includes(filter.toLowerCase()) ||
      p.productCode.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Giden Sevkiyat Oluştur</h1>
      <div className="flex items-center gap-2 mb-4">
        <label className="font-semibold">Tarih:</label>
        <button
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={decDate}
          title="Bir gün geri"
        >
          -
        </button>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={formatDate(date)}
          onChange={(e) => setDate(new Date(e.target.value))}
        />
        <button
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={incDate}
          title="Bir gün ileri"
        >
          +
        </button>
      </div>
      <div className="mb-2 flex items-center gap-2">
        <label className="font-semibold">Müşteri:</label>
        <input
          type="text"
          className="border rounded px-2 py-1"
          placeholder="Müşteri adı giriniz"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
      </div>
      <div className="mb-2 flex items-center gap-2">
        <label className="font-semibold">Ürün Filtrele:</label>
        <input
          type="text"
          className="border rounded px-2 py-1"
          placeholder="Ürün adı veya kodu"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="mb-4">
        {loading ? (
          <div>Paletler yükleniyor...</div>
        ) : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th></th>
                <th className="border px-2 py-1">Palet No</th>
                <th className="border px-2 py-1">Ürün Adı</th>
                <th className="border px-2 py-1">Ürün Kodu</th>
                <th className="border px-2 py-1">Adet</th>
                <th className="border px-2 py-1">Lokasyon</th>
                <th className="border px-2 py-1">Sevk Miktarı</th>
              </tr>
            </thead>
            <tbody>
              {filteredPallets.map((pallet) => {
                const checked = selectedPallets.some((p) => p.id === pallet.id);
                return (
                  <tr
                    key={pallet.id}
                    className={`transition cursor-pointer ${checked ? "bg-blue-100" : ""} hover:bg-blue-50`}
                    onClick={() => togglePallet(pallet)}
                  >
                    {/* Checkbox kaldırıldı */}
                    <td className="border px-2 py-1 text-center">
                      {checked ? "✅" : "☐"}
                    </td>
                    <td className="border px-2 py-1">{pallet.palletNumber}</td>
                    <td className="border px-2 py-1">{pallet.productName}</td>
                    <td className="border px-2 py-1">{pallet.productCode}</td>
                    <td className="border px-2 py-1">{pallet.quantity}</td>
                    <td className="border px-2 py-1">{pallet.location}</td>
                    <td className="border px-2 py-1">
                      {checked && (
                        <input
                          type="number"
                          min={1}
                          max={pallet.quantity}
                          value={palletQuantities[pallet.id] || pallet.quantity}
                          onChange={(e) =>
                            handleQuantityChange(pallet.id, e.target.value)
                          }
                          className="w-20 border rounded px-1 py-0.5"
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {selectedPallets.length > 0 && (
        <div className="mb-4">
          <b>Toplamlar:</b>
          <table className="min-w-full bg-gray-50 border mt-2">
            <thead>
              <tr>
                <th className="border px-2 py-1">Ürün Adı</th>
                <th className="border px-2 py-1">Ürün Kodu</th>
                <th className="border px-2 py-1">Ürün ID</th>
                <th className="border px-2 py-1">Toplam Miktar</th>
              </tr>
            </thead>
            <tbody>
              {outboundTotalsArr.map((t) => (
                <tr key={t.ProductId}>
                  <td className="border px-2 py-1">{t.ProductName}</td>
                  <td className="border px-2 py-1">{t.ProductCode}</td>
                  <td className="border px-2 py-1">{t.ProductId}</td>
                  <td className="border px-2 py-1">{t.Quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleSubmit}
          disabled={
            selectedPallets.length === 0 ||
            !customer ||
            selectedPallets.some((p) => !palletQuantities[p.id])
          }
        >
          Seçili Paletlerle Giden Sevkiyat Oluştur
        </button>
        {submitResult && (
          <span className="ml-4 font-semibold">{submitResult}</span>
        )}
      </div>
    </div>
  );
};

export default OutboundShipment;