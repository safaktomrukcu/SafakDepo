import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const UpdateProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        axios.get(`https://localhost:7018/api/product/${id}`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Form submit: sadece onay popup'ını açar
    const handleFormSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    // Onay popup'ında "Onayla"ya basınca asıl güncelleme yapılır
    const handleConfirm = async () => {
        setShowConfirm(false);
        setUpdating(true);
        await toast.promise(
            axios.put(`https://localhost:7018/api/product/${id}`, product),
            {
                loading: "Güncelleniyor...",
                success: () => {
                    setUpdating(false);
                    return "Ürün başarıyla güncellendi!";
                },
                error: (error) => {
                    setUpdating(false);
                    const msg =
                        error.response?.data?.errors?.Name?.[0] ||
                        error.response?.data?.message ||
                        'Ürün güncellenirken bir hata oluştu.';
                    return msg;
                }
            }
        );
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    if (loading) return <div>Yükleniyor...</div>;
    if (!product) return <div>Ürün bulunamadı.</div>;

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Ürün Güncelle</h2>
            <form className="space-y-3" onSubmit={handleFormSubmit}>
                <div>
                    <label className="block font-semibold">Ad:</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Kod:</label>
                    <input
                        type="text"
                        name="code"
                        value={product.code || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Marka:</label>
                    <input
                        type="text"
                        name="brand"
                        value={product.brand || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Palet Adedi:</label>
                    <input
                        type="number"
                        name="palletQty"
                        value={product.palletQty || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Koli Adedi:</label>
                    <input
                        type="number"
                        name="boxQty"
                        value={product.boxQty || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Ağırlık:</label>
                    <input
                        type="number"
                        name="weight"
                        value={product.weight || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1"
                        step="any"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Stok:</label>
                    <input
                        type="number"
                        name="stock"
                        value={product.stock || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Palet Stok:</label>
                    <input
                        type="number"
                        name="palletStock"
                        value={product.palletStock || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={product.isActive || false}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label className="font-semibold">Aktif mi?</label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    disabled={updating}
                >
                    {updating ? "Güncelleniyor..." : "Güncelle"}
                </button>
            </form>
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-2">Ürün Bilgilerini Onayla</h3>
                        <ul className="mb-4 text-gray-700">
                            <li><b>Ürün Adı:</b> {product.name}</li>
                            <li><b>Ürün Kodu:</b> {product.code}</li>
                            <li><b>Marka:</b> {product.brand}</li>
                            <li><b>Palet Adedi:</b> {product.palletQty}</li>
                            <li><b>Koli Adedi:</b> {product.boxQty}</li>
                            <li><b>Ağırlık:</b> {product.weight}</li>
                        </ul>
                        <div className="flex justify-end gap-2">
                            <button onClick={handleCancel} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">İptal</button>
                            <button onClick={handleConfirm} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Onayla</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateProduct;