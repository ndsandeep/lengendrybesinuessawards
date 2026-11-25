import { collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore/lite";
import { REGISTRATION_FEE } from "../data/siteData.js";
import { getFirebaseDatabase } from "./firebase.js";

const CURRENCY = "INR";

function getUpiDetails() {
  const vpa = import.meta.env.VITE_UPI_VPA?.trim();
  const name = import.meta.env.VITE_UPI_NAME?.trim();
  if (!vpa || !/^[\w.-]{2,256}@[\w.-]{2,64}$/.test(vpa)) {
    throw new Error("Set a valid VITE_UPI_VPA in frontend/.env.");
  }
  if (!name) throw new Error("Set VITE_UPI_NAME in frontend/.env.");
  return { vpa, name };
}

export async function createRegistration(details) {
  const database = getFirebaseDatabase();
  const { vpa, name } = getUpiDetails();
  const registration = doc(collection(database, "registrations"));
  const amount = REGISTRATION_FEE * 100;

  await setDoc(registration, {
    name: details.name.trim(),
    email: details.email.trim().toLowerCase(),
    phone: details.phone.trim(),
    bio: details.bio.trim(),
    category: details.category,
    amount,
    currency: CURRENCY,
    upiVpa: vpa,
    upiName: name,
    status: "awaiting_payment",
    paymentReference: null,
    paymentSubmittedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  const upiUri = `upi://pay?${new URLSearchParams({
    pa: vpa,
    pn: name,
    am: (amount / 100).toFixed(2),
    cu: CURRENCY,
    tn: `LBA 2026 ${registration.id}`
  })}`;

  return {
    registrationId: registration.id,
    amount,
    currency: CURRENCY,
    upiVpa: vpa,
    upiName: name,
    upiUri
  };
}

export async function submitPaymentReference(registrationId, paymentReference) {
  const reference = paymentReference.trim();
  if (reference.length < 6 || reference.length > 100) {
    throw new Error("Enter a valid UPI transaction reference (6–100 characters).");
  }

  const database = getFirebaseDatabase();
  await updateDoc(doc(database, "registrations", registrationId), {
    status: "payment_submitted",
    paymentReference: reference,
    paymentSubmittedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return {
    registrationId,
    status: "payment_submitted",
    category: "",
    amount: REGISTRATION_FEE * 100,
    currency: CURRENCY,
    paymentReference: reference
  };
}
