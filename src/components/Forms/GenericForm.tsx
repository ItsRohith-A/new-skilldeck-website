
"use client";

import { useIpLocation } from '@/hooks/useIpLocation';
import { allCountries } from '@/lib/countryData';
import { ArrowRight, Briefcase, Building2, Check, ChevronDown, Globe, Mail, MailIcon, MapPin, MessageSquare, PhoneCall, Sparkles, User, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import ToastNotification from '../Notification';
import { formValidation } from './FormValidation';
import PhoneInput from './PhoneInput';
import TurnstileWidget from './TurnstileWidget';
import { getAttributionData } from '@/lib/utm';

// ============================================
// Reusable Form Components
// ============================================

interface FormInputProps {
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    icon?: React.ReactNode;
    className?: string;
}

const FormInput: React.FC<FormInputProps> = ({ name, placeholder, value, onChange, type = 'text', icon, className = '' }) => (
    <div className={`relative group ${className}`}>
        {icon && (
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
            className={`
                w-full py-2 rounded-xl border border-gray-200 
                bg-white text-gray-900 placeholder:text-gray-400 text-xs 2xl:text-sm
                focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
                hover:border-gray-300 transition-all duration-200
                ${icon ? 'pl-10 pr-4' : 'px-4'}
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
}

const FormTextarea: React.FC<FormTextareaProps> = ({ name, placeholder, value, onChange, rows = 2, icon, className = '' }) => (
    <div className={`relative group ${className}`}>
        {icon && (
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
            className={`
                w-full py-2 rounded-xl border border-gray-200 
                bg-white text-gray-900 placeholder:text-gray-400 text-xs 2xl:text-sm
                focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
                hover:border-gray-300 transition-all duration-200 resize-none
                ${icon ? 'pl-10 pr-4' : 'px-4'}
            `}
        />
    </div>
);

interface FormCheckboxProps {
    checked: boolean;
    onChange: () => void;
    label: string;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-3 cursor-pointer group" onClick={onChange}>
        <div className={`
            w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all duration-200
            ${checked
                ? 'bg-[#2563eb] border-transparent '
                : 'border-gray-300 group-hover:border-brand-400 bg-white'
            }
        `}>
            {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
        <span className="text-gray-700 text-xs 2xl:text-sm font-medium select-none">{label}</span>
    </label>
);

interface GenericFormProps {
    onClose?: () => void;
    formtype?: 'enquiry' | 'corporate' | 'list-company' | 1 | 2;
    showContactDetails?: boolean;
    formId?: string;
    title?: string;
    description?: string;
    courseSlug?: string;
    selectedCourse?: string;
}

const requirementOptions = [
    { label: 'Website', value: 'website', icon: <Globe className=" text-brand-primary w-4 h-4" /> },
    { label: 'Global Schedule & Currency', value: 'globalScheduleAndCurrency', icon: <Globe className="text-brand-primary w-4 h-4" /> },
    { label: 'Web Chat', value: 'webChat', icon: <MessageSquare className="text-brand-primary w-4 h-4" /> },
    { label: 'E-learning Platform', value: 'elearningPlatform', icon: <Briefcase className="text-brand-primary w-4 h-4" /> },
    { label: 'Digital Marketing', value: 'digitalMarketing', icon: <Sparkles className="text-brand-primary w-4 h-4" /> },
    { label: 'Lead Generation', value: 'leadGeneration', icon: <User className=" text-brand-primary w-4 h-4" /> },
    { label: 'CRM', value: 'crm', icon: <Building2 className="text-brand-primary w-4 h-4" /> },
    { label: 'CMS', value: 'cms', icon: <Briefcase className="text-brand-primary w-4 h-4" /> },
    { label: 'Event Management', value: 'eventManagementForGlobalCurrenciesAndTimezones', icon: <MapPin className="text-brand-primary w-4 h-4" /> },
];

interface GenericFormData {
    firstname: string;
    designation: string;
    email: string;
    phone: string;
    company: string;
    website: string;
    mainBranchAddress: string;
    otherBranches: string;
    trainingsOffered: string;
    country: string;
    message: string;
    about_company: string;
    demo: boolean;
    page: string;
    requirements: string[];
    courseSlug?: string;
    selectedCourse?: string;
}

const getInitialFormData = (country = '', page = '', courseSlug = '', selectedCourse = ''): GenericFormData => ({
    firstname: '',
    designation: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    mainBranchAddress: '',
    otherBranches: '',
    trainingsOffered: '',
    country,
    message: '',
    about_company: '',
    demo: false,
    page,
    requirements: [],
    courseSlug,
    selectedCourse,
});

function extractCourseSlug(pagePath: string): string | undefined {
    if (!pagePath || pagePath === '/' || pagePath === '/contact') return undefined;
    const segments = pagePath.split('/').filter(Boolean);
    if (segments.length === 0) return undefined;

    const nonCourseSections = ['services', 'service', 'checkout', 'trainer', 'trainers', 'corporate', 'info', 'pricing-plans', 'refer-and-earn', 'privacy-policy', 'refund-policy', 'terms-and-condition', 'blog', 'schedules', 'search', 'contact-us', 'courses', 'about-us'];
    if (segments.some(seg => nonCourseSections.includes(seg.toLowerCase()))) {
        return undefined;
    }

    // Path format: /{categorySlug}/{courseSlug}/{locationSlug?}
    // segments[0] = categorySlug, segments[1] = courseSlug
    if (segments.length >= 2) return segments[1]; // The actual course slug
    return undefined; // Only category page, no course
}

const GenericForm: React.FC<GenericFormProps> = ({
    onClose,
    formtype: propFormType = 'corporate',
    showContactDetails = false,
    formId,
    title,
    description,
    courseSlug: propCourseSlug = '',
    selectedCourse: propSelectedCourse = ''
}) => {
    // Normalize form type
    const formType = propFormType === 1 || propFormType === 'enquiry' ? 'enquiry' :
        propFormType === 'list-company' ? 'list-company' : 'corporate';
    const [showThankyou, setShowThankyou] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [isInteracted, setIsInteracted] = useState(false);
    const [phoneDialCode, setPhoneDialCode] = useState('+91');
    const [phoneCountryCode, setPhoneCountryCode] = useState('IN');


    // Fetch IP Location
    const { data: locationData } = useIpLocation();

    const [formData, setFormData] = useState<GenericFormData>(() => getInitialFormData('', '', propCourseSlug, propSelectedCourse));

    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        const handleClickOutside = (event: { target: any }) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (propCourseSlug || propSelectedCourse) {
            setFormData(prev => ({
                ...prev,
                courseSlug: propCourseSlug || prev.courseSlug,
                selectedCourse: propSelectedCourse || prev.selectedCourse
            }));
        }
    }, [propCourseSlug, propSelectedCourse]);

    useEffect(() => {
        // Use pathname to get the actual URL (e.g. /blog/my-post)
        const segments = pathname?.split('/').filter(Boolean) || [];
        const slug = segments[segments.length - 1];
        setFormData(prev => ({ ...prev, page: slug || 'homepage' }));

        // Auto-detect courseSlug and selectedCourse from URL path if not explicitly provided as props
        if (!propCourseSlug && segments.length >= 2) {
            const detectedSlug = segments[1];
            const detectedTitle = detectedSlug
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());

            setFormData(prev => ({
                ...prev,
                courseSlug: detectedSlug,
                selectedCourse: prev.selectedCourse || detectedTitle
            }));
        }
    }, [pathname, propCourseSlug]);

    // Update country and phone dial code when location data is available
    useEffect(() => {
        if (locationData?.country) {
            setFormData(prev => ({ ...prev, country: locationData.country }));
        }
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleRequirement = (value: string) => {
        const exists = formData.requirements.includes(value);
        setFormData(prev => ({
            ...prev,
            requirements: exists
                ? prev.requirements.filter(req => req !== value)
                : [...prev.requirements, value],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullPhone = phoneDialCode + formData.phone;
        const errorMessage = formValidation({ ...formData, phone: fullPhone });
        if (errorMessage) {
            setError(errorMessage);
            return;
        }

        if (!turnstileToken) {
            setError('Please complete the captcha verification');
            return;
        }

        setIsSubmitting(true);
        try {
            const attribution = getAttributionData();
            const submissionData = {
                email: formData.email,
                fullName: formData.firstname,
                phone: fullPhone,
                country: formData.country,
                courseSlug: formData.courseSlug || '',
                leadSource: 'website',
                message: formData.message,
                pagePath: formData.page || (typeof window !== 'undefined' ? window.location.pathname : ''),
                formId: formId,
                referrer: attribution.referrer || (typeof document !== 'undefined' ? (localStorage.getItem('initial_referrer') || document.referrer || '-') : '-'),
                utmSource: attribution.utmSource || getUTMParam('utm_source'),
                utmMedium: attribution.utmMedium || getUTMParam('utm_medium'),
                utmCampaign: attribution.utmCampaign || getUTMParam('utm_campaign'),
                utmTerm: attribution.utmTerm || getUTMParam('utm_term'),
                utmContent: attribution.utmContent || getUTMParam('utm_content'),
                gclid: attribution.gclid,
                customFields: {
                    company: formData.company,
                    designation: formData.designation,
                    website: formData.website,
                    about_company: formData.about_company,
                    demo: formData.demo,
                    mainBranchAddress: formData.mainBranchAddress,
                    otherBranches: formData.otherBranches,
                    trainingsOffered: formData.trainingsOffered,
                    requirements: formData.requirements,
                    curriculum: false,
                    formtype: formType,
                    selectedCourse: formData.selectedCourse
                },
                turnstileToken
            };

            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.message || 'Failed to submit form. Please try again.');
            }

            setShowThankyou(true);
        } catch (err: any) {
            setError(err.message || 'An error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative h-full">
            {error && <ToastNotification message={error} onClose={() => setError(null)} />}

            {showThankyou ? (
                <div className="h-full flex flex-col items-center justify-center p-8 sm:p-10 animate-fade-in">
                    {/* Success Animation Circle */}
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] rounded-full opacity-20 animate-ping" />
                        <div className="relative w-20 h-20 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] rounded-full flex items-center justify-center shadow-lg shadow-brand-primary/30">
                            <Check className="w-10 h-10 text-white" strokeWidth={3} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                        Thank You! 🎉
                    </h2>
                    <p className="text-gray-500 text-center mb-8 leading-relaxed max-w-md mx-auto">
                        We&apos;ve received your message and will get back to you within <span className="font-semibold text-gray-700">24 hours</span>.
                    </p>

                    <button
                        onClick={() => {
                            setFormData(getInitialFormData(locationData?.country || '', formData.page, propCourseSlug, propSelectedCourse));
                            setTurnstileToken(null);
                            setIsInteracted(false);
                            setError(null);
                            setShowThankyou(false);
                        }}
                        className="
                            w-full max-w-sm mx-auto py-3.5 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] text-white rounded-xl font-semibold
                            shadow-lg shadow-brand-primary/20
                            hover:shadow-xl hover:shadow-brand-primary/30
                            transform hover:scale-[1.02] active:scale-[0.98]
                            transition-all duration-200
                        "
                    >
                        Submit Another Response</button>
                </div>
            ) : (
                <form
                    id={formId}
                    onSubmit={handleSubmit}
                    onFocusCapture={() => setIsInteracted(true)}
                    className="h-full overflow-y-auto scrollbar-hide"
                >
                    {(title || description) && (
                        <div className="mb-4 text-center">
                            {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
                            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                        </div>
                    )}
                    {/* Personal Information Section */}
                    <div className="grid grid-cols-2 gap-2 2xl:gap-4 mb-2">
                        <FormInput
                            name="firstname"
                            placeholder="Full Name"
                            value={formData.firstname}
                            onChange={handleChange}
                            icon={<User className="text-brand-primary w-4 h-4" />}
                        />
                        <FormInput
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            icon={<Mail className="text-brand-primary w-4 h-4" />}
                        />
                        <div className="col-span-2">
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



                        {/* Company field for Corporate and List Company */}
                        {(formType === 'corporate') && (
                            <FormInput
                                name="company"
                                placeholder="Company Name"
                                value={formData.company}
                                onChange={handleChange}
                                icon={<Building2 className="text-brand-primary w-4 h-4" />}
                            />
                        )}

                        {/* Corporate specific fields */}
                        {formType === 'corporate' && (
                            <>
                                <FormInput
                                    name="mainBranchAddress"
                                    placeholder="Location"
                                    value={formData.mainBranchAddress}
                                    onChange={handleChange}
                                    icon={<MapPin className="text-brand-primary w-4 h-4" />}
                                />
                                <FormInput
                                    name="otherBranches"
                                    placeholder="Other Branches (if any)"
                                    value={formData.otherBranches}
                                    onChange={handleChange}
                                    icon={<MapPin className="text-brand-primary w-4 h-4" />}
                                    className=""
                                />
                                <FormTextarea
                                    name="trainingsOffered"
                                    placeholder="What trainings does your company offer?"
                                    value={formData.trainingsOffered}
                                    onChange={handleChange}
                                    icon={<Briefcase className="text-brand-primary w-4 h-4" />}
                                    rows={2}
                                    className=""
                                />
                                <FormTextarea
                                    name="about_company"
                                    placeholder="Tell us about your company and training goals..."
                                    value={formData.about_company}
                                    onChange={handleChange}
                                    rows={2}
                                    className=""
                                />

                                {/* Requirements Multi-select */}
                                <div className="col-span-2 mb-1 relative" ref={dropdownRef}>
                                    {/* Dropdown Trigger */}
                                    <div
                                        className={`
                                        w-full border px-4 py-2 md:py-2.5 rounded-xl bg-white cursor-pointer
                                        flex items-center justify-between gap-3 text-xs md:text-sm 2xl:text-base
                                        transition-all duration-200
                                        ${dropdownOpen
                                                ? 'border-brand-primary ring-2 ring-brand-primary/20'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                                    `}
                                        onClick={() => setDropdownOpen(prev => !prev)}
                                    >
                                        <span className={formData.requirements.length > 0 ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                                            {formData.requirements.length > 0
                                                ? `${formData.requirements.length} service${formData.requirements.length > 1 ? 's' : ''} selected`
                                                : 'Select the services you need'}
                                        </span>
                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div className="absolute left-0 bottom-full z-50 mb-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto scroll-bar animate-fade-in">
                                            {requirementOptions.map(opt => (
                                                <div
                                                    key={opt.value}
                                                    onClick={() => toggleRequirement(opt.value)}
                                                    className={`
                                                    flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
                                                    ${formData.requirements.includes(opt.value)
                                                            ? 'bg-brand-primary/10'
                                                            : 'hover:bg-gray-50'
                                                        }
                                                `}
                                                >
                                                    <div className={`
                                                    w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0
                                                    ${formData.requirements.includes(opt.value)
                                                            ? 'bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] border-transparent'
                                                            : 'border-gray-300'
                                                        }
                                                `}>
                                                        {formData.requirements.includes(opt.value) && (
                                                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                        )}
                                                    </div>
                                                    <div className="text-gray-400">{opt.icon}</div>
                                                    <span className="text-gray-700 text-sm font-medium">{opt.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Selected Tags */}
                                    {formData.requirements.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {formData.requirements.map((item) => {
                                                const option = requirementOptions.find(opt => opt.value === item);
                                                return (
                                                    <div
                                                        key={item}
                                                        className="group flex items-center gap-2 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] text-white rounded-full pl-3 pr-2 py-1.5 text-xs font-medium shadow-sm hover:shadow-md transition-shadow"
                                                    >
                                                        {option?.label || item}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleRequirement(item);
                                                            }}
                                                            className="text-brand-primary w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
                                                        >
                                                            <X className="w-2.5 h-2.5" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    {/* Message - Enquiry and List Company Only */}
                    {(formType === 'enquiry' || formType === 'list-company') && (
                        <>
                            <div className="">
                                <FormTextarea
                                    name="message"
                                    placeholder="How can we help you? Share your questions or requirements..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={3}
                                    icon={<MessageSquare className="text-brand-primary w-4 h-4" />}
                                />
                            </div>

                            {formType === 'enquiry' && (
                                <div className="p-2 bg-brand-primary/10 rounded-sm border border-brand-primary/20">
                                    <FormCheckbox
                                        checked={formData.demo}
                                        onChange={() => setFormData(prev => ({ ...prev, demo: !prev.demo }))}
                                        label="Yes, I'd like to schedule a product demo"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Action Section (Captcha & Submit) */}
                    <div className="flex flex-col items-center gap-4 mt-4 w-full">
                        {/* Turnstile Captcha */}
                        {(formType !== 'list-company' || isInteracted) && (
                            <div className="w-full sm:w-auto flex justify-center sm:justify-start flex-shrink-0">
                                <TurnstileWidget
                                    onVerify={(token) => setTurnstileToken(token)}
                                    onError={() => setTurnstileToken(null)}
                                    onExpire={() => setTurnstileToken(null)}
                                    className="flex justify-center sm:justify-start min-h-[45px]"
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`
                                flex-1 w-full text-xs md:text-sm py-2 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] text-white rounded-xl font-semibold
                                flex items-center justify-center gap-2
                                cursor-pointer
                                shadow-lg shadow-brand-primary/20
                                hover:shadow-xl hover:opacity-90 hover:text-white
                                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                            `}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send Message</span>
                                    <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
                                </>
                            )}
                        </button>
                    </div>

                    {showContactDetails && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                                <a href="tel:+919036707847" className="flex items-center gap-2 hover:text-brand-primary transition-colors">
                                    <PhoneCall className="text-brand-primary w-4 h-4" />
                                    +91 9036707847
                                </a>
                                <span className="text-gray-300">|</span>
                                <a href="mailto:hello@skilldeck.net" className="flex items-center gap-2 hover:text-brand-primary transition-colors">
                                    <MailIcon className="text-brand-primary w-4 h-4" />
                                    hello@skilldeck.net
                                </a>
                            </div>
                        </div>
                    )}
                </form>
            )
            }
        </div >
    );
};

export default GenericForm;
