import React, { useState } from 'react';
import { postregitrer } from '../back/api';
import '../css/registrerion.css';
import { useNavigate } from 'react-router-dom';



// دالة لحساب قوة كلمة المرور
function calculatePasswordStrength(password) {
  let strength = 0;
  if (password.length >= 6) strength++; // شرط الطول الأساسي
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++; // وجود حرف كبير
  if (/[0-9]/.test(password)) strength++; // وجود رقم
  if (/[^A-Za-z0-9]/.test(password)) strength++; // وجود رمز خاص
  return strength;
}
// دالة لتحديد لون الشريط بناءً على القوة
function getStrengthColor(strength) {
  switch (strength) {
    case 1: return '#ff4d4d'; // أحمر - ضعيف
    case 2: return '#ff944d'; // برتقالي - متوسط
    case 3: return '#ffdb4d'; // أصفر - جيد
    case 4: return '#a3ff4d'; // أخضر فاتح - قوي
    case 5: return '#4dff4d'; // أخضر - ممتاز
    default: return '#ddd';  // لون افتراضي
  }
}

function RegistrationForm() {
  if (window.location.pathname === '/Registration') {
    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1556448851-9359658faa54?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fHJlZ2lzdHJhdGlvbiUyMGNhcnxlbnwwfHwwfHx8MA%3D%3D')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
  }
  const [logData, setlogData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setlogData({ ...logData, [name]: value });
  };

  const postreg = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = logData;
    
    // التحقق من تطابق كلمتي المرور
    if (password !== confirmPassword) {
      alert('كلمتا المرور غير متطابقتين، الرجاء المحاولة مرة أخرى.');
      return;
    }

    // حساب قوة كلمة المرور
    const passwordStrength = calculatePasswordStrength(password);
    // السماح بالتسجيل فقط إذا كانت كلمة المرور قوية أو ممتازة (أي قيمة 4 أو 5)
    if (passwordStrength < 4) {
      alert('كلمة المرور ضعيفة. الرجاء اختيار كلمة مرور قوية أو ممتازة للتسجيل.');
      return;
    }

    try {
      await postregitrer({ username, email, password });
      alert('تم التسجيل بنجاح');
    } catch (error) {
      // يمكنك التعامل مع الخطأ هنا عند حدوث مشكلة أثناء التسجيل
    }
  };

  // حساب قوة كلمة المرور لتحديث مؤشر القوة
  const passwordStrength = calculatePasswordStrength(logData.password);
  const strengthPercent = (passwordStrength / 5) * 100;
  const strengthColor = getStrengthColor(passwordStrength);

  // تحديد تسمية للقوة
  let strengthLabel = "";
  if (passwordStrength <= 1) strengthLabel = "ضعيف";
  else if (passwordStrength === 2) strengthLabel = "متوسط";
  else if (passwordStrength === 3) strengthLabel = "جيد";
  else if (passwordStrength === 4) strengthLabel = "قوي";
  else if (passwordStrength === 5) strengthLabel = "ممتاز";

  return (
    <div className="registration-container">
      <div className="animated-banner">
        <span className="car"></span>
        <span className="stars"></span>
      </div>
      <form onSubmit={postreg} className="registration-form">
        <label>اسم المستخدم</label>
        <input type="text" name="username" value={logData.username} onChange={handleChange} />

        <label>البريد الإلكتروني</label>
        <input type="email" name="email" value={logData.email} onChange={handleChange} />

        <label>كلمة المرور</label>
        <input type="password" name="password" value={logData.password} onChange={handleChange} />
        {/* مؤشر قوة كلمة المرور */}
        <div className="password-strength-meter">
          <div
            className="strength-bar"
            style={{
              width: `${strengthPercent}%`,
              backgroundColor: strengthColor,
              transition: 'width 0.5s ease'
            }}
          ></div>
        </div>
        <span className="strength-label">{strengthLabel}</span>

        <label>تأكيد كلمة المرور</label>
        <input type="password" name="confirmPassword" value={logData.confirmPassword} onChange={handleChange} />

        <button type="submit" className="register-btn">تسجيل</button>
        <button type="button" className="login-btn" onClick={() => navigate('/login')}>الانتقال إلى تسجيل الدخول</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
