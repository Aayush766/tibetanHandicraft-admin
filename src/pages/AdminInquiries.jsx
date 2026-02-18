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
    <div className="min-h-screen bg-stone-50">
      
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl md:text-4xl font-serif italic text-stone-800">
            Customer Inquiries
          </h1>
          <p className="text-stone-500 mt-1 text-sm">
            Manage and respond to customer messages
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-stone-600">
            Loading inquiries...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 font-medium">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && inquiries.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-stone-500">
            No inquiries found.
          </div>
        )}

        {/* Inquiry Cards */}
        <div className="space-y-6">
          {Array.isArray(inquiries) &&
            inquiries.map((q) => (
              <div
                key={q._id}
                className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300"
              >
                
                {/* User Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide">
                      Name
                    </p>
                    <p className="text-stone-800 font-medium">{q.name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-stone-800 font-medium">{q.email}</p>
                  </div>
                </div>

                {/* Message */}
                <div className="mt-4">
                  <p className="text-xs text-stone-500 uppercase tracking-wide">
                    Message
                  </p>
                  <p className="text-stone-700 mt-1 leading-relaxed">
                    {q.message}
                  </p>
                </div>

                {/* Reply Section */}
                {!q.replied && (
                  <div className="mt-6 space-y-3">

                    <textarea
                      placeholder="Write your reply to the customer..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full border border-stone-300 focus:border-stone-600 focus:ring-1 focus:ring-stone-600 outline-none p-3 rounded-xl resize-none transition"
                      rows={4}
                    />

                    <button
                      onClick={() => sendReply(q._id)}
                      className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded-xl font-medium transition duration-200 shadow-sm"
                    >
                      Send Reply
                    </button>

                  </div>
                )}

                {/* Replied Status */}
                {q.replied && (
                  <div className="mt-5">
                    <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                      ✓ Replied
                    </span>
                  </div>
                )}

              </div>
            ))}
        </div>

      </div>
    </div>
  );
}
