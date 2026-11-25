import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, ArrowRight, CheckCircle2, Smartphone, ChevronLeft, AlertCircle } from "lucide-react";
import { fields, REGISTRATION_FEE, EVENT } from "../../data/siteData.js";
import { FloatingInput } from "./FloatingInput.jsx";
import { confetti } from "../ui/Showtime.jsx";
import { createRegistration, submitPaymentReference } from "../../lib/payments.js";

const STEPS = ["Nominee details", "Payment", "Submitted"];
const rupees = amount => `₹${amount.toLocaleString("en-IN")}`;

export function RegistrationForm({ onClose, initialCategory = "" }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [payState, setPayState] = useState("idle");
  const [payment, setPayment] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [upiPromptOpen, setUpiPromptOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: initialCategory,
    bio: ""
  });

  const busy = payState !== "idle";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEscape = event => {
      if (event.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [onClose, busy]);

  const update = (key, value) => {
    setError("");
    setPayment(null);
    setQrCode("");
    setPaymentReference("");
    setForm(previous => ({ ...previous, [key]: value }));
  };

  const proceed = event => {
    event.preventDefault();
    if (form.name.trim().length < 2) return setError("Enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return setError("Enter a valid email address, like name@example.com.");
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) return setError("Enter a valid 10-digit mobile number.");
    if (!form.category) return setError("Choose a recognition field.");
    if (form.bio.trim().length < 20) return setError("Add a short nominee bio (at least 20 characters).");
    setError("");
    setStep(2);
  };

  const createPayment = async () => {
    setError("");
    setPayState("creating");
    try {
      let details = payment;
      if (!details) {
        details = await createRegistration({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          category: form.category,
          bio: form.bio.trim()
        });
        setPayment(details);
      }
      if (!qrCode) {
        const image = await QRCode.toDataURL(details.upiUri, { width: 220, margin: 1 });
        setQrCode(image);
      }
    } catch (paymentError) {
      if (paymentError?.fields) {
        setStep(1);
        setPayment(null);
        setError(Object.values(paymentError.fields)[0] || paymentError.message);
      } else {
        setError(paymentError?.message || "Couldn’t prepare your UPI payment. Please try again.");
      }
    } finally {
      setPayState("idle");
    }
  };

  const submitReference = async event => {
    event.preventDefault();
    setError("");
    setPayState("submitting");
    try {
      const result = await submitPaymentReference(payment.registrationId, paymentReference.trim());
      setReceipt(result);
      setStep(3);
      confetti();
    } catch (submitError) {
      setError(submitError?.message || "Couldn’t submit your payment reference. Please try again.");
    } finally {
      setPayState("idle");
    }
  };

  const payLabel = payState === "creating" ? "Preparing UPI payment…" : "Submitting reference…";

  return (
    <div className="lba-registration-overlay" onClick={busy ? undefined : onClose}>
      <div
        className="lba-registration-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Nomination entry"
        onClick={event => event.stopPropagation()}
      >
        {!busy && (
          <button type="button" className="lba-modal-close" onClick={onClose} aria-label="Close nomination form">
            <X size={22} />
          </button>
        )}

        <div className="lba-registration-header">
          <p className="kicker">Legendary Business Awards 2026</p>
          <h2>{["Nomination entry", "Pay by UPI", "Nomination submitted"][step - 1]}</h2>
          <p>
            {
              [
                "Share your contact details and a short nominee bio before continuing to payment.",
                "Scan the QR code or open your UPI app, then submit your transaction reference.",
                "Your nomination is saved. The team will verify your payment and confirm it."
              ][step - 1]
            }
          </p>
        </div>

        <ol className="lba-step-indicator" aria-label="Nomination progress">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 && <li className="lba-step-line" aria-hidden="true" />}
              <li className={step >= i + 1 ? "active" : ""} aria-current={step === i + 1 ? "step" : undefined}>
                <span>{i + 1}</span> {label}
              </li>
            </React.Fragment>
          ))}
        </ol>

        {error && (
          <div className="lba-form-error" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <form className="lba-registration-form" onSubmit={proceed} noValidate>
            <FloatingInput
              id="reg-name"
              label="Full Name"
              value={form.name}
              autoComplete="name"
              onChange={event => update("name", event.target.value)}
            />
            <FloatingInput
              id="reg-email"
              label="Email Address"
              type="email"
              value={form.email}
              autoComplete="email"
              onChange={event => update("email", event.target.value)}
            />
            <FloatingInput
              id="reg-phone"
              label="Mobile Number"
              type="tel"
              value={form.phone}
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              onChange={event => update("phone", event.target.value.replace(/\D/g, ""))}
            />
            <div className="lba-floating-field">
              <select
                id="reg-category"
                required
                value={form.category}
                onChange={event => update("category", event.target.value)}
              >
                <option value="" disabled hidden>
                  Select a category
                </option>
                {fields.map(([title]) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
              <label htmlFor="reg-category" className="has-value">
                Recognition Field <span>*</span>
              </label>
            </div>
            <div className="lba-floating-field">
              <textarea
                id="reg-bio"
                required
                placeholder=" "
                rows={4}
                maxLength={1500}
                value={form.bio}
                onChange={event => update("bio", event.target.value)}
              />
              <label htmlFor="reg-bio">Nominee bio (20–1,500 characters)</label>
            </div>

            <button className="btn btn--solid btn--block" type="submit">
              Continue to nomination entry <ArrowRight size={19} />
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="lba-payment-step">
            <div className="lba-payment-summary">
              <div className="lba-summary-title">
                <CheckCircle2 size={22} /> Nominee details
              </div>
              {[
                ["Full name", form.name],
                ["Email", form.email],
                ["Mobile", form.phone],
                ["Award category", form.category],
                ["Nominee bio", form.bio]
              ].map(([label, value]) => (
                <div className="lba-summary-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="lba-payment-amount">
              <div>
                <span>Nomination fee</span>
                <strong>{rupees(REGISTRATION_FEE)}</strong>
              </div>
              <div className="lba-payment-total">
                <span>Total</span>
                <strong>{rupees(REGISTRATION_FEE)}</strong>
              </div>
            </div>

            {!payment ? (
              <button
                type="button"
                className="btn btn--solid btn--block"
                onClick={createPayment}
                disabled={busy}
                aria-busy={busy}
              >
                {busy ? <span className="spinner" aria-hidden="true" /> : <Smartphone size={19} />}
                {busy ? payLabel : "Show UPI payment options"}
              </button>
            ) : (
              <>
                <div className="lba-upi-payment">
                  <p className="lba-upi-instruction">Scan this QR code using any UPI payment app</p>
                  {qrCode && <img className="lba-upi-qr" src={qrCode} alt="UPI payment QR code" />}
                  <p className="lba-upi-vpa">
                    Pay to <strong>{payment.upiName}</strong>
                    <br />
                    <strong>{payment.upiVpa}</strong>
                  </p>
                  <button
                    type="button"
                    className="btn btn--solid btn--block"
                    onClick={() => setUpiPromptOpen(true)}
                  >
                    <Smartphone size={19} /> Open UPI app
                  </button>
                </div>
                <form className="lba-registration-form" onSubmit={submitReference}>
                  <FloatingInput
                    id="reg-payment-reference"
                    label="UPI transaction reference / UTR"
                    value={paymentReference}
                    autoComplete="off"
                    maxLength={100}
                    onChange={event => setPaymentReference(event.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn--solid btn--block"
                    disabled={busy || paymentReference.trim().length < 6}
                    aria-busy={busy}
                  >
                    {busy ? <span className="spinner" aria-hidden="true" /> : <CheckCircle2 size={19} />}
                    {busy ? payLabel : "I’ve paid — submit reference"}
                  </button>
                </form>
              </>
            )}

            {!busy && (
              <button
                type="button"
                className="lba-back-btn"
                onClick={() => {
                  setError("");
                  setStep(1);
                }}
              >
                <ChevronLeft size={18} /> Edit details
              </button>
            )}

            <p className="lba-form-disclaimer">
              Payment is not confirmed automatically. Your nomination stays pending until the team verifies your UPI
              transaction reference.
            </p>
            {upiPromptOpen && (
              <div className="lba-upi-prompt-backdrop" onClick={() => setUpiPromptOpen(false)}>
                <div
                  className="lba-upi-prompt"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="upi-prompt-title"
                  onClick={event => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="lba-modal-close"
                    onClick={() => setUpiPromptOpen(false)}
                    aria-label="Close UPI payment instructions"
                  >
                    <X size={20} />
                  </button>
                  <Smartphone className="lba-upi-prompt-icon" size={32} aria-hidden="true" />
                  <h3 id="upi-prompt-title">Before you open your UPI app</h3>
                  <p>
                    After a successful payment, return to this page and enter your UTR / transaction reference in the
                    field below. Your payment is confirmed only after our team verifies it.
                  </p>
                  <div className="lba-upi-prompt-actions">
                    <a
                      className="btn btn--solid btn--block"
                      href={payment.upiUri}
                      onClick={() => setUpiPromptOpen(false)}
                    >
                      Continue to UPI app <ArrowRight size={18} />
                    </a>
                    <button
                      type="button"
                      className="btn btn--ghost btn--block"
                      onClick={() => setUpiPromptOpen(false)}
                    >
                      I’ll scan the QR code
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && receipt && (
          <div className="lba-payment-step lba-success">
            <div className="lba-success-badge" aria-hidden="true">
              <CheckCircle2 size={40} />
            </div>
            <div className="lba-payment-summary">
              {[
                ["Name", form.name],
                ["Recognition field", receipt.category || form.category],
                ["Amount", rupees((receipt.amount || REGISTRATION_FEE * 100) / 100)],
                ["UPI reference", receipt.paymentReference],
                ["Nomination ID", receipt.registrationId],
                ["Status", "Payment submitted — awaiting verification"]
              ].map(([label, value]) => (
                <div className="lba-summary-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <p className="lba-form-disclaimer">
              We’ll contact you at {form.email} after verifying your payment. For help, contact {EVENT.phone}. See you
              on {EVENT.dateLabel} at {EVENT.venue}.
            </p>
            <button type="button" className="btn btn--solid btn--block" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
