import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import axiosInstance from "../Axios Instance/axios";
import { AuthContext } from "../Contex/AuthProvider";

// NOTE: Payment collection (Stripe) is intentionally skipped for now.
// Requesting contact info is free during development — this just records
// the request directly. Re-introduce the Stripe CardElement flow here
// once payment is ready to wire back in.
const CheckoutPage = () => {
  const { bioId } = useParams();
  const { user, biodata } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contactData = {
        biodataId: bioId,
        requestBioId: biodata?.bioId,
        requestEmail: biodata?.email,
        requestName: biodata?.name,
        requestMobile: biodata?.mobile,
        transactionId: "free-during-dev",
        status: "pending",
      };

      await axiosInstance.post("/contact-requests", contactData);
      Swal.fire("Success", "Contact request submitted!", "success");
    } catch (err) {
      if (err?.response?.status === 409) {
        Swal.fire("Error", "You have already requested this contact info", "error");
      } else {
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-32 mx-6">
      <div className="max-w-lg mx-auto my-10 p-6 bg-white border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-maroon">Request Contact Info</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Biodata ID</label>
            <input
              type="text"
              value={bioId}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100 text-ink"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Your Email</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100 text-ink"
            />
          </div>

          <p className="text-sm text-gray-500 text-center">
            Payment is temporarily disabled — submitting this request is free for now.
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-semibold ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-maroon hover:bg-maroon-dark"
            }`}
          >
            {loading ? "Submitting..." : "Request Contact Info"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
