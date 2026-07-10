import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { verifyCustomer, type CustomerVerifyDTO } from "../utils/api";

const CUSTOMER_COOKIE = "bethel-customer";
const CONSENT_COOKIE = "bethel-consent";
const COOKIE_EXPIRY = 365;

export interface CustomerCookieData {
  customer_id: number;
  name: string;
  phone: string;
}

export function useCustomerCookie() {
  const [showConsent, setShowConsent] = useState(false);
  const [savedCustomer, setSavedCustomer] = useState<CustomerVerifyDTO | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const consent = Cookies.get(CONSENT_COOKIE);
    const raw = Cookies.get(CUSTOMER_COOKIE);

    if (consent !== "true" && consent !== "false") {
      setShowConsent(true);
    }

    (async () => {
      if (raw) {
        try {
          const data: CustomerCookieData = JSON.parse(raw);
          const customer = await verifyCustomer(data.customer_id, data.phone);
          if (customer) {
            setSavedCustomer(customer);
          } else {
            Cookies.remove(CUSTOMER_COOKIE);
          }
        } catch {
          Cookies.remove(CUSTOMER_COOKIE);
        }
      }
      setReady(true);
    })();
  }, []);

  const acceptConsent = useCallback(() => {
    Cookies.set(CONSENT_COOKIE, "true", { expires: COOKIE_EXPIRY });
    setShowConsent(false);
  }, []);

  const declineConsent = useCallback(() => {
    Cookies.set(CONSENT_COOKIE, "false", { expires: COOKIE_EXPIRY });
    setShowConsent(false);
  }, []);

  const saveCustomer = useCallback((data: CustomerCookieData) => {
    Cookies.set(CUSTOMER_COOKIE, JSON.stringify(data), { expires: COOKIE_EXPIRY });
    setSavedCustomer({
      id: data.customer_id,
      name: data.name,
      phone: data.phone,
      order_count: 0,
      loyalty_tier: "Nouveau",
      loyalty_color: "#6B6357",
    });
  }, []);

  const clearSavedCustomer = useCallback(() => {
    Cookies.remove(CUSTOMER_COOKIE);
    setSavedCustomer(null);
  }, []);

  return {
    showConsent,
    savedCustomer,
    ready,
    acceptConsent,
    declineConsent,
    saveCustomer,
    clearSavedCustomer,
  };
}
