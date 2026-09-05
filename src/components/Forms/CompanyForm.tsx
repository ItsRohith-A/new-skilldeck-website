import { useIpLocation } from '@/hooks/useIpLocation';
import { allCountries } from '@/lib/countryData';
import { getAttributionData } from '@/lib/utm';
import { ArrowRight, Calendar, Check, Mail, MessageSquare, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ToastNotification from '../Notification';
import PhoneInput from './PhoneInput';
import TurnstileWidget from './TurnstileWidget';

interface CompanyFormProps {
    onClose?: () => void;
    className?: string;
    tenantId?: string;
    scheduleId?: string;
    courseId?: string;
    courseTitle?: string;
    showPreferredDateTime?: boolean;
    hideIcons?: boolean;
    submitText?: string;
    layout?: 'default' | 'compact';
}

interface FormInputProps {
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    icon?: React.ReactNode;
    className?: string;
    required?: boolean;
    hideIcons?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ name, placeholder, value, onChange, type = 'text', icon, className = '', required = false, hideIcons = false }) => (
    <div className={`relative group ${className}`}>
        {icon && !hideIcons && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors">
                {icon}
            </div>
        )}
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className={`
                w-full py-2 md:py-2.5 rounded-xl border border-gray-200 
                bg-white text-gray-900 placeholder:text-gray-400 text-xs 2xl:text-sm
                focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
                hover:border-gray-300 transition-all duration-200
                ${icon && !hideIcons ? 'pl-10 pr-4' : 'px-4'}
            `}
        />
    </div>
);

interface FormTextareaProps {
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    icon?: React.ReactNode;
    className?: string;
    required?: boolean;
    hideIcons?: boolean;
}

const FormTextarea: React.FC<FormTextareaProps> = ({ name, placeholder, value, onChange, rows = 3, icon, className = '', required = false, hideIcons = false }) => (
    <div className={`relative group ${className}`}>
        {icon && !hideIcons && (
            <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-brand-primary transition-colors">
                {icon}
            </div>
        )}
        <textarea
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
            required={required}
            className={`
                w-full py-2 md:py-2.5 rounded-xl border border-gray-200 
                bg-white text-gray-900 placeholder:text-gray-400 text-xs 2xl:text-sm
                focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
                hover:border-gray-300 transition-all duration-200 resize-none
                ${icon && !hideIcons ? 'pl-10 pr-4' : 'px-4'}
            `}
        />
    </div>
);

