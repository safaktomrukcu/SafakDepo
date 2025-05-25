import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();

    const [showHidden, setShowHidden] = useState(false);
    const [hiddenProducts, setHiddenProducts] = useState([]);
    const [hiddenLoading, setHiddenLoading] = useState(false);


    useEffect(() => {
        fetch("https://localhost:7018/api/product")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (showHidden) {
            setHiddenLoading(true);
            axios.get("https://localhost:7018/api/product/hiddenproducts")
                .then(res => setHiddenProducts(res.data))
                .catch(() => setHiddenProducts([]))
                .finally(() => setHiddenLoading(false));
        }
    }, [showHidden]);

    const handleSelectProduct = (id) => {
        toast.promise(
            axios.get(`https://localhost:7018/api/product/${id}`), {
            loading: "Ürün bilgileri yükleniyor...",
            success: (response) => {
                setSelectedProduct(response.data);
                console.log(response);
                return "Ürün bilgileri yüklendi!";
            },
            error: (error) => {
                console.error(error);
                return error.response.data.message;
            }
        });
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Ürün Listesi</h2>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Ad</th>
                        <th className="border px-4 py-2">Kod</th>
                        <th className="border px-4 py-2">Marka</th>
                        <th className="border px-4 py-2">Stok</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr
                            key={product.id}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSelectProduct(product.id)}
                        >
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{product.code}</td>
                            <td className="border px-4 py-2">{product.brand}</td>
                            <td className="border px-4 py-2">{product.stock}</td>
                        </tr>

                    ))}
                </tbody>
            </table>

            <div className="flex items-center mb-4">
                <input
                    id="showHidden"
                    type="checkbox"
                    checked={showHidden}
                    onChange={() => setShowHidden(v => !v)}
                    className="mr-2"
                />
                <label htmlFor="showHidden" className="font-semibold cursor-pointer">
                    Gizli ürünleri göster
                </label>
            </div>

            {showHidden && (
                <div className="mb-6">
                    <h3 className="font-bold mb-2">Gizli Ürünler</h3>
                    {hiddenLoading ? (
                        <div>Yükleniyor...</div>
                    ) : hiddenProducts.length === 0 ? (
                        <div>Gizli ürün bulunamadı.</div>
                    ) : (
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Ad</th>
                                    <th className="border px-4 py-2">Kod</th>
                                    <th className="border px-4 py-2">Marka</th>
                                    <th className="border px-4 py-2">Stok</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hiddenProducts.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSelectProduct(item.id)}
                                    >
                                        <td className="border px-4 py-2">{item.name}</td>
                                        <td className="border px-4 py-2">{item.code}</td>
                                        <td className="border px-4 py-2">{item.brand}</td>
                                        <td className="border px-4 py-2">{item.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] relative">
                        <button
                            className="text-5xl absolute top-2 right-2 text-gray-500 hover:text-red-500"
                            onClick={() => setSelectedProduct(null)}
                        >
                            ×
                        </button>
                        <h3 className="text-lg font-bold mb-4">Ürün Detayları</h3>
                        <ul className="space-y-1">
                            <li><b>Id:</b> {selectedProduct.id}</li>
                            <li><b>Ad:</b> {selectedProduct.name}</li>
                            <li><b>Kod:</b> {selectedProduct.code}</li>
                            <li><b>Marka:</b> {selectedProduct.brand}</li>
                            <li><b>Palet İçi Adedi:</b> {selectedProduct.palletQty}</li>
                            <li><b>Koli İçi Adedi:</b> {selectedProduct.boxQty}</li>
                            <li><b>Ağırlık:</b> {selectedProduct.weight}</li>
                            <hr />
                            <li><b>Stok:</b> {selectedProduct.stock}</li>
                            <li><b>Palet Stok:</b> {selectedProduct.palletStock}</li>
                        </ul>
                        <div className="flex justify-between mt-6">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                onClick={() => { navigate(`/urun-duzenle/${selectedProduct.id}`) }}
                            >
                                Düzenle
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-red-400 hover:text-white transition"
                                onClick={() => setSelectedProduct(null)}
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;