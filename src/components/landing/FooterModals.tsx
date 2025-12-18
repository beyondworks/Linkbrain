import React, { useState } from 'react';
import { X, Mail, Phone, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../Logo';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ko';
}

const ModalOverlay = ({ children, isOpen, onClose }: { children: React.ReactNode, isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl z-[101] p-6 md:p-8"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-full"
            >
              <X size={20} />
            </button>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const PrivacyPolicyModal = ({ isOpen, onClose, language }: ModalProps) => {
  const content = {
    en: {
      title: "Privacy Policy",
      sections: [
        {
          title: "1. Collection Items",
          content: `Linkbrain collects the following information for service provision:
• Sign up & Authentication: Email address, User Identifier (UID), Social Login Provider Information (Google, etc.)
• Service Usage: User-saved links (URLs), Content extracted and refined from links, User's collection and memo information
• Payment (Stripe): Payment status information, Subscription plan information
※ Card information is not stored on Linkbrain servers and is processed directly by Stripe.`
        },
        {
          title: "2. Purpose of Use",
          content: `Collected information is used only for the following purposes:
• User identification and authentication
• Link saving and archiving service provision
• AI-based content analysis and insight generation
• Subscription billing and usage right management
• Service quality improvement and error analysis`
        },
        {
          title: "3. Retention Period",
          content: `• Upon membership withdrawal: Destroyed immediately
• If retention is required by law: In accordance with relevant laws`
        },
        {
          title: "4. Third Party Provision",
          content: `Linkbrain does not provide personal information to third parties except in the following cases:
• Essential outsourcing for service provision: Firebase (Google LLC) – Authentication & Database, Stripe – Payment Processing, OpenAI – AI Analysis (Only anonymized text data is used)`
        },
        {
          title: "5. Protection Measures",
          content: `• HTTPS encrypted communication
• Minimized access rights
• No external storage of payment information
• Internal access log management`
        },
        {
          title: "6. User Rights",
          content: `Users can request the following at any time:
• View personal information
• Correction
• Deletion
• Suspension of processing`
        },
        {
          title: "7. Contact",
          content: `• Email: beyondworks.br@gmail.com`
        }
      ]
    },
    ko: {
      title: "개인정보처리방침",
      sections: [
        {
          title: "1. 개인정보의 수집 항목",
          content: `Linkbrain은 서비스 제공을 위해 아래와 같은 정보를 수집합니다.
• 회원가입 및 인증 시: 이메일 주소, 사용자 식별자(UID), 소셜 로그인 제공자 정보 (Google 등)
• 서비스 이용 시: 사용자가 저장한 링크(URL), 링크에서 추출·정제된 콘텐츠 데이터, 사용자의 컬렉션 및 메모 정보
• 결제 시 (Stripe): 결제 상태 정보, 구독 플랜 정보
※ 카드 정보는 Linkbrain 서버에 저장되지 않으며, Stripe에서 직접 처리됩니다.`
        },
        {
          title: "2. 개인정보의 이용 목적",
          content: `수집한 정보는 다음 목적에만 사용됩니다.
• 회원 식별 및 인증
• 링크 저장 및 아카이빙 서비스 제공
• AI 기반 콘텐츠 분석 및 인사이트 생성
• 구독 결제 및 이용 권한 관리
• 서비스 품질 개선 및 오류 분석`
        },
        {
          title: "3. 개인정보 보관 및 이용 기간",
          content: `• 회원 탈퇴 시: 즉시 파기
• 법령에 따라 보관이 필요한 경우: 관련 법령에 따름`
        },
        {
          title: "4. 개인정보의 제3자 제공",
          content: `Linkbrain은 아래의 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다.
• 서비스 제공을 위한 필수 위탁: Firebase (Google LLC) – 인증 및 데이터베이스, Stripe – 결제 처리, OpenAI – AI 분석 (비식별화된 텍스트 데이터만 사용)`
        },
        {
          title: "5. 개인정보 보호 조치",
          content: `• HTTPS 암호화 통신
• 접근 권한 최소화
• 외부 결제 정보 미보관
• 내부 접근 로그 관리`
        },
        {
          title: "6. 이용자의 권리",
          content: `사용자는 언제든지 다음을 요청할 수 있습니다.
• 개인정보 열람
• 수정
• 삭제
• 처리 정지`
        },
        {
          title: "7. 문의처",
          content: `• 이메일: beyondworks.br@gmail.com`
        }
      ]
    }
  };

  const t = content[language];

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="text-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-white border-b border-slate-700 pb-4">{t.title}</h2>
        <div className="space-y-6">
          {t.sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-[#21DBA4] font-bold mb-2">{section.title}</h3>
              <p className="text-sm text-slate-400 whitespace-pre-line leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </ModalOverlay>
  );
};

export const TermsOfServiceModal = ({ isOpen, onClose, language }: ModalProps) => {
  const content = {
    en: {
      title: "Terms of Service",
      sections: [
        {
          title: "1. Service Overview",
          content: "Linkbrain is a service that allows users to save web links and analyzes/organizes open content from those links for personal archiving and insight provision."
        },
        {
          title: "2. User Account",
          content: `• Users must use the service only with their own account.
• Users are responsible for managing their account information.`
        },
        {
          title: "3. Content Saving & Responsibility",
          content: `• Users must save only links they have access to.
• Users are responsible for any issues arising from saving private posts or content without access rights.
• Linkbrain does not claim ownership of the original content of saved links.`
        },
        {
          title: "4. Notice on AI Analysis Results",
          content: `• Linkbrain's AI analysis results are for reference only.
• We do not guarantee the accuracy, completeness, or legal effect of the analysis results.`
        },
        {
          title: "5. Service Restrictions",
          content: `The following actions are prohibited:
• Saving illegal content
• Actions that place excessive load on the service system
• Automated abnormal requests
• Actions that infringe on the rights of others
Violations may result in service restrictions.`
        },
        {
          title: "6. Subscription & Payment",
          content: `• Paid services are billed via Stripe.
• Subscriptions may auto-renew, and users can cancel at any time.
• Refund policies follow separately announced standards.`
        },
        {
          title: "7. Service Changes & Termination",
          content: `Linkbrain may change some features or terminate the entire service for improvement purposes.`
        },
        {
          title: "8. Disclaimer",
          content: `• Linkbrain is not responsible for changes, deletions, or access restrictions of external links.
• Legal responsibility for the use of saved content lies with the user.`
        },
        {
          title: "9. Terms Modification",
          content: `• We will provide prior notice when terms change.
• Continued use after changes implies agreement.`
        },
        {
          title: "10. Governing Law",
          content: "These terms are governed by the laws of the Republic of Korea."
        }
      ]
    },
    ko: {
      title: "이용약관",
      sections: [
        {
          title: "1. 서비스 개요",
          content: "Linkbrain은 사용자가 웹 링크를 저장하고, 해당 링크의 공개된 콘텐츠를 분석·정리하여 개인적인 아카이빙 및 인사이트 제공을 목적으로 하는 서비스입니다."
        },
        {
          title: "2. 사용자 계정",
          content: `• 사용자는 본인의 계정으로만 서비스를 이용해야 합니다.
• 계정 정보 관리 책임은 사용자 본인에게 있습니다.`
        },
        {
          title: "3. 콘텐츠 저장 및 책임",
          content: `• 사용자는 본인이 접근 가능한 링크만 저장해야 합니다.
• 비공개 게시물, 접근 권한이 없는 콘텐츠 저장으로 발생하는 문제는 사용자 책임입니다.
• Linkbrain은 저장된 콘텐츠의 원본 소유권을 주장하지 않습니다.`
        },
        {
          title: "4. AI 분석 결과에 대한 고지",
          content: `• Linkbrain의 AI 분석 결과는 참고용 정보입니다.
• 분석 결과의 정확성, 완전성, 법적 효력은 보장하지 않습니다.`
        },
        {
          title: "5. 서비스 이용 제한",
          content: `아래 행위는 금지됩니다.
• 불법 콘텐츠 저장
• 서비스 시스템에 과도한 부하를 주는 행위
• 자동화된 비정상적 요청
• 타인의 권리를 침해하는 행위
위반 시 서비스 이용이 제한될 수 있습니다.`
        },
        {
          title: "6. 구독 및 결제",
          content: `• 유료 서비스는 Stripe를 통해 결제됩니다.
• 구독은 자동 갱신될 수 있으며, 사용자는 언제든 해지할 수 있습니다.
• 환불 정책은 별도 고지된 기준을 따릅니다.`
        },
        {
          title: "7. 서비스 변경 및 종료",
          content: `Linkbrain은 서비스 개선을 위해 일부 기능을 변경하거나 서비스 전체를 종료할 수 있습니다.`
        },
        {
          title: "8. 면책 조항",
          content: `• Linkbrain은 외부 링크의 변경, 삭제, 접근 제한에 대해 책임지지 않습니다.
• 저장된 콘텐츠의 이용에 따른 법적 책임은 사용자에게 있습니다.`
        },
        {
          title: "9. 약관 변경",
          content: `• 약관 변경 시 사전 고지합니다.
• 변경 이후 계속 이용 시 동의한 것으로 간주됩니다.`
        },
        {
          title: "10. 준거법",
          content: "본 약관은 대한민국 법률을 따릅니다."
        }
      ]
    }
  };

  const t = content[language];

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="text-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-white border-b border-slate-700 pb-4">{t.title}</h2>
        <div className="space-y-6">
          {t.sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-[#21DBA4] font-bold mb-2">{section.title}</h3>
              <p className="text-sm text-slate-400 whitespace-pre-line leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </ModalOverlay>
  );
};

export const ContactModal = ({ isOpen, onClose, language }: ModalProps) => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = {
    en: {
      title: "Contact Us",
      desc: "If you have any questions or feedback, please feel free to contact us.",
      labels: {
        name: "Name",
        email: "Email",
        message: "Message",
        submit: "Send Message",
        sending: "Sending..."
      },
      info: {
        email: "beyondworks.br@gmail.com",
        phone: "010-7799-6255"
      },
      success: "Your message has been sent successfully. We will get back to you soon!"
    },
    ko: {
      title: "문의하기",
      desc: "궁금한 점이나 피드백이 있으시다면 언제든 문의해 주세요.",
      labels: {
        name: "이름",
        email: "이메일",
        message: "메시지",
        submit: "메시지 보내기",
        sending: "전송 중..."
      },
      info: {
        email: "beyondworks.br@gmail.com",
        phone: "010-7799-6255"
      },
      success: "메시지가 성공적으로 전송되었습니다. 빠른 시일 내에 답변 드리겠습니다!"
    }
  }[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Reset form after a delay or close
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormState({ name: '', email: '', message: '' });
      }, 2000);
    }, 1500);
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="text-slate-200">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
            <Logo className="w-8 h-8 rounded-lg" />
            <h2 className="text-2xl font-bold text-white">{t.title}</h2>
        </div>

        {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
                <div className="w-16 h-16 bg-[#21DBA4]/20 text-[#21DBA4] rounded-full flex items-center justify-center mb-4">
                    <Send size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                <p className="text-slate-400">{t.success}</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        {t.desc}
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-[#21DBA4]">
                                <Mail size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email</div>
                                <div className="font-medium">{t.info.email}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-[#21DBA4]">
                                <Phone size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Phone</div>
                                <div className="font-medium">{t.info.phone}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">{t.labels.name}</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#21DBA4] transition-colors"
                            placeholder={t.labels.name}
                            value={formState.name}
                            onChange={(e) => setFormState({...formState, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">{t.labels.email}</label>
                        <input 
                            type="email" 
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#21DBA4] transition-colors"
                            placeholder={t.labels.email}
                            value={formState.email}
                            onChange={(e) => setFormState({...formState, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">{t.labels.message}</label>
                        <textarea 
                            required
                            rows={4}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#21DBA4] transition-colors resize-none"
                            placeholder={t.labels.message}
                            value={formState.message}
                            onChange={(e) => setFormState({...formState, message: e.target.value})}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-[#21DBA4] hover:bg-[#1bc290] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.labels.sending}</>
                        ) : (
                            <>{t.labels.submit} <Send size={16} /></>
                        )}
                    </button>
                </form>
            </div>
        )}
      </div>
    </ModalOverlay>
  );
};
