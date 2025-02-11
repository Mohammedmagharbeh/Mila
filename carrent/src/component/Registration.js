import React, { useState } from 'react';
import { postregitrer } from '../back/api';

function RegistrationForm (){

  const [logData, setlogData] = useState({ username: '',email: '', password: '',confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setlogData({ ...logData, [name]: value });
  };

  const postreg = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = logData;

    if (password !== confirmPassword) {
      alert('كلمتا المرور غير متطابقتين، الرجاء المحاولة مرة أخرى.');
      return;
    }

    try {
      const response = await postregitrer({ username, email, password });
            alert('تم التسجيل بنجاح');
    } catch (error) {
      alert('حدث خطأ أثناء إرسال البيانات، الرجاء المحاولة مرة أخرى.');
    }
  };

  return (
    <form onSubmit={postreg} style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اسم المستخدم</label>
      <input type="text" name="username" value={logData.username} onChange={handleChange} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }} />
      
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>البريد الإلكتروني</label>
      <input type="email"name="email" value={logData.email}  onChange={handleChange}  style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }} />
      
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>كلمة المرور</label>
      <input type="password"name="password"   value={logData.password} onChange={handleChange}    style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }} />
      
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>تأكيد كلمة المرور</label>
      <input
        type="password" name="confirmPassword" value={logData.confirmPassword} onChange={handleChange}     style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }} />
      
      <button
        type="submit"
        style={{
          width: '100%',padding: '12px',backgroundColor: '#4caf50',color: 'white',borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', }} >
        تسجيل
      </button>
    </form>
  );
}
;

export default RegistrationForm;
