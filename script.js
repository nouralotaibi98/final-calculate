/* ===== أدوات عامة ===== */
const kwFmt = (n) => (isFinite(n) ? n.toLocaleString("ar-KW", { maximumFractionDigits: 2 }) : "0");

/* ===== حاسبة كفاءة المباني (تصنيف عربي + شريط ألوان) =====
   التصنيف:
     أ : كثافة ≤ 50 kWh/m².year
     ب : 50 < كثافة ≤ 100
     ج : كثافة > 100
*/
function calculateBuilding() {
  const areaEl = document.getElementById("area");
  const consEl = document.getElementById("annualConsumption");
  const resultBox = document.getElementById("result");

  const area = parseFloat(areaEl?.value);
  const consumption = parseFloat(consEl?.value);

  if (!isFinite(area) || area <= 0 || !isFinite(consumption) || consumption <= 0) {
    alert("الرجاء إدخال قيم صحيحة للمساحة والاستهلاك السنوي.");
    return;
  }

  const density = consumption / area; // kWh/m².year

  // التصنيف بالعربي
  let rating = "ج";
  let idx = 2; // موضع المؤشر الافتراضي على (ج)
  if (density <= 50) {
    rating = "أ";
    idx = 0;
  } else if (density <= 100) {
    rating = "ب";
    idx = 1;
  } else {
    rating = "ج";
    idx = 2;
  }

  // تعبئة الـ KPI
  document.getElementById("kpi-area").textContent = `${kwFmt(area)} م²`;
  document.getElementById("kpi-density").textContent = `${density.toFixed(2)} kWh/m²·year`;
  document.getElementById("kpi-rating").textContent = rating;

  // عرض البوكس
  resultBox.style.display = "block";

  // تحريك المؤشر على الشريط
  const scale = document.querySelector(".label-scale-3");
  const needle = document.getElementById("needle");
  if (scale && needle) {
    const colW = scale.clientWidth / 3;
    // المنتصف لكل خانة
    needle.style.left = `${colW * idx + colW / 2}px`;
  }
}

/* خيار لمسح النتائج */
function clearBuilding() {
  const r = document.getElementById("result");
  if (r) r.style.display = "none";
}

/* ===== حاسبة استبدال الأجهزة (كما هي) ===== */
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

/* تشيك سريع أن السكربت اشتغل */
console.log("script.js loaded ✔");
