import React from "react";
import "./OTPSent.css";
import Logo from "../components/logo/Logo"; 

const OTPSent = () => {
    return (
        <div>
            <Logo />
            <div className="otp-sent-container">

                <div className="otp-sent-card">
                    <h1 className="otp-sent-title">Verify OTP</h1>
                    <form className="otp-form">
                        <div className="mb-3">
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter OTP here"
                                className="form-control"
                                required
                            />
                        </div>
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