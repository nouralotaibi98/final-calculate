/* ================== أدوات عامة ================== */
const kwFmt = (n) =>
  isFinite(n) ? n.toLocaleString("ar-KW", { maximumFractionDigits: 2 }) : "0";

/* سنة الفوتر (لو موجود العنصر) */
(() => {
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* ================== حاسبة كفاءة المباني ==================
   المدخلات من building.html:
   - area               (مساحة المبنى بالمتر المربع)
   - annualConsumption  (الاستهلاك السنوي kWh)

   المطلوب:
   - حساب كثافة الاستهلاك السنوي: density = consumption / area
   - تصنيف عربي من أ → ج فقط:
       أ : كثافة ≤ 50 kWh/m².year
       ب : 50 < كثافة ≤ 100
       ج : كثافة > 100
   - عرض: التصنيف + الكثافة + المساحة
=========================================================== */
function calculateBuilding() {
  const area = parseFloat(document.getElementById("area")?.value);
  const consumption = parseFloat(
    document.getElementById("annualConsumption")?.value
  );

  if (!isFinite(area) || area <= 0 || !isFinite(consumption) || consumption <= 0) {
    alert("الرجاء إدخال قيم صحيحة للمساحة والاستهلاك السنوي.");
    return;
  }

  // كثافة الاستهلاك السنوي (kWh/m².year)
  const density = consumption / area;

  // التصنيف العربي (أ، ب، ج)
  let rating = "ج";
  if (density <= 50) {
    rating = "أ";
  } else if (density <= 100) {
    rating = "ب";
  } else {
    rating = "ج";
  }

  const resultEl = document.getElementById("result");
  if (resultEl) {
    resultEl.innerHTML = `
      <p>تصنيف كفاءة الطاقة: <strong>${rating}</strong></p>
      <p>كثافة الاستهلاك السنوي: <strong>${density.toFixed(2)} kWh/m²·year</strong></p>
      <p>مساحة المبنى: <strong>${kwFmt(area)} م²</strong></p>
    `;
  }
}

/* ================== حاسبة استبدال الأجهزة ==================
   المدخلات من devices.html:
   - oldW      : قدرة الجهاز القديم (واط)
   - newW      : قدرة الجهاز الجديد (واط)
   - hrsDay    : ساعات التشغيل يوميًا
   - daysYear  : أيام التشغيل سنويًا
   - priceKwh  : سعر الكهرباء (د.ك لكل kWh)

   المخرجات:
   - oldKwh/newKwh kWh/سنة
   - saveKwh  kWh سنوي
   - saveKd   د.ك سنوي
   - حفظ 5 و 10 سنوات
============================================================== */
function calcDevices() {
  const oldW = +document.getElementById("oldW").value || 0;
  const newW = +document.getElementById("newW").value || 0;
  const hrs = +document.getElementById("hrsDay").value || 0;
  const days = +document.getElementById("daysYear").value || 0;
  const price = +document.getElementById("priceKwh").value || 0;

  if (oldW <= 0 || newW < 0 || hrs < 0 || days <= 0 || price < 0) {
    alert("الرجاء إدخال قيم صحيحة لجميع الحقول.");
    return;
  }

  // kWh/سنة = (واط / 1000) × ساعات × أيام
  const oldK = (oldW / 1000) * hrs * days;
  const newK = (newW / 1000) * hrs * days;

  const saveK = Math.max(0, oldK - newK);
  const saveD = saveK * price;

  document.getElementById("oldKwh").textContent = `${kwFmt(oldK)} kWh/سنة`;
  document.getElementById("newKwh").textContent = `${kwFmt(newK)} kWh/سنة`;
  document.getElementById("saveKwh").textContent = `${kwFmt(saveK)} kWh`;
  document.getElementById("saveKd").textContent = `${kwFmt(saveD)} د.ك`;
  document.getElementById("save5").textContent = `${kwFmt(saveD * 5)} د.ك`;
  document.getElementById("save10").textContent = `${kwFmt(saveD * 10)} د.ك`;

  document.getElementById("rep-summary").classList.remove("hide");
}

function clearDevices() {
  const sum = document.getElementById("rep-summary");
  if (sum) sum.classList.add("hide");
}