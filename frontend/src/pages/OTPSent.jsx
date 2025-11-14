import React, { useState } from "react";
import "./OTPSent.css";
import Logo from "../components/logo/Logo";

const validateOTP = (value) => {
    return /^\d{6}$/.test(value);  // only digits AND exactly 6 digits
};

const OTPSent = () => {
    const [error, setError] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // clear previous error
        
        if (!validateOTP(e.target.otp.value)) {
            setError("OTP must be exactly 6 digits.");
            return;
        }

    };

    return (
        <div>
            <Logo />
            <div className="otp-sent-container">

                <div className="otp-sent-card">
                    <h1 className="otp-sent-title">Verify OTP</h1>
                    <form className="otp-form" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter OTP here"
                                className="form-control"
                                required
                            />
                        </div>
                        {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}

                        <button type="submit" className="otp-submit-button">Verify OTP</button>
                        <div className="resend-otp-link">
                            <p>Didn't receive the OTP? <a href="/resent-otp">Resend OTP</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}


export default OTPSent;