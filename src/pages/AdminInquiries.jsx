import { useEffect, useState } from "react";
import { API } from "../api";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    API.get("/contact/inquiries", { withCredentials: true })
      .then(res => setInquiries(res.data));
  }, []);

  const sendReply = async (id) => {
    await API.post("/contact/reply", { id, reply: replyText }, { withCredentials: true });
    alert("Reply sent");
    setReplyText("");
  };

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-serif italic">Customer Inquiries</h1>

      {inquiries.map(q => (
        <div key={q._id} className="bg-white border rounded-2xl p-6 shadow">
          <p className="text-sm"><b>Name:</b> {q.name}</p>
          <p className="text-sm"><b>Email:</b> {q.email}</p>
          <p className="text-sm"><b>Message:</b> {q.message}</p>

          {!q.replied && (
            <div className="mt-4 space-y-2">
              <textarea
                placeholder="Type reply..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
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

          {q.replied && <p className="text-green-600 mt-3">Replied</p>}
        </div>
      ))}
    </div>
  );
}
