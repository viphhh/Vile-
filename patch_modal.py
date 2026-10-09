import re

with open("src/components/PriceAlertModal.tsx", "r") as f:
    content = f.read()

# Add receiveBookingAlerts state
state_injection = """  const [contactValue, setContactValue] = useState<string>(
    existingAlert?.contactValue || ''
  );
  const [receiveBookingAlerts, setReceiveBookingAlerts] = useState<boolean>(
    existingAlert?.receiveBookingAlerts || false
  );
  const [isSuccess, setIsSuccess] = useState(false);"""

content = content.replace("  const [contactValue, setContactValue] = useState<string>(\n    existingAlert?.contactValue || ''\n  );\n  const [isSuccess, setIsSuccess] = useState(false);", state_injection)

# Add it to handleSubmit
submit_old = """      contactValue,
      enabled: true,
    });"""

submit_new = """      contactValue,
      enabled: true,
      receiveBookingAlerts,
    });"""
content = content.replace(submit_old, submit_new)


# Add the checkbox to the UI right after the Contact Input Value block and before Modal Actions
checkbox_ui = """            </div>

            {/* Receive Booking Alerts Checkbox */}
            {contactChannel === 'whatsapp' && (
              <div className="flex items-start gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="receiveBookingAlerts"
                  checked={receiveBookingAlerts}
                  onChange={(e) => setReceiveBookingAlerts(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500/20"
                />
                <label htmlFor="receiveBookingAlerts" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                  تفعيل إرسال إشعارات وتحديثات حالة الحجز مباشرة إلى رقم الواتساب هذا
                </label>
              </div>
            )}

            {/* Modal Actions */}"""
content = content.replace("            </div>\n            {/* Modal Actions */}", checkbox_ui)

with open("src/components/PriceAlertModal.tsx", "w") as f:
    f.write(content)
