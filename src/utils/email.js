import { EMAILJS_CONFIG } from "../config";

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

export function isEmailConfigured() {
  return !EMAILJS_CONFIG.serviceId.startsWith("YOUR_");
}

export async function sendOrderNotification(order, customer) {
  if (!isEmailConfigured()) {
    console.warn("[email] EmailJS not configured. Add your credentials in src/config.js");
    return;
  }

  const itemsHtml = order.items
    .map((i) => `<li>${i.name} x ${i.quantity} - ${formatPrice(i.price * i.quantity)}</li>`)
    .join("");

  const templateParams = {
    to_email: EMAILJS_CONFIG.toEmail,
    customer_name: customer.full_name,
    customer_email: customer.email,
    customer_phone: order.phone || "N/A",
    customer_address: order.shipping_address || "N/A",
    order_id: order.id,
    order_items: itemsHtml,
    order_total: formatPrice(order.total_amount),
    order_date: new Date(order.created_at).toLocaleString(),
  };

  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.serviceId,
        template_id: EMAILJS_CONFIG.templateId,
        user_id: EMAILJS_CONFIG.userId,
        template_params: templateParams,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`EmailJS error ${res.status}: ${text}`);
    }
    console.log("[email] Order notification email sent");
  } catch (err) {
    console.error("[email] Failed to send order email:", err);
  }
}
