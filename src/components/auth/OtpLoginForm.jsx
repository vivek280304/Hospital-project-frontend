import { useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";

function OtpLoginForm({
  onRequestOtp,
  onVerifyOtp,
  onBack,
  loading,
}) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const requestOtp = async () => {
    try {
      await onRequestOtp({ email });
      setOtpSent(true);
    } catch {
      // Parent displays the error.
    }
  };

  const verifyOtp = (e) => {
    e.preventDefault();

    onVerifyOtp({
      email,
      otp,
    });
  };

  return (
    <div className="space-y-5">

      {!otpSent ? (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={requestOtp}
            disabled={loading || !email}
            className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-5">

          <div className="flex justify-center">
            <div className="rounded-full bg-blue-100 p-4 text-blue-600">
              <ShieldCheck size={28} />
            </div>
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-slate-800">
              Verify OTP
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Enter the OTP sent to {email}
            </p>
          </div>

          <input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter 6 digit OTP"
            maxLength={6}
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-center text-xl tracking-[0.5em] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm font-medium text-slate-500 hover:text-blue-600"
      >
        ← Back to Password Login
      </button>

    </div>
  );
}

export default OtpLoginForm;