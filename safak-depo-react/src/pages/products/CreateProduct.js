import { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const CreateProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        code: '',
        brand: '',
        palletQty: '',
        boxQty: '',
        weight: ''
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingProduct, setPendingProduct] = useState(null);

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setPendingProduct(product);
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        // Ürün ekleme işlemi burada yapılacak
        console.log(pendingProduct);
        toast.promise(
            axios.post('https://localhost:7018/api/product', pendingProduct),
            {
                loading: 'Ürün ekleniyor...',
                success: (response) => {
                    setShowConfirm(false);
                    setProduct({
                        name: '',
                        code: '',
                        brand: '',
                        palletQty: '',
                        boxQty: '',
                        weight: ''
                    });
                    return 'Ürün başarıyla eklendi!';
                },
                error: (error) => {
                    console.error(error);
                    return 'Ürün eklenirken bir hata oluştu.';
                }
            }
        );
        setShowConfirm(false);
        setProduct({
            name: '',
            code: '',
            brand: '',
            palletQty: '',
            boxQty: '',
            weight: ''
        });
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setPendingProduct(null);
    };

    return (
        <div>
            <Toaster />
            <div className="max-w-md mx-auto bg-white p-6 rounded shadow relative">
                <h2 className="text-xl font-bold mb-4">Yeni Ürün Ekle</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Ürün Adı</label>
                        <input type="text" name="name" value={product.name} onChange={handleProductChange} className="w-full border rounded px-3 py-2" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Ürün Kodu</label>
                        <input type="text" name="code" value={product.code} onChange={handleProductChange} className="w-full border rounded px-3 py-2" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Marka</label>
                        <input type="text" name="brand" value={product.brand} onChange={handleProductChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Palet Adedi</label>
                        <input type="number" name="palletQty" value={product.palletQty} onChange={handleProductChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Koli Adedi</label>
                        <input type="number" name="boxQty" value={product.boxQty} onChange={handleProductChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Ağırlık (kg)</label>
                        <input type="number" name="weight" value={product.weight} onChange={handleProductChange} className="w-full border rounded px-3 py-2" step="0.01" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">Kaydet</button>
                </form>
                {showConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                            <h3 className="text-lg font-bold mb-2">Ürün Bilgilerini Onayla</h3>
                            <ul className="mb-4 text-gray-700">
                                <li><b>Ürün Adı:</b> {pendingProduct.name}</li>
                                <li><b>Ürün Kodu:</b> {pendingProduct.code}</li>
                                <li><b>Marka:</b> {pendingProduct.brand}</li>
                                <li><b>Palet Adedi:</b> {pendingProduct.palletQty}</li>
                                <li><b>Koli Adedi:</b> {pendingProduct.boxQty}</li>
                                <li><b>Ağırlık:</b> {pendingProduct.weight}</li>
                            </ul>
                            <div className="flex justify-end gap-2">
                                <button onClick={handleCancel} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">İptal</button>
                                <button onClick={handleConfirm} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Onayla</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateProduct;