import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [petId, setPetId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reviews/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/reviews/add",
        { pet_id: petId, rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPetId("");
      setRating(5);
      setComment("");
      fetchReviews();
    } catch (err) {
      console.error("Review submission failed", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Reviews</h1>

      <form onSubmit={submitReview} className="mb-6 space-y-3">
        <input
          type="text"
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          placeholder="Pet ID"
          required
          className="border rounded p-2 w-full"
        />
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border rounded p-2 w-full"
        >
          {[1, 2, 3, 4, 5].map((val) => (
            <option key={val} value={val}>
              {val} Star{val > 1 && "s"}
            </option>
          ))}
        </select>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your review..."
          className="border rounded p-2 w-full"
        />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
          Submit Review
        </button>
      </form>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.review_id} className="border rounded p-3 shadow">
            <p className="font-semibold">
              🐾 Pet ID: {rev.pet_id} – {rev.rating}⭐
            </p>
            <p className="text-gray-700">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
