import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyAdoptions() {
  const [adoptions, setAdoptions] = useState([]);
  const [petId, setPetId] = useState("");
  const [duration, setDuration] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const token = localStorage.getItem("token");
const [discountDetails, setDiscountDetails] = useState({ original: "", discountText: "" });

  const fetchAdoptions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/adoptions/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdoptions(res.data);
    } catch (err) {
      console.error("Failed to fetch adoptions", err);
    }
  };
const fetchPetPrice = async (id, days) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/pets/${id}`);
    const pet = res.data[0];
    if (!pet || !pet.price) {
      console.error("Invalid pet data", res.data);
      return;
    }

    const original = pet.price * days;
    let final = original;
    let discountText = "";

    if (days > 365) {
      final = original * 0.9;
      discountText = " (10% discount applied)";
    }

    setCalculatedPrice(final.toFixed(2));
    setDiscountDetails({
      original: original.toFixed(2),
      discountText,
    });
  } catch (err) {
    console.error("Error fetching pet price", err);
    setCalculatedPrice(0);
    setDiscountDetails({ original: "", discountText: "" });
  }
};



  useEffect(() => {
    if (petId && duration) fetchPetPrice(petId, duration);
  }, [petId, duration]);

  const submitAdoption = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/adoptions/request",
        { pet_id: petId, price: calculatedPrice, durationDays: duration },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPetId("");
      setDuration("");
      setCalculatedPrice(0);
      fetchAdoptions();
    } catch (err) {
      console.error("Adoption request failed", err);
    }
  };

  const cancelAdoption = async (adoption_id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/adoptions/cancel/${adoption_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdoptions();
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

  const renewAdoption = async (adoption_id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/adoptions/renew/${adoption_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdoptions();
    } catch (err) {
      console.error("Renew failed", err);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const daysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `${diff} days` : "Expired";
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Adoptions</h1>

      <form onSubmit={submitAdoption} className="mb-6 space-y-2">
        <input
          type="text"
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          placeholder="Pet ID"
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (in days)"
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          value={`$${calculatedPrice}`}
          readOnly
          className="border p-2 rounded w-full bg-gray-100"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Request Adoption
        </button>
      </form>

      {adoptions.length === 0 ? (
        <p>No adoptions found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Pet ID</th>
              <th className="p-2">Price</th>
              <th className="p-2">Start Date</th>
              <th className="p-2">End Date</th>
              <th className="p-2">Time Remaining</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adoptions.map((a) => (
              <tr key={a.adoption_id} className="border-t">
                <td className="p-2">{a.pet_id}</td>
                <td className="p-2">${a.price}</td>
                <td className="p-2">{new Date(a.start_date).toLocaleDateString('en-GB')}</td>
                <td className="p-2">{new Date(a.end_date).toLocaleDateString('en-GB')}</td>
                <td className="p-2">{daysLeft(a.end_date)}</td>
                <td className="p-2">{a.status}</td>
                <td className="p-2 space-x-2">
                  {a.status !== "cancelled" && (
                    <>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                        onClick={() => renewAdoption(a.adoption_id)}
                      >
                        Renew
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => cancelAdoption(a.adoption_id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
