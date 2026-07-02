/**
 * storage.js
 * ---------------------------------------------------------------------------
 * Temporary persistence layer for the NOOH Admin Panel.
 *
 * Right now this reads/writes to localStorage so the admin panel is fully
 * usable before a real backend exists. Every function returns a Promise,
 * matching the shape a real `fetch`/axios call would have — so when your
 * backend is ready, you only need to rewrite the bodies of these functions
 * (in api.js, which calls this file) and nothing in your components changes.
 *
 * Swap plan: see api.js for the matching real-endpoint version, commented
 * out, for each function below.
 */

const DELAY = 250; // simulated network latency

const wait = (ms = DELAY) => new Promise((res) => setTimeout(res, ms));

const KEYS = {
  services: "nooh_admin_services",
  products: "nooh_admin_products",
  projects: "nooh_admin_projects",
  testimonials: "nooh_admin_testimonials",
  inquiries: "nooh_admin_inquiries",
  hero: "nooh_admin_hero",
  settings: "nooh_admin_settings",
  activity: "nooh_admin_activity",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function logActivity(message) {
  const list = read(KEYS.activity, []);
  list.unshift({ id: uid(), message, date: new Date().toISOString() });
  write(KEYS.activity, list.slice(0, 50));
}

// ---------------------------------------------------------------------------
// Seed data — shown the first time the admin panel runs so it isn't empty.
// ---------------------------------------------------------------------------
const SEED = {
  [KEYS.services]: [
    {
      id: uid(),
      title: "Stretch Ceiling Solutions",
      category: "Ceilings",
      description:
        "Premium stretch ceiling systems with endless design possibilities. Perfect for creating stunning architectural features.",
      features: [
        "Textile Stretch Ceiling",
        "Translucent Stretch Ceiling",
        "Custom Printed Designs",
        "Quick Installation",
      ],
      images: [],
      ctaText: "Get Quote",
      ctaLink: "/contact",
      order: 1,
    },
    {
      id: uid(),
      title: "Fiber Optic Star Ceiling",
      category: "Ceilings",
      description:
        "Transform your ceilings into a mesmerizing night sky with our NOOHSTAR fiber optic systems.",
      features: ["Galaxy Ceiling Effects", "Customizable Star Patterns"],
      images: [],
      ctaText: "Get Quote",
      ctaLink: "/contact",
      order: 2,
    },
  ],
  [KEYS.products]: [],
  [KEYS.projects]: [],
  [KEYS.testimonials]: [],
  [KEYS.inquiries]: [],
  [KEYS.hero]: [
    {
      id: uid(),
      heading: "Living Elevated",
      subheading: "Premium interior solutions crafted around you.",
      image: "",
      ctaText: "Get Consultation",
      ctaLink: "/contact",
      order: 1,
    },
  ],
  [KEYS.settings]: {
    companyName: "NOOH",
    tagline: "Living Elevated",
    email: "info@noohliving.com",
    phone: "+91 00000 00000",
    address: "",
    social: { facebook: "", instagram: "", linkedin: "", whatsapp: "" },
  },
};

function ensureSeeded() {
  Object.entries(SEED).forEach(([key, value]) => {
    if (localStorage.getItem(key) === null) write(key, value);
  });
}
ensureSeeded();

// ---------------------------------------------------------------------------
// Generic CRUD factory — used for services, products, projects, testimonials
// ---------------------------------------------------------------------------
function makeResource(key, label) {
  return {
    async list() {
      await wait();
      return read(key, []).sort((a, b) => (a.order || 0) - (b.order || 0));
    },
    async get(id) {
      await wait();
      return read(key, []).find((item) => item.id === id) || null;
    },
    async create(data) {
      await wait();
      const list = read(key, []);
      const item = { id: uid(), ...data, order: list.length + 1 };
      list.push(item);
      write(key, list);
      logActivity(`${label} "${data.title || data.name}" was added`);
      return item;
    },
    async update(id, data) {
      await wait();
      const list = read(key, []);
      const idx = list.findIndex((item) => item.id === id);
      if (idx === -1) throw new Error(`${label} not found`);
      list[idx] = { ...list[idx], ...data, id };
      write(key, list);
      logActivity(`${label} "${data.title || data.name}" was updated`);
      return list[idx];
    },
    async remove(id) {
      await wait();
      const list = read(key, []);
      const target = list.find((item) => item.id === id);
      write(key, list.filter((item) => item.id !== id));
      if (target) logActivity(`${label} "${target.title || target.name}" was deleted`);
      return true;
    },
  };
}

export const servicesApi = makeResource(KEYS.services, "Service");
export const productsApi = makeResource(KEYS.products, "Product");
export const projectsApi = makeResource(KEYS.projects, "Project");
export const testimonialsApi = makeResource(KEYS.testimonials, "Testimonial");

// ---------------------------------------------------------------------------
// Inquiries — list/update status only (created by the public contact form)
// ---------------------------------------------------------------------------
export const inquiriesApi = {
  async list() {
    await wait();
    return read(KEYS.inquiries, []).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  },
  async markStatus(id, status) {
    await wait();
    const list = read(KEYS.inquiries, []);
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Inquiry not found");
    list[idx].status = status;
    write(KEYS.inquiries, list);
    logActivity(`Inquiry from "${list[idx].name}" marked as ${status}`);
    return list[idx];
  },
  async remove(id) {
    await wait();
    const list = read(KEYS.inquiries, []);
    write(KEYS.inquiries, list.filter((item) => item.id !== id));
    return true;
  },
  // Helper for demo/testing — your real contact form will POST here instead.
  async _seedDemoInquiry(data) {
    const list = read(KEYS.inquiries, []);
    list.unshift({ id: uid(), status: "new", date: new Date().toISOString(), ...data });
    write(KEYS.inquiries, list);
    return true;
  },
};

// ---------------------------------------------------------------------------
// Hero banner — ordered list of slides
// ---------------------------------------------------------------------------
export const heroApi = {
  async list() {
    await wait();
    return read(KEYS.hero, []).sort((a, b) => (a.order || 0) - (b.order || 0));
  },
  async create(data) {
    await wait();
    const list = read(KEYS.hero, []);
    const item = { id: uid(), ...data, order: list.length + 1 };
    list.push(item);
    write(KEYS.hero, list);
    logActivity(`Hero slide "${data.heading}" was added`);
    return item;
  },
  async update(id, data) {
    await wait();
    const list = read(KEYS.hero, []);
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Slide not found");
    list[idx] = { ...list[idx], ...data, id };
    write(KEYS.hero, list);
    logActivity(`Hero slide "${data.heading}" was updated`);
    return list[idx];
  },
  async remove(id) {
    await wait();
    const list = read(KEYS.hero, []);
    write(KEYS.hero, list.filter((item) => item.id !== id));
    return true;
  },
};

// ---------------------------------------------------------------------------
// Settings — single object
// ---------------------------------------------------------------------------
export const settingsApi = {
  async get() {
    await wait();
    return read(KEYS.settings, SEED[KEYS.settings]);
  },
  async update(data) {
    await wait();
    write(KEYS.settings, data);
    logActivity("Company settings were updated");
    return data;
  },
};

export const activityApi = {
  async list() {
    await wait(100);
    return read(KEYS.activity, []);
  },
};

export const dashboardApi = {
  async stats() {
    await wait();
    return {
      services: read(KEYS.services, []).length,
      products: read(KEYS.products, []).length,
      projects: read(KEYS.projects, []).length,
      testimonials: read(KEYS.testimonials, []).length,
      inquiries: read(KEYS.inquiries, []).length,
      newInquiries: read(KEYS.inquiries, []).filter((i) => i.status === "new").length,
    };
  },
};
