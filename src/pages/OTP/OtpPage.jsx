import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sendotp, verifyotp } from "../../DAL/create";
import "./OtpPage.css";

export default function OtpPage({ onLoginSuccess }) {
  const { ticket_id } = useParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const otpSent = useRef(false); // ✅ prevent multiple OTP sends

  useEffect(() => {
    const token = localStorage.getItem("Secret-token");

    if (token) {
      navigate(`/ticket/${ticket_id}`, { replace: true });
    } else if (!otpSent.current) {
      sendotptouser();
      otpSent.current = true; // mark as already sent
    }
  }, [navigate, ticket_id]);

  const sendotptouser = async () => {
    await sendotp({ id: ticket_id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await verifyotp({ otp, id: ticket_id });
      

      if (res.status === 200) {
        localStorage.setItem("Secret-token", res.token);

        if (onLoginSuccess) {
          onLoginSuccess(res.token);
        }
       
setTimeout(()=>{
   setLoading(false);
 navigate(`/ticket/${ticket_id}`, { replace: true });
},5000)
       
      } else {
        setError(res.message || "Invalid OTP, please try again");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong, please try again");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2 className="otp-title">Verify Your OTP</h2>
        <form onSubmit={handleSubmit} className="otp-form">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="otp-input"
            required
          />
          {loading ? (
            <p className="otp-loading">Checking OTP...</p>
          ) : (
            <button type="submit" className="otp-btn">
              Verify OTP
            </button>
          )}
          {error && <p className="otp-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
