import React from 'react';
import { ShieldCheck, UploadCloud, GlobeLock, Server } from 'lucide-react';
import { motion } from 'motion/react';

const TRANSLATIONS = {
  en: [
    {
      icon: <ShieldCheck size={24} />,
      title: "256-bit Encryption",
      desc: "Your thoughts belong only to you"
    },
    {
      icon: <UploadCloud size={24} />,
      title: "Export Anytime",
      desc: "Your data is always yours"
    },
    {
      icon: <GlobeLock size={24} />,
      title: "GDPR Compliant",
      desc: "Strict privacy protection"
    },
    {
      icon: <Server size={24} />,
      title: "99.9% Uptime",
      desc: "Your second brain never stops"
    }
  ],
  ko: [
    {
      icon: <ShieldCheck size={24} />,
      title: "256-bit 암호화",
      desc: "당신의 생각은 당신만의 것입니다"
    },
    {
      icon: <UploadCloud size={24} />,
      title: "언제든 Export",
      desc: "데이터는 언제나 당신의 것입니다"
    },
    {
      icon: <GlobeLock size={24} />,
      title: "GDPR 준수",
      desc: "엄격한 개인정보 보호 준수"
    },
    {
      icon: <Server size={24} />,
      title: "99.9% Uptime",
      desc: "제 2의 뇌는 멈추지 않습니다"
    }
  ]
};

export const TrustSignals = ({ language = 'ko' }: { language?: 'en' | 'ko' }) => {
  const signals = TRANSLATIONS[language];

  return (
    <section className="py-20 bg-[#0F172A] border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {signals.map((signal, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-[#21DBA4] mb-4 border border-slate-700">
                {signal.icon}
              </div>
              <h3 className="text-white font-bold mb-2">{signal.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                {signal.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
