import React from "react";
import ReviewList from "../components/ReviewsList";

export default function Pets() {
  return (
    <div className="p-4">
      <h1 className="text-2xl p-4">User Reviews</h1>;
      <ReviewList />
    </div>
  );
}

