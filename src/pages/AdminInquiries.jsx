import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "http://localhost:5000/api/contact/inquiries",
        { withCredentials: true }
      );

      console.log("API RESPONSE:", res.data);

      // 🛡️ Prevent crash if not array (401 / error object)
      if (Array.isArray(res.data)) {
        setInquiries(res.data);
      } else {
        setError("You are not logged in as admin.");
        setInquiries([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load inquiries. Please login as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const sendReply = async (id) => {
    try {
      await axios.post(
        "http://localhost:5000/api/contact/reply",
        { id, reply: replyText },
        { withCredentials: true }
      );

      alert("Reply sent successfully");
      setReplyText("");
      fetchInquiries();
    } catch (err) {
      console.error(err);
      alert("Failed to send reply. Are you logged in as admin?");
    }
  };

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-serif italic">Customer Inquiries</h1>

      {loading && <p>Loading inquiries...</p>}

      {error && (
        <p className="text-red-600 font-semibold">
          {error}
        </p>
      )}

      {!loading && inquiries.length === 0 && !error && (
        <p>No inquiries found.</p>
      )}

      {Array.isArray(inquiries) &&
        inquiries.map((q) => (
          <div key={q._id} className="bg-white border rounded-2xl p-6 shadow">
            <p className="text-sm"><b>Name:</b> {q.name}</p>
            <p className="text-sm"><b>Email:</b> {q.email}</p>
            <p className="text-sm"><b>Message:</b> {q.message}</p>

            {!q.replied && (
              <div className="mt-4 space-y-2">
                <textarea
                  placeholder="Type reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full border p-3 rounded-lg"
                />
                <button
                  onClick={() => sendReply(q._id)}
                  className="bg-stone-900 text-white px-6 py-2 rounded-lg"
                >
                  Send Reply
                </button>
              </div>
            )}

            {q.replied && (
              <p className="text-green-600 mt-3 font-semibold">Replied</p>
            )}
          </div>
        ))}
    </div>
  );
}
