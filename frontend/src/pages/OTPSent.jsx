import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { apiFetch } from "../api/apiClient";

import "./OTPSent.css";
import Logo from "../components/logo/Logo";

const validateOTP = (value) => {
    const resp = apiFetch("/auth/verify-otp/", {
        otp: e.target.otp.value
    })
    if (resp.ok) {
        return true;
    } else {
        return false;
    }
};

const OTPSent = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateOTP(e.target.otp.value)) {
            toast.error("Invalid OTP!");
            return;
        }
        else {
            toast.success("OTP Verified.");
           
            setTimeout(() => {
                window.location.href = "/quiz";
            }, 1000);
        }

    };

    return (
        <div>
            <Logo />
            <Toaster  />
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