const CompanyForm: React.FC<CompanyFormProps> = ({ onClose, className = '', tenantId, scheduleId, courseId, courseTitle, showPreferredDateTime = false, hideIcons = false, submitText, layout = 'default' }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showThankyou, setShowThankyou] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [showTurnstile, setShowTurnstile] = useState(false);

    const { data: locationData } = useIpLocation();

    const [phoneDialCode, setPhoneDialCode] = useState('+91');
    const [phoneCountryCode, setPhoneCountryCode] = useState('IN');

    // Update country and phone dial code when location data is available
    useEffect(() => {
        if (locationData?.countryCode) {
            setPhoneCountryCode(locationData.countryCode);
            const matched = allCountries.find(c => c.code.toUpperCase() === locationData.countryCode.toUpperCase());
            if (matched) {
                setPhoneDialCode(matched.dialCode);
            }
        } else if (typeof window !== 'undefined') {
            const cachedLocation = localStorage.getItem('geoLocation');
            if (cachedLocation) {
                try {
                    const parsed = JSON.parse(cachedLocation);
                    if (parsed.countryCode) {
                        setPhoneCountryCode(parsed.countryCode);
                        const matched = allCountries.find(c => c.code.toUpperCase() === parsed.countryCode.toUpperCase());
                        if (matched) {
                            setPhoneDialCode(matched.dialCode);
                        }
                    }
                } catch (e) {
                    console.warn(e);
                }
            }
        }
    }, [locationData]);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        message: '',
        preferredDateTime: ''
    });

    const pathname = usePathname();

    // Persist UTM parameters to both localStorage and sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
            utmParams.forEach(param => {
                const value = params.get(param);
                if (value) {
                    localStorage.setItem(param, value);
                    sessionStorage.setItem(param, value);
                }
            });
            // Also store initial referrer and initial landing page if not set
            if (!localStorage.getItem('initial_referrer')) {
                localStorage.setItem('initial_referrer', document.referrer || 'direct');
            }
            if (!localStorage.getItem('initial_landing_page')) {
                localStorage.setItem('initial_landing_page', window.location.pathname + window.location.search);
            }
        }
    }, [pathname]);

    const getUTMParam = (paramName: string) => {
        if (typeof window === 'undefined') return '-';
        const urlParams = new URLSearchParams(window.location.search);
        return (
            localStorage.getItem(paramName) ||
            sessionStorage.getItem(paramName) ||
            urlParams.get(paramName) ||
            '-'
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) return "Name is required";
        if (!formData.email.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Invalid email format";
        if (!formData.phone.trim()) return "Phone number is required";
        if (formData.phone.trim().length < 10) return "Please enter a valid phone number";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        if (!turnstileToken) {
            setError('Please verify you are human');
            return;
        }

        setIsSubmitting(true);
        setError(null);


        try {
            const attribution = getAttributionData();
            const payload = {
                ...formData,
                phone: `${phoneDialCode}${formData.phone}`,
                ip: locationData?.query,
                country: locationData?.country,
                turnstileToken,
                tenantId, // Ensure this is not undefined
                pagePath: pathname,
                referrer: attribution.referrer || (typeof document !== 'undefined' ? (localStorage.getItem('initial_referrer') || document.referrer || '-') : '-'),
                utmSource: attribution.utmSource || getUTMParam('utm_source'),
                utmMedium: attribution.utmMedium || getUTMParam('utm_medium'),
                utmCampaign: attribution.utmCampaign || getUTMParam('utm_campaign'),
                utmTerm: attribution.utmTerm || getUTMParam('utm_term'),
                utmContent: attribution.utmContent || getUTMParam('utm_content'),
                gclid: attribution.gclid,
                participantsCount: 1,
                scheduleId,
                courseId,
                courseTitle,
                customFields: {
                    ...(showPreferredDateTime && { preferredDateTime: formData.preferredDateTime })
                }
            };

            const response = await fetch('/api/company-leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit form');
            }

            setShowThankyou(true);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                companyName: '',
                message: '',
                preferredDateTime: ''
            });

        } catch (err: any) {
            console.error("Form submission error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showThankyou) {
        return (
            <div className={`h-full flex flex-col items-center justify-center p-8 animate-fade-in ${className}`}>
                <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 bg-brand-gradient rounded-full opacity-20 animate-ping" />
                    <div className="relative w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-8 h-8 text-white" strokeWidth={3} />
                    </div>
                </div>

                <h2 className="text-base md:text-lg font-bold text-center text-gray-900 mb-2">
                    Request Received!
                </h2>
                <p className="text-gray-500 text-xs lg:text-sm text-center mb-6 max-w-sm">
                    Thank you for your interest. Our team will get back to you shortly.
                </p>

                <button
                    onClick={() => {
                        setShowThankyou(false);
                        if (onClose) onClose();
                    }}
                    className="px-10 py-1.5 bg-brand-gradient text-sm 2xl:text-base text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                    Close
                </button>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {error && <ToastNotification message={error} onClose={() => setError(null)} />}

            <form
                onSubmit={handleSubmit}
                className="space-y-3"
                onFocus={() => setShowTurnstile(true)}
                onClick={() => setShowTurnstile(true)}
            >
                {layout === 'compact' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                icon={<User className="w-4 h-4 text-brand-primary" />}
                                required
                                hideIcons={hideIcons}
                            />

                            <FormInput
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                icon={<Mail className="w-4 h-4 text-brand-primary" />}
                                required
                                hideIcons={hideIcons}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <PhoneInput
                                value={formData.phone}
                                countryCode={phoneCountryCode}
                                onChange={(value, countryCode, dialCode) => {
                                    setFormData(prev => ({ ...prev, phone: value }));
                                    setPhoneCountryCode(countryCode);
                                    setPhoneDialCode(dialCode);
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                icon={<User className="w-4 h-4 text-brand-primary" />}
                                required
                                hideIcons={hideIcons}
                            />

                            <FormInput
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                icon={<Mail className="w-4 h-4 text-brand-primary" />}
                                required
                                hideIcons={hideIcons}
                            />
                        </div>

                        <PhoneInput
                            value={formData.phone}
                            countryCode={phoneCountryCode}
                            onChange={(value, countryCode, dialCode) => {
                                setFormData(prev => ({ ...prev, phone: value }));
                                setPhoneCountryCode(countryCode);
                                setPhoneDialCode(dialCode);
                            }}
                        />
                    </>
                )}

                <FormTextarea
                    name="message"
                    placeholder="How can we help? (Optional)"
                    value={formData.message}
                    onChange={handleChange}
                    icon={<MessageSquare className="w-4 h-4 text-brand-primary" />}
                    hideIcons={hideIcons}
                />
                <div
                    className={
                        layout === 'compact'
                            ? 'flex flex-col gap-3 w-full justify-center items-center'
                            : 'flex flex-col md:flex-row md:items-center gap-3 md:gap-4 w-full'
                    }
                >
                    {showTurnstile && (
                        <div className="flex-shrink-0 flex justify-center md:justify-start">
                            <TurnstileWidget
                                onVerify={(token) => setTurnstileToken(token)}
                                onError={() => {
                                    console.error("Turnstile error");
                                    setTurnstileToken(null);
                                }}
                                onExpire={() => setTurnstileToken(null)}
                                className="flex justify-center md:justify-start"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:flex-1 py-2.5 text-sm bg-gradient-to-r from-brand-secondary to-brand-primary hover:opacity-90 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <span>{submitText || "Submit Request"}</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyForm;
