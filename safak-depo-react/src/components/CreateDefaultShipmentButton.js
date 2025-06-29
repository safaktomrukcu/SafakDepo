import axios from "axios";
import React, { useState } from "react";

const CreateDefaultShipmentButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    setResult("");
    try {
      await axios.get("https://localhost:7018/api/shipment/create");
      setResult("Başarıyla oluşturuldu.");
    } catch {
      setResult("Oluşturulurken hata oluştu.");
    }
    setLoading(false);
  };

  return (
    <li>
      <button
        onClick={handleCreate}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Oluşturuluyor..." : "Varsayılan Oluştur"}
      </button>
      {result && <span className="ml-2">{result}</span>}
    </li>
  );
};

export default CreateDefaultShipmentButton;