
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../App';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="text-right rtl:text-right ltr:text-left">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">{t.contact.badge}</h2>
            <p className="text-4xl font-extrabold text-slate-900 mb-8">{t.contact.title}</p>
            
            <div className="space-y-8 mt-12">
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.contact.addrLabel}</h4>
                  <p className="text-slate-500">{t.contact.addrVal}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.contact.phoneLabel}</h4>
                  <p className="text-slate-500" dir="ltr">400-888-XXXX / 021-XXXXXXX</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.contact.emailLabel}</h4>
                  <p className="text-slate-500">sales@hkbr-rfid.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.contact.form.name}</label>
                  <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-right rtl:text-right ltr:text-left" placeholder={t.contact.form.namePh} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.contact.form.company}</label>
                  <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-right rtl:text-right ltr:text-left" placeholder={t.contact.form.companyPh} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t.contact.form.contact}</label>
                <input type="tel" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-right rtl:text-right ltr:text-left" placeholder={t.contact.form.contactPh} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t.contact.form.msg}</label>
                <textarea rows={4} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-right rtl:text-right ltr:text-left" placeholder={t.contact.form.msgPh}></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                {t.contact.form.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
