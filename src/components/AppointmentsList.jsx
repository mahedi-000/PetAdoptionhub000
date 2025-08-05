import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [petId, setPetId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const token = localStorage.getItem("token");

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/appointments/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to load appointments", err);
    }
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/appointments/book",
        { pet_id: petId, date, time,reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPetId("");
      setDate("");
      setTime("");
      setReason("");
      fetchAppointments();
    } catch (err) {
      console.error("Booking failed", err);
    }
  };
  
  const cancelAppointments = async (appointment_id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/cancel/${appointment_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>

      <form onSubmit={bookAppointment} className="mb-6 space-y-3">
        <input
          type="text"
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          placeholder="Pet ID"
          required
          className="border rounded p-2 w-full"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for appointment"
          required
          className="border rounded p-2 w-full"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Book Appointment
        </button>
      </form>

      <table className="w-full border text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Pet ID</th>
            <th className="p-2">Date</th>
            <th className="p-2">Time</th>
            <th className="p-2">Reason</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.appointment_id} className="border-t">
              <td className="p-2">{appt.pet_id}</td>
             <td>{new Date(appt.date).toLocaleDateString('en-GB')}</td>
              <td className="p-2">{appt.time}</td>
              <td className="p-2">{appt.reason}</td>
              <td className="p-2">{appt.status}</td>
              <td className="p-2">
                {appt.status !== "cancelled" && (
                  <button
                    onClick={() => cancelAppointments(appt.appointment_id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

