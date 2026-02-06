import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { apiFetch } from "../api/apiClient";


import "./OTPSent.css";
import Logo from "../components/logo/Logo";

const validateOTP = async (email, otp) => {

    const resp = await apiFetch("/auth/verify-otp/", { method: "POST", body: { email, otp } } // send both email and OTP
    )
    console.log(resp);  
    return resp.ok
};

const OTPSent = () => {

    const location = useLocation();
    const email = location.state?.email|| localStorage.getItem("otp_email");
    localStorage.removeItem("otp_email");            // remove it

    console.log("Email from location state:", email);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = await validateOTP(email, e.target.otp.value);
        if (!isValid) {
            toast.error("Invalid OTP!");
            return;
        } else {
            toast.success("OTP Verified.");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        }
    };

    return (
        <div>
            <Logo />
            <Toaster />
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