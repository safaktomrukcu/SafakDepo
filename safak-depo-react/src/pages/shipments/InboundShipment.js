import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const InboundShipment = () => {
    const [shipment, setShipment] = useState({
        ShipmentDate: "",
        InboundPalletsDTO: [],
        InboundTotalsDTO: []
    });

    const [products, setProducts] = useState([]);
    const [palletQuantities, setPalletQuantities] = useState({});
    const [palletLocations, setPalletLocations] = useState({});

    useEffect(() => {
        const today = new Date();
        today.setHours(today.getHours() - today.getTimezoneOffset() / 60, 0, 0, 0);
        setShipment(prev => ({
            ...prev,
            ShipmentDate: today.toISOString().slice(0, 10) // Tarihi yyyy-MM-dd formatında ayarla
        }));

        toast.promise(
            axios.get("https://localhost:7018/api/product/palletquantity")
                .then(res => {
                    setProducts(res.data)

                    // const defaultQuantities = {};
                    // const defaultLocations = {};
                    res.data.forEach(product => {
                        setPalletQuantities(prev => ({
                            ...prev,
                            [product.id]: product.palletQuantity || ""
                        }));
                        setPalletLocations(prev => ({
                            ...prev,
                            [product.id]: "Tuzla"
                        }));
                    });
                })
                .catch(() => setProducts([]))
            , {
                loading: "Ürünler yükleniyor...",
                success: "Ürünler başarıyla yüklendi!",
                error: "Ürünler yüklenirken hata oluştu."
            }
        );
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
            { ProductId: product.id, ProductName: product.name, ProductCode: product.code, Quantity: quantity, Location: location }
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
                { ProductName: product.name, ProductCode: product.code, ProductId: product.id, Quantity: quantity }
                ]
            }));
        }
    };

    // Tarihi bir gün arttır
    const incDate = () => {
        setShipment(prev => ({
            ...prev,
            ShipmentDate: new Date(new Date(prev.ShipmentDate).getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
        }));
    };
    // Tarihi bir gün azalt
    const decDate = () => {
        setShipment(prev => ({
            ...prev,
            ShipmentDate: new Date(new Date(prev.ShipmentDate).getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
        }));
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
                    return { ProductId: t.ProductId, Quantity: t.Quantity - quantity };
                }
                return t;
            })
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!shipment.ShipmentDate || shipment.InboundPalletsDTO.length === 0 || shipment.InboundTotalsDTO.length === 0) {
            toast.error("Sevkiyat tarihi zorunludur ve ya  palet eklenmemiştir.");
            return;
        }
        await toast.promise(
            axios.post("https://localhost:7018/api/shipment/inbound", shipment),
            {
                loading: "Kaydediliyor...",
                success: "Sevkiyat başarıyla kaydedildi!",
                error: "Sevkiyat kaydedilirken hata oluştu."
            }
        );
        setShipment(prev => ({
            ...prev,
            InboundPalletsDTO: [],
            InboundTotalsDTO: []
        }));
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Gelen Sevkiyat Oluştur</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Sevkiyat Tarihi:</label>
                    <div className="flex items-center gap-2">
                        <button
                            type="button" // <-- Bunu ekle!
                            className="px-2 py-1 bg-gray-200 rounded"
                            onClick={decDate}
                            title="Bir gün geri"
                        >
                            -
                        </button>
                        <input
                            type="date"
                            name="ShipmentDate"
                            value={shipment.ShipmentDate}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                            required
                        />
                        <button
                            type="button" // <-- Bunu ekle!
                            className="px-2 py-1 bg-gray-200 rounded"
                            onClick={incDate}
                            title="Bir gün ileri"
                        >
                            +
                        </button>
                    </div>
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