import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { SiteConfigDTO } from "../utils/api";

const DEFAULTS: SiteConfigDTO = {
  brand_name: "Bethel",
  brand_accent: "Grill",
  hero_subtitle: "Cuisine authentique & ambiance cel-shading",
  hero_title: "Saveurs puissantes, design audacieux.",
  hero_copy: "Découvrez notre menu premium, commandez en direct et recevez une expérience culinaire visuelle et gourmande.",
  whatsapp_number: "237690788315",
  hero_cta_label: "Voir le menu",
  cart_open_label: "Voir mon panier",
  menu_section_label: "NOS SECTIONS",
  menu_section_title: "Explorez nos créations",
  menu_section_description: "Naviguez parmi nos sections actives et découvrez des plats préparés pour éveiller vos sens.",
  menu_cta_label: "Commander sur WhatsApp",
  cart_clear_text: "Vider le panier",
  cart_header: "Total",
  cart_checkout_label: "Commander via WhatsApp",
};

interface SiteConfigContextType {
  config: SiteConfigDTO;
  loading: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType>({ config: DEFAULTS, loading: true });

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfigDTO>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/config?_=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data) setConfig(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, loading }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
