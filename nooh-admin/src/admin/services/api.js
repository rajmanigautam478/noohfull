/**
 * api.js
 * ---------------------------------------------------------------------------
 * This is the ONLY file your components should import data functions from.
 * Today it re-exports the localStorage-backed mock layer in storage.js.
 *
 * WHEN YOUR BACKEND IS READY:
 * Replace the body of each function below with a real `fetch`/axios call.
 * Nothing in any page or component needs to change, because the function
 * names and return shapes stay identical.
 *
 * Example of what this file looks like after the swap (Express + MongoDB):
 *
 *   const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
 *
 *   export const servicesApi = {
 *     list: () => fetch(`${BASE_URL}/services`).then((r) => r.json()),
 *     get: (id) => fetch(`${BASE_URL}/services/${id}`).then((r) => r.json()),
 *     create: (data) =>
 *       fetch(`${BASE_URL}/services`, {
 *         method: "POST",
 *         headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
 *         body: JSON.stringify(data),
 *       }).then((r) => r.json()),
 *     update: (id, data) =>
 *       fetch(`${BASE_URL}/services/${id}`, {
 *         method: "PUT",
 *         headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
 *         body: JSON.stringify(data),
 *       }).then((r) => r.json()),
 *     remove: (id) =>
 *       fetch(`${BASE_URL}/services/${id}`, {
 *         method: "DELETE",
 *         headers: { Authorization: `Bearer ${getToken()}` },
 *       }).then((r) => r.json()),
 *   };
 *
 * Repeat the same pattern for productsApi, projectsApi, testimonialsApi,
 * inquiriesApi, heroApi, settingsApi, dashboardApi.
 */

export {
  servicesApi,
  productsApi,
  projectsApi,
  testimonialsApi,
  inquiriesApi,
  heroApi,
  settingsApi,
  activityApi,
  dashboardApi,
} from "./storage";
