import React, { useState, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Contact.css';
import emailjs from '@emailjs/browser';
import linkedIn01 from '../../assets/svg/linkedIn01.svg';
import github01 from '../../assets/svg/github01.svg';
import behance01 from '../../assets/svg/behance01.svg';
import wpp01 from '../../assets/svg/wpp01.svg';

const Contact = () => {
  const { t } = useTranslation("global");

  const contact = {
    name: "contact.name",
    email: "contact.email",
    subject: "contact.subject",
    send: "contact.send",
    requiredFields: "contact.requiredFields",
    invalidEmail: "contact.invalidEmail",
    formSubmitted: "contact.formSubmitted",
    formError: "contact.formError"
  };

  const form = useRef();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    const formData = new FormData(form.current);
    const values = Object.fromEntries(formData.entries());

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;

    const requiredFieldsError = t(contact.requiredFields);
    const errors = {};

    Object.entries(values).forEach(([fieldName, value]) => {
      if (value.trim() === "") {
        errors[fieldName] = requiredFieldsError;
      } else if (fieldName === "user_email" && !emailPattern.test(value)) {
        errors[fieldName] = t(contact.invalidEmail);
      }
    });

    if (Object.keys(errors).length === 0) {
      try {
        await emailjs.sendForm(
          import.meta.env.VITE_SERVICE_ID,
          import.meta.env.VITE_TEMPLATE_ID,
          form.current,
          import.meta.env.VITE_PUBLIC_KEY
        );
        toast.success(t(contact.formSubmitted));
        form.current.reset();
        setErrors({});
      } catch (error) {
        toast.error(t(contact.formError));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(errors);
      setIsSubmitting(false);
    }
  };

  return (
    <div className='contact bg-color'>
      <div className='container'>
        <h3>{t("navbar.contact")}</h3>
        <form ref={form} onSubmit={sendEmail} className='form'>

          <div className="form-group">
            <input type="text" placeholder={t(contact.name)} name='user_name' className='input' />
            {errors.user_name && <p className="error-message">{errors.user_name}</p>}
          </div>

          <div className="form-group">
            <input type="text" placeholder={t(contact.email)} name='user_email' className='input' />
            {errors.user_email && <p className="error-message">{errors.user_email}</p>}
          </div>

          <div className="form-group">
            <input type="text" placeholder={t(contact.subject)} name='subject' className='input' />
            {errors.subject && <p className="error-message">{errors.subject}</p>}
          </div>

          <div className="form-group">
            <textarea name='message' className='textarea' cols="30" rows="10" />
            {errors.message && <p className="error-message">{errors.message}</p>}
          </div>

          <button type='submit' disabled={isSubmitting}>{isSubmitting ? t("contact.sending") : t(contact.send)}</button>

        </form>
        <div className='social-media'>
          <a className="icon" href="https://www.linkedin.com/in/sandro-ramirez/" target="_blank" rel="noopener noreferrer"><img src={linkedIn01} alt="LinkedIn" /></a>
          <a className="icon" href="https://github.com/Sandro96" target="_blank" rel="noopener noreferrer"><img src={github01} alt="Github" /></a>
          <a className="icon" href="https://www.behance.net/sandroramirez14" target="_blank" rel="noopener noreferrer"><img src={behance01} alt="Behance" /></a>
          <a className="icon" href="https://wa.me/598094095078" target="_blank" rel="noopener noreferrer"><img src={wpp01} alt="WhatsApp" /></a>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />

    </div>
  );
};

export default Contact;