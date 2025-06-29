import React, { useEffect, useState } from "react";
import axios from "axios";

// Modal bileşeni
const Modal = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    onClick={onClose}
  >
    <div
      className="bg-white rounded shadow-lg p-6 min-w-[350px] max-w-[90vw] max-h-[90vh] overflow-auto"
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

const ShipmentDetail = ({ shipment, onClose }) => (
  <Modal onClose={onClose}>
    <div className="flex justify-between items-center mb-2">
      <h2 className="font-bold text-lg">Sevkiyat Detayı (ID: {shipment.id})</h2>
      <button onClick={onClose} className="text-red-600 font-bold text-xl px-2">×</button>
    </div>
    <div><b>Sevkiyat No:</b> {shipment.shipmentNumber}</div>
    <div><b>Tarih:</b> {shipment.shipmentDate ? new Date(shipment.shipmentDate).toLocaleDateString("tr-TR") : "-"}</div>
    <div><b>Müşteri:</b> {shipment.customer}</div>
    <div><b>Yön:</b> {shipment.isInbound ? "Giriş" : "Çıkış"}</div>
    <div><b>Toplam Ürün Adedi:</b> {shipment.totalProductListJson ? shipment.totalProductListJson.reduce((sum, p) => sum + (p.quantity || 0), 0) : 0}</div>
    <div><b>Palet Sayısı:</b> {shipment.palletListJson ? shipment.palletListJson.length : 0}</div>
    <div className="mt-2">
      <b>Paletler:</b>
      <ul className="list-disc ml-6">
        {shipment.palletListJson && shipment.palletListJson.length > 0 ? (
          shipment.palletListJson.map((pallet) => (
            <li key={pallet.palletId}>
              Palet No: {pallet.palletNumber}, Ürün: {pallet.productName} ({pallet.productCode}), Adet: {pallet.quantity}, Lokasyon: {pallet.location}
            </li>
          ))
        ) : (
          <li>Palet yok</li>
        )}
      </ul>
    </div>
    <div className="mt-2">
      <b>Ürünler:</b>
      <ul className="list-disc ml-6">
        {shipment.totalProductListJson && shipment.totalProductListJson.length > 0 ? (
          shipment.totalProductListJson.map((product) => (
            <li key={product.productId}>
              {product.productName} ({product.productCode}) - {product.quantity} adet
            </li>
          ))
        ) : (
          <li>Ürün yok</li>
        )}
      </ul>
    </div>
  </Modal>
);

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShipment, setSelectedShipment] = useState(null);

  useEffect(() => {
    axios
      .get("https://localhost:7018/api/shipment/")
      .then((res) => setShipments(res.data))
      .catch(() => {
        setError("Sevkiyatlar yüklenirken bir hata oluştu.");
        setShipments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="flex justify-center text-2xl font-bold">Sevkiyat Listesi</h1>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : shipments.length === 0 ? (
        <div>Kayıtlı sevkiyat bulunamadı.</div>
      ) : (
        <>
          <table className="min-w-full bg-white border mt-4">
            <thead>
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Sevkiyat No</th>
                <th className="border px-4 py-2">Tarih</th>
                <th className="border px-4 py-2">Müşteri</th>
                <th className="border px-4 py-2">Yön</th>
                <th className="border px-4 py-2">Toplam Ürün Adedi</th>
                <th className="border px-4 py-2">Palet Sayısı</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => {
                const rowColor = shipment.isInbound
                  ? "bg-green-100 hover:bg-blue-100"
                  : "bg-red-100 hover:bg-orange-100";
                return (
                  <tr
                    key={shipment.id}
                    className={`cursor-pointer transition ${rowColor}`}
                    onClick={() => setSelectedShipment(shipment)}
                  >
                    <td className="border px-4 py-2">{shipment.id}</td>
                    <td className="border px-4 py-2">{shipment.shipmentNumber}</td>
                    <td className="border px-4 py-2">
                      {shipment.shipmentDate
                        ? new Date(shipment.shipmentDate).toLocaleDateString("tr-TR")
                        : "-"}
                    </td>
                    <td className="border px-4 py-2">{shipment.customer}</td>
                    <td className="border px-4 py-2">
                      {shipment.isInbound ? "Giriş" : "Çıkış"}
                    </td>
                    <td className="border px-4 py-2">
                      {shipment.totalProductListJson
                        ? shipment.totalProductListJson.reduce(
                          (sum, p) => sum + (p.quantity || 0),
                          0
                        )
                        : 0}
                    </td>
                    <td className="border px-4 py-2">
                      {shipment.palletListJson ? shipment.palletListJson.length : 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {selectedShipment && (
            <ShipmentDetail
              shipment={selectedShipment}
              onClose={() => setSelectedShipment(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ShipmentList;