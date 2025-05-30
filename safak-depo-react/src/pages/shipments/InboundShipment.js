import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const InboundShipment = () => {
    const [shipment, setShipment] = useState({
        ShipmentDate: "2025-01-01",
        InboundPalletsDTO: [],
        InboundTotalsDTO: []
    });

    const [products, setProducts] = useState([]);
    const [palletQuantities, setPalletQuantities] = useState({});
    const [palletLocations, setPalletLocations] = useState({});

    useEffect(() => {
        var a = 1
        toast.promise(
            axios.get("https://localhost:7018/api/product")
                .then(res => setProducts(res.data))
                .catch(() => setProducts([]))
            , {
                loading: "Ürünler yükleniyor...",
                success: "Ürünler başarıyla yüklendi!",
                error: "Ürünler yüklenirken hata oluştu."
            }
        );
        setPalletLocations({
            1: "Pharmastar",
            2: "Pharmastar",
            3: "Pharmastar"
        })
        setPalletQuantities({
            1: 1,
            2: 2,
            3: 3
        });
    }, []); // Boş bağımlılık dizisi ile sadece bileşen ilk yüklendiğinde çalışır

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShipment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Her ürün için miktar inputunu yönet
    const handlePalletQuantityChange = (productId, value) => {
        setPalletQuantities(prev => ({
            ...prev,
            [productId]: value
        }));
    };

    // Her ürün için lokasyon inputunu yönet
    const handlePalletLocationChange = (productId, value) => {
        setPalletLocations(prev => ({
            ...prev,
            [productId]: value
        }));
    };

    // Ekle butonuna basınca ürünü palet listesine ekle
    const handleAddPallet = (product) => {
        const quantity = Number(palletQuantities[product.id]);
        const location = palletLocations[product.id] || "";
        if (!quantity || !location) {
            toast.error("Miktar ve lokasyon giriniz.");
            return;
        }
        setShipment(prev => ({
            ...prev,
            InboundPalletsDTO: [...prev.InboundPalletsDTO,
            { ProductId: product.id, Quantity: quantity, Location: location }
            ],
        }));

        if (shipment.InboundTotalsDTO.some(t => t.ProductId === product.id)) {
            // Eğer ürün zaten toplamlar içinde varsa, miktarı güncelle
            setShipment(prev => ({
                ...prev,
                InboundTotalsDTO: prev.InboundTotalsDTO.map(t =>
                    t.ProductId === product.id
                        ? { ...t, Quantity: t.Quantity + quantity }
                        : t
                )
            }));
        } else {
            // Yeni ürün ekle
            setShipment(prev => ({
                ...prev,
                InboundTotalsDTO: [...prev.InboundTotalsDTO,
                { ProductId: product.id, Quantity: quantity }
                ]
            }));
        }
    };

    const handleRemovePallet = (index, productId, quantity) => {
        setShipment(prev => ({
            ...prev,
            InboundPalletsDTO: prev.InboundPalletsDTO.filter((_, i) => i !== index)
        }));
        setShipment(prev => ({
            ...prev,
            InboundTotalsDTO: prev.InboundTotalsDTO.map(t => {
                if (t.ProductId === productId) {
                    console.log(t.Quantity, quantity)
                    if (t.Quantity <= quantity) {
                        console.log("TTTTT")
                        // Eğer miktar sıfır veya negatif olursa, toplamı kaldır
                        prev.InboundTotalsDTO = prev.InboundTotalsDTO.filter(tt => tt.ProductId !== productId);
                    }
                    console.log("QQQQQQ")
                    return { ProductId: t.ProductId, Quantity: t.Quantity - quantity };
                }
                return t;
            })
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!shipment.ShipmentDate ) {
            toast.error("Sevkiyat tarihi zorunludur.");
            return;
        }
        console.log(shipment);
        await toast.promise(
            axios.post("https://localhost:7018/api/shipment/inbound", shipment),
            {
                loading: "Kaydediliyor...",
                success: "Sevkiyat başarıyla kaydedildi!",
                error: "Sevkiyat kaydedilirken hata oluştu."
            }
        );
        // setShipment({
        //     ShipmentDate: "",
        //     InboundPalletsDTO: [],
        //     InboundTotalsDTO: []
        // });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Gelen Sevkiyat Oluştur</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Sevkiyat Tarihi:</label>
                    <input
                        type="date"
                        name="ShipmentDate"
                        value={shipment.ShipmentDate}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1"
                        required
                    />
                </div>
                {/* Ürünler tablosu */}
                <div className="border-t pt-4">
                    <button className="font-semibold mb-2" onClick={() => {
                        console.log(shipment)
                        console.log(products)
                    }} >Sevkiyat</button>
                    <h3 className="font-semibold mb-2">Ürünler Listesi (Palet Ekle)</h3>
                    <table className="min-w-full bg-white border mb-2">
                        <thead>
                            <tr>
                                <th className="border px-2 py-1">Ad</th>
                                <th className="border px-2 py-1">Kod</th>
                                <th className="border px-2 py-1">Marka</th>
                                <th className="border px-2 py-1">Miktar</th>
                                <th className="border px-2 py-1">Lokasyon</th>
                                <th className="border px-2 py-1"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="border px-2 py-1">{product.name}</td>
                                    <td className="border px-2 py-1">{product.code}</td>
                                    <td className="border px-2 py-1">{product.brand}</td>
                                    <td className="border px-2 py-1">
                                        <input
                                            type="number"
                                            min="1"
                                            value={palletQuantities[product.id] || ""}
                                            onChange={e => handlePalletQuantityChange(product.id, e.target.value)}
                                            className="w-20 border rounded px-1 py-0.5"
                                        />
                                    </td>
                                    <td className="border px-2 py-1">
                                        <input
                                            type="text"
                                            value={palletLocations[product.id] || ""}
                                            onChange={e => handlePalletLocationChange(product.id, e.target.value)}
                                            className="w-24 border rounded px-1 py-0.5"
                                        />
                                    </td>
                                    <td className="border px-2 py-1">
                                        <button
                                            type="button"
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                            onClick={() => handleAddPallet(product)}
                                        >
                                            Ekle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h4 className="font-semibold mb-1">Eklenen Paletler</h4>
                    <ul>
                        {shipment.InboundPalletsDTO.map((p, i) => (
                            <li key={i} className="flex justify-between items-center border-b py-1">
                                <span>
                                    <b>Ürün:</b> {products.find(prod => prod.id === p.ProductId)?.name || p.ProductId}{" "}
                                    <b>Miktar:</b> {p.Quantity} <b>Lokasyon:</b> {p.Location}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemovePallet(i, p.ProductId, p.Quantity)}
                                    className="text-red-500 hover:underline"
                                >
                                    Sil
                                </button>
                            </li>
                        ))}
                    </ul>
                    <h4 className="font-semibold mb-1">Toplam Paletler</h4>
                    <ul>
                        {shipment.InboundTotalsDTO.map((p, i) => (
                            <li key={i} className="flex justify-between items-center border-b py-1">
                                <span>
                                    <b>Ürün:</b> {products.find(prod => prod.id === p.ProductId)?.name || p.ProductId}{" "}
                                    <b>Miktar:</b> {p.Quantity}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Diğer alanlar (toplamlar vs.) buraya eklenebilir */}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Kaydet
                </button>
            </form>
        </div>
    );
};

export default InboundShipment;