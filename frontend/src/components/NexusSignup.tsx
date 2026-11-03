import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, Check, Eye, EyeOff, Hexagon, LockKeyhole, ShieldCheck, Truck } from 'lucide-react';
import { supabase } from '../lib/supabase.ts';

type FormState = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  password: string;
  confirmPassword: string;
};
type FieldName = keyof FormState;
type TransitionPhase = 'idle' | 'scanning' | 'granted' | 'streaks' | 'doors' | 'done';
type TrustBadge = {
  label: string;
  icon: ReactNode;
};
type ScanLine = {
  id: string;
  delay: number;
  opacity: number;
};
type Streak = {
  id: string;
  angle: number;
  distance: number;
  length: number;
  delay: number;
};
type ProductCard = {
  id: string;
  name: string;
  seller: string;
  price: string;
};
type NavLink = {
  id: string;
  label: string;
};
type StrengthSegment = {
  id: string;
  activeClass: string;
};
const initialForm: FormState = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  password: '',
  confirmPassword: ''
};
const trustBadges: TrustBadge[] = [{
  label: 'Verified independent sellers',
  icon: <ShieldCheck size={13} className="text-[#3DD9E8]" strokeWidth={1.6} />
}, {
  label: '10,000+ technology products',
  icon: <Hexagon size={13} className="text-[#3DD9E8]" strokeWidth={1.6} />
}, {
  label: 'Secure payments',
  icon: <LockKeyhole size={13} className="text-[#3DD9E8]" strokeWidth={1.6} />
}, {
  label: 'Global shipping',
  icon: <Truck size={13} className="text-[#3DD9E8]" strokeWidth={1.6} />
}];
const scanLines: ScanLine[] = [{
  id: 'scan-primary',
  delay: 0,
  opacity: 0.7
}, {
  id: 'scan-offset-a',
  delay: 42,
  opacity: 0.54
}, {
  id: 'scan-offset-b',
  delay: 86,
  opacity: 0.62
}, {
  id: 'scan-offset-c',
  delay: 128,
  opacity: 0.42
}];
const streaks: Streak[] = [{
  id: 'streak-east',
  angle: 0,
  distance: 220,
  length: 118,
  delay: 0
}, {
  id: 'streak-south-east',
  angle: 36,
  distance: 190,
  length: 92,
  delay: 45
}, {
  id: 'streak-south',
  angle: 86,
  distance: 174,
  length: 106,
  delay: 90
}, {
  id: 'streak-south-west',
  angle: 142,
  distance: 212,
  length: 82,
  delay: 135
}, {
  id: 'streak-west',
  angle: 182,
  distance: 230,
  length: 120,
  delay: 25
}, {
  id: 'streak-north-west',
  angle: 224,
  distance: 196,
  length: 88,
  delay: 70
}, {
  id: 'streak-north',
  angle: 272,
  distance: 178,
  length: 108,
  delay: 115
}, {
  id: 'streak-north-east',
  angle: 318,
  distance: 205,
  length: 96,
  delay: 160
}];
const svgDots = [{
  id: 'dot-1',
  cx: 70,
  cy: 278
}, {
  id: 'dot-2',
  cx: 118,
  cy: 268
}, {
  id: 'dot-3',
  cx: 166,
  cy: 258
}, {
  id: 'dot-4',
  cx: 214,
  cy: 278
}, {
  id: 'dot-5',
  cx: 262,
  cy: 268
}, {
  id: 'dot-6',
  cx: 310,
  cy: 258
}, {
  id: 'dot-7',
  cx: 358,
  cy: 278
}, {
  id: 'dot-8',
  cx: 406,
  cy: 268
}, {
  id: 'dot-9',
  cx: 454,
  cy: 258
}];
const strengthSegments: StrengthSegment[] = [{
  id: 'strength-red',
  activeClass: 'bg-red-400'
}, {
  id: 'strength-orange',
  activeClass: 'bg-orange-400'
}, {
  id: 'strength-yellow',
  activeClass: 'bg-yellow-300'
}, {
  id: 'strength-cyan',
  activeClass: 'bg-[#3DD9E8]'
}];
const navLinks: NavLink[] = [{
  id: 'explore',
  label: 'Explore'
}, {
  id: 'sellers',
  label: 'Sellers'
}, {
  id: 'categories',
  label: 'Categories'
}, {
  id: 'account',
  label: 'My Account'
}];
const productCards: ProductCard[] = [{
  id: 'model-m',
  name: 'Vintage IBM Model M Keyboard',
  seller: 'by RetroTech Labs',
  price: '$149.00'
}, {
  id: 'pcb-sensor',
  name: 'Custom PCB Sensor Array',
  seller: 'by Northstar Circuits',
  price: '$84.00'
}, {
  id: 'pi-hat',
  name: 'Raspberry Pi HAT Kit',
  seller: 'by Maker Harbor',
  price: '$42.00'
}, {
  id: 'microscope',
  name: 'Electron Microscope Slide Set',
  seller: 'by Aperture Supply',
  price: '$118.00'
}, {
  id: 'servo-pack',
  name: 'Precision Servo Development Pack',
  seller: 'by Kinetic Bench',
  price: '$96.00'
}, {
  id: 'thermal-module',
  name: 'Thermal Imaging Module',
  seller: 'by Optic Forge',
  price: '$231.00'
}];
const transitionTimers: number[] = [];
const LogoMark = () => {
  return <div className="relative flex h-10 w-10 items-center justify-center text-[#3DD9E8]">
      <Hexagon size={38} strokeWidth={1.3} />
      <span className="absolute h-2 w-2 rounded-full bg-[#3DD9E8] shadow-[0_0_12px_#3DD9E8]" />
      <span className="absolute h-5 w-px bg-[#3DD9E8]/70" />
      <span className="absolute h-px w-5 bg-[#3DD9E8]/70" />
    </div>;
};
const RegistrationTransition = ({
  phase,
  reducedMotion
}: {
  phase: TransitionPhase;
  reducedMotion: boolean;
}) => {
  const showAccess = phase === 'granted' || phase === 'streaks' || phase === 'doors';
  const showStreaks = phase === 'streaks' || phase === 'doors';
  const showDoors = phase === 'doors';
  if (phase === 'idle' || phase === 'done') {
    return null;
  }
  return <div aria-live="polite" aria-label="Registration unlock transition" className={`fixed inset-0 z-[1000] overflow-hidden bg-[#10151B] ${phase === 'granted' && !reducedMotion ? 'nexus-overlay-shake' : ''}`}>
      {phase === 'scanning' && !reducedMotion && <div aria-hidden="true" className="absolute inset-0">
          {scanLines.map(line => <span key={line.id} className="nexus-scan-line" style={{
        animationDelay: `${line.delay}ms`,
        opacity: line.opacity
      }} />)}
        </div>}

      {showAccess && <div className={`absolute inset-0 flex items-center justify-center px-6 text-center ${showDoors ? 'opacity-0 transition-opacity duration-200' : 'opacity-100'}`}>
          <div>
            <p className={`nexus-access-title ${reducedMotion ? 'nexus-reduced-access-title' : ''}`} data-text="ACCESS GRANTED">ACCESS GRANTED</p>
            <p className="mt-5 font-mono text-[clamp(10px,1.5vw,14px)] uppercase tracking-[0.3em] text-[#94A3B8]">IDENTITY VERIFIED — WELCOME TO NEXUS</p>
          </div>
        </div>}

      {showStreaks && !reducedMotion && <div aria-hidden="true" className={`absolute inset-0 ${showDoors ? 'opacity-0 transition-opacity duration-200' : 'opacity-100'}`}>
          <span className="nexus-ring" />
          {streaks.map(streak => <span key={streak.id} className="nexus-streak" style={{
        '--streak-angle': `${streak.angle}deg`,
        '--streak-distance': `${streak.distance}px`,
        '--streak-length': `${streak.length}px`,
        animationDelay: `${streak.delay}ms`
      } as CSSProperties} />)}
        </div>}

      {showDoors && !reducedMotion && <div aria-hidden="true" className="absolute inset-0">
          <div className="nexus-door-panel nexus-door-left">
            <svg className="absolute inset-0 h-full w-full opacity-[0.16]" viewBox="0 0 360 720" preserveAspectRatio="none" fill="none">
              <g stroke="#34414D" strokeWidth="1.2">
                <path d="M40 0v210l42 42v156l-36 36v276" />
                <path d="M138 0v124l52 52v166l-42 42v336" />
                <path d="M260 0v180l-38 38v134l48 48v320" />
                <path d="M0 112h94l38 38h92" />
                <path d="M0 506h110l44-44h120" />
                <circle cx="82" cy="252" r="5" />
                <circle cx="190" cy="176" r="5" />
                <circle cx="270" cy="400" r="5" />
              </g>
            </svg>
          </div>
          <div className="nexus-door-panel nexus-door-right">
            <svg className="absolute inset-0 h-full w-full opacity-[0.16]" viewBox="0 0 360 720" preserveAspectRatio="none" fill="none">
              <g stroke="#34414D" strokeWidth="1.2">
                <path d="M320 0v210l-42 42v156l36 36v276" />
                <path d="M222 0v124l-52 52v166l42 42v336" />
                <path d="M100 0v180l38 38v134l-48 48v320" />
                <path d="M360 112h-94l-38 38h-92" />
                <path d="M360 506H250l-44-44H86" />
                <circle cx="278" cy="252" r="5" />
                <circle cx="170" cy="176" r="5" />
                <circle cx="90" cy="400" r="5" />
              </g>
            </svg>
          </div>
        </div>}
    </div>;
};
const MarketplaceHome = ({
  phase
}: {
  phase: TransitionPhase;
}) => {
  const isRevealed = phase === 'doors' || phase === 'done';
  return <main className={`min-h-screen bg-[#10151B] text-[#E6EDF3] transition-opacity duration-200 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
      <nav className="border-b border-[#34414D] bg-[#1B242D]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:px-12">
          <a href="#top" className="flex items-center gap-3" aria-label="NEXUS marketplace home">
            <LogoMark />
            <span className="text-[18px] font-semibold tracking-[0.32em] text-[#E6EDF3]">NEXUS</span>
          </a>
          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map(link => <a key={link.id} href={`#${link.id}`} className="text-sm font-medium text-[#94A3B8] transition hover:text-[#3DD9E8]">{link.label}</a>)}
          </div>
          <button type="button" className="rounded-md border border-[#3DD9E8] px-4 py-2 text-sm font-semibold text-[#3DD9E8] transition hover:bg-[#3DD9E8] hover:text-[#10151B]">
            <span>Sell on NEXUS</span>
          </button>
        </div>
      </nav>

      <section id="top" className="relative overflow-hidden px-5 py-20 text-center sm:px-8 lg:px-12 lg:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.045]" style={{
        backgroundImage: 'linear-gradient(#94A3B8 1px, transparent 1px), linear-gradient(90deg, #94A3B8 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />
        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-[#3DD9E8]">Placeholder marketplace homepage</p>
          <h1 className="text-[clamp(2.5rem,6vw,5.8rem)] font-bold leading-[0.96] tracking-[-0.055em] text-[#E6EDF3]">The Marketplace for Makers and Engineers</h1>
          <p className="mx-auto mt-7 max-w-2xl text-[16px] leading-7 text-[#94A3B8]">Thousands of technology products from independent creators worldwide.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button type="button" className="w-full rounded-lg bg-[#3DD9E8] px-6 py-3 text-sm font-bold text-[#10151B] transition hover:shadow-[0_0_22px_rgba(61,217,232,0.28)] sm:w-auto">
              <span>Browse Products</span>
            </button>
            <button type="button" className="w-full rounded-lg border border-[#34414D] px-6 py-3 text-sm font-semibold text-[#E6EDF3] transition hover:border-[#3DD9E8] hover:text-[#3DD9E8] sm:w-auto">
              <span>Meet Our Sellers</span>
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#3DD9E8]">Curated placeholder catalog</p>
            <h2 className="mt-3 text-[32px] font-bold tracking-[-0.035em] text-[#E6EDF3]">Featured Products</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#94A3B8]">A preview surface for the post-registration marketplace experience.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {productCards.map(product => <article key={product.id} className="group overflow-hidden rounded-lg border border-[#34414D] bg-[#1B242D] transition duration-300 hover:border-[#3DD9E8] hover:shadow-[0_0_24px_rgba(61,217,232,0.14)]">
              <div aria-hidden="true" className="relative h-[180px] w-full overflow-hidden bg-[#10151B]">
                <svg className="h-full w-full opacity-[0.28]" viewBox="0 0 520 180" preserveAspectRatio="none" fill="none">
                  <g stroke="#34414D" strokeWidth="1">
                    <path d="M0 48h106l31 31h94l27 27h118l34-34h110" />
                    <path d="M0 132h88l28-28h104l36 36h86l46-46h132" />
                    <path d="M154 0v55l36 36v89" />
                    <path d="M362 0v69l-42 42v69" />
                    <circle cx="137" cy="79" r="18" />
                    <circle cx="320" cy="111" r="22" />
                    <path d="M434 31l34 20v40l-34 20-34-20V51z" />
                  </g>
                  <g fill="#3DD9E8" fillOpacity="0.55">
                    <circle cx="106" cy="48" r="3" />
                    <circle cx="258" cy="106" r="3" />
                    <circle cx="410" cy="72" r="3" />
                  </g>
                </svg>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#E6EDF3]">{product.name}</h3>
                <p className="mt-1 text-sm text-[#94A3B8]">{product.seller}</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="font-mono text-base font-bold text-[#3DD9E8]">{product.price}</p>
                  <button type="button" className="rounded-md border border-[#34414D] px-3.5 py-2 text-xs font-semibold text-[#94A3B8] transition group-hover:border-[#3DD9E8] group-hover:text-[#3DD9E8]">
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </article>)}
        </div>
      </section>

      <footer className="border-t border-[#34414D] bg-[#1B242D] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-[18px] font-semibold tracking-[0.32em] text-[#E6EDF3]">NEXUS</p>
            <p className="mt-2 text-sm text-[#94A3B8]">© 2025 NEXUS marketplace placeholder. All systems nominal.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#94A3B8]">
            <a href="#explore" className="transition hover:text-[#3DD9E8]">Explore</a>
            <a href="#categories" className="transition hover:text-[#3DD9E8]">Categories</a>
            <a href="#sellers" className="transition hover:text-[#3DD9E8]">Sellers</a>
            <a href="#support" className="transition hover:text-[#3DD9E8]">Support</a>
          </div>
        </div>
      </footer>
    </main>;
};

const validateDateOfBirth = (value: string): string => {
  if (!value) return 'Date of birth is required.';

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return 'Enter a valid date.';

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
  ) {
    return 'Enter a valid calendar date.';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date > today) {
    return 'Date of birth cannot be in the future.';
  }

  return '';
};

export const NexusSignup = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle');
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timersRef = useRef<number[]>(transitionTimers);
  const isTransitioning = transitionPhase !== 'idle' && transitionPhase !== 'done';
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => window.clearTimeout(timer));
    };
  }, []);
  const strength = useMemo(() => {
    let score = 0;
    if (form.password.length >= 8) score += 1;
    if (/[A-Z]/.test(form.password)) score += 1;
    if (/[0-9]/.test(form.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) score += 1;
    return score;
  }, [form.password]);
  const startTransition = () => {
    timersRef.current.forEach(timer => window.clearTimeout(timer));
    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(shouldReduceMotion);
    setShowMarketplace(true);
    if (shouldReduceMotion) {
      setTransitionPhase('granted');
      timersRef.current = [window.setTimeout(() => {
        setTransitionPhase('done');
      }, 450)];
      return;
    }
    setTransitionPhase('scanning');
    timersRef.current = [window.setTimeout(() => {
      setTransitionPhase('granted');
    }, 300), window.setTimeout(() => {
      setTransitionPhase('streaks');
    }, 800), window.setTimeout(() => {
      setTransitionPhase('doors');
    }, 1200), window.setTimeout(() => {
      setTransitionPhase('done');
    }, 1500)];
  };
  const updateField = (field: FieldName, value: string) => {
    setForm(current => ({
      ...current,
      [field]: value
    }));
    setSuccess(false);
  };
  const fieldError = (field: FieldName) => {
    if (!touched[field]) return '';
    if (['firstName', 'lastName', 'username', 'email', 'dateOfBirth', 'password', 'confirmPassword'].includes(field) && !form[field]) return 'This field is required.';
    if (field === 'email' && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
    if (field === 'password' && form.password && strength < 3) return 'Use at least 8 characters with upper case, number, and symbol.';
    if (field === 'confirmPassword' && form.confirmPassword !== form.password) return 'Passwords do not match.';
    if (field === 'dateOfBirth') {
      return validateDateOfBirth(form.dateOfBirth);
    }
    return '';
  };
  const isValid = () => {
    return Object.keys(initialForm).every(field => {
      const fieldName = field as FieldName;

      // Gender is optional
      if (fieldName === 'gender') return true;

      // Check required fields
      if (!form[fieldName]) return false;

      // Validate date of birth
      if (fieldName === 'dateOfBirth') {
        return !validateDateOfBirth(form.dateOfBirth);
      }

      // Validate other fields
      if (fieldName === 'email') {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      }
      if (fieldName === 'password') {
        return strength >= 3;
      }

      if (fieldName === 'confirmPassword') {
        return form.confirmPassword === form.password;
      }

      return true;
      // !fieldError(field as FieldName) && (field === 'gender' || Boolean(form[field as FieldName])))
    });
  };
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const allTouched = Object.keys(initialForm).reduce(
            (acc, key) => ({
                ...acc,
                [key]: true,
            }),
            {} as Partial<Record<FieldName, boolean>>
        );

        setTouched(allTouched);

        if (!isValid()) return;

        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
            });

            if (error) {
                console.error('Registration failed:', error.message);
                return;
            }

            const accessToken = data.session?.access_token;
            if (!accessToken) {
              console.error('Access token not set:', accessToken);
              return;
            }

            const response = await fetch("http://localhost:8000/api/registration", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,

              },
              body: JSON.stringify({
                username: form.username,
                firstName: form.firstName,
                lastName: form.lastName,
                gender: form.gender,
                birthDate: form.dateOfBirth
              }),
            });
            if (!response.ok) {
              console.error("Customer registration failed:", response.status);
              return;
            }
            console.log('Registration request succeeded:', data.user?.id);

            setSuccess(true);

            // If email confirmation is enabled, the user
            // must confirm their email before signing in.
            // Do not start the marketplace transition yet.

        } catch (error) {
            console.error('Unexpected registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const inputClass = (field: FieldName) => `mt-2 h-11 w-full rounded-md border bg-[#10151B] px-3.5 text-sm text-[#E6EDF3] outline-none transition placeholder:text-[#94A3B8]/60 focus:border-[#3DD9E8] focus:ring-2 focus:ring-[#3DD9E8]/20 ${touched[field] && fieldError(field) ? 'border-red-400' : touched[field] && form[field] ? 'border-[#3DD9E8]' : 'border-[#34414D]'}`;
  return <div className="min-h-screen bg-[#10151B] text-[#E6EDF3] selection:bg-[#3DD9E8]/30">
      {showMarketplace && <MarketplaceHome phase={transitionPhase} />}
      {(!showMarketplace || isTransitioning) && <div className={`transition-opacity duration-300 ease-out ${isTransitioning ? 'fixed inset-0 overflow-auto opacity-0' : 'opacity-100'}`}>
          <main className="min-h-screen bg-[#10151B] text-[#E6EDF3] selection:bg-[#3DD9E8]/30">
            <div className="nexus-signup-layout mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[45%_55%]">
              <section className="nexus-signup-intro relative flex min-h-[690px] flex-col overflow-hidden border-b border-[#34414D] px-6 py-8 sm:px-10 lg:min-h-screen lg:border-b-0 lg:border-r lg:px-[clamp(3rem,7vw,7.5rem)] lg:py-12">
                <div className="pointer-events-none absolute inset-0 opacity-[0.045]" style={{
              backgroundImage: 'linear-gradient(#94A3B8 1px, transparent 1px), linear-gradient(90deg, #94A3B8 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />
                <div className="relative z-10 flex items-center gap-3">
                  <LogoMark />
                  <div>
                    <p className="text-[19px] font-semibold tracking-[0.32em] text-[#E6EDF3]">NEXUS</p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-[#94A3B8]">Science &amp; Technology Marketplace</p>
                  </div>
                </div>

                <div className="nexus-signup-heading relative z-10 mt-20 max-w-xl lg:mt-[clamp(5rem,13vh,10rem)]">
                  <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-[#3DD9E8]">// Open the next frontier</p>
                  <h1 className="max-w-[570px] text-[clamp(2.8rem,5vw,5.5rem)] font-bold leading-[0.96] tracking-[-0.055em] text-[#E6EDF3]">Where Innovation Finds Its Marketplace</h1>
                  <p className="mt-7 max-w-lg text-[15px] leading-7 text-[#94A3B8]">Discover, create, and trade technology with engineers, researchers, and independent makers from around the world.</p>
                </div>

                <svg aria-hidden="true" className="nexus-signup-art relative z-10 mt-10 h-[270px] w-full max-w-[620px] flex-1 min-h-[220px]" viewBox="0 0 600 300" fill="none">
                  <g stroke="#3DD9E8" strokeOpacity=".23" strokeWidth="1">
                    <path d="M8 232h94l28-28h77l38-38h97l43-43h101l41-41h72" />
                    <path d="M12 264h132l32-32h72l28-28h101l38-38h80l30-30h80" />
                    <path d="M58 40h96l34 34h96l31 31h97l34 34h103" />
                    <path d="M286 15v85l-42 42v84" />
                    <path d="M424 42v71l-38 38v69" />
                    <path d="M165 78v87l-31 31v46" />
                    <circle cx="286" cy="100" r="60" opacity=".45" /><circle cx="286" cy="100" r="88" opacity=".22" /><circle cx="286" cy="100" r="118" opacity=".12" />
                    <path d="M474 50l42 24v48l-42 24-42-24V74z" /><path d="M109 164l30 17v34l-30 17-30-17v-34z" />
                  </g>
                  <g fill="#3DD9E8" fillOpacity=".65">
                    <circle cx="8" cy="232" r="3" /><circle cx="207" cy="166" r="3" /><circle cx="344" cy="123" r="3" /><circle cx="485" cy="41" r="3" /><circle cx="286" cy="100" r="4" /><circle cx="424" cy="113" r="3" />
                  </g>
                  <g fill="#94A3B8" fillOpacity=".3">{svgDots.map(dot => <circle key={dot.id} cx={dot.cx} cy={dot.cy} r="1.5" />)}</g>
                  <text x="375" y="282" fill="#3DD9E8" fillOpacity=".4" fontSize="9" letterSpacing="3">NXS / 001</text>
                </svg>

                <div className="relative z-10 mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-[#34414D] pt-5 text-[11px] text-[#94A3B8]">
                  {trustBadges.map(badge => <span className="inline-flex items-center gap-2" key={badge.label}>{badge.icon}<span>{badge.label}</span>{badge.label !== 'Global shipping' && <span className="ml-2 hidden text-[#3DD9E8] sm:inline">•</span>}</span>)}
                </div>
              </section>

              <section className="nexus-signup-panel flex items-center justify-center px-5 py-10 sm:px-10 lg:px-[clamp(3rem,8vw,10rem)] lg:py-16">
                <div className="nexus-signup-card w-full max-w-[570px] rounded-xl border border-[#34414D] bg-[#1B242D] p-6 shadow-2xl shadow-black/10 sm:p-10">
                  <div className="mb-8">
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#3DD9E8]">Create your access key</p>
                    <h2 className="text-[28px] font-bold leading-tight tracking-[-0.03em] text-[#E6EDF3]">Join the next generation of makers</h2>
                    <p className="mt-3 max-w-md text-sm leading-6 text-[#94A3B8]">Create your account to explore technology, discover independent creators, and find your next innovation.</p>
                  </div>
                  {success && <div role="status" className="mb-6 flex items-center gap-2 rounded-md border border-[#3DD9E8]/40 bg-[#3DD9E8]/10 px-3.5 py-3 text-sm text-[#3DD9E8]"><Check size={16} /><span>Account created! Welcome to NEXUS</span></div>}
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="block text-xs font-medium text-[#E6EDF3]">First Name <span className="text-[#3DD9E8]">*</span><input aria-label="First Name" className={inputClass('firstName')} value={form.firstName} onChange={e => updateField('firstName', e.target.value)} onBlur={() => setTouched(v => ({
                      ...v,
                      firstName: true
                    }))} />{fieldError('firstName') && <span className="mt-1 block text-xs text-red-300">{fieldError('firstName')}</span>}</label>
                      <label className="block text-xs font-medium text-[#E6EDF3]">Last Name <span className="text-[#3DD9E8]">*</span><input aria-label="Last Name" className={inputClass('lastName')} value={form.lastName} onChange={e => updateField('lastName', e.target.value)} onBlur={() => setTouched(v => ({
                      ...v,
                      lastName: true
                    }))} />{fieldError('lastName') && <span className="mt-1 block text-xs text-red-300">{fieldError('lastName')}</span>}</label>
                    </div>
                    <label className="block text-xs font-medium text-[#E6EDF3]">Username <span className="text-[#3DD9E8]">*</span><input aria-label="Username" placeholder="e.g. orbital_maker" className={`${inputClass('username')} font-mono`} value={form.username} onChange={e => updateField('username', e.target.value)} onBlur={() => setTouched(v => ({
                    ...v,
                    username: true
                  }))} />{fieldError('username') && <span className="mt-1 block text-xs text-red-300">{fieldError('username')}</span>}</label>
                    <label className="block text-xs font-medium text-[#E6EDF3]">Email Address <span className="text-[#3DD9E8]">*</span><input type="email" aria-label="Email Address" className={inputClass('email')} value={form.email} onChange={e => updateField('email', e.target.value)} onBlur={() => setTouched(v => ({
                    ...v,
                    email: true
                  }))} />{fieldError('email') && <span className="mt-1 block text-xs text-red-300">{fieldError('email')}</span>}</label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="block text-xs font-medium text-[#E6EDF3]">Date of Birth <span className="text-[#3DD9E8]">*</span><input type="date" lang="enGB" aria-label="Date of Birth" className={inputClass('dateOfBirth')} value={form.dateOfBirth} onChange={e => updateField('dateOfBirth', e.target.value)} onBlur={() => setTouched(v => ({
                      ...v,
                      dateOfBirth: true
                    }))} />{fieldError('dateOfBirth') && <span className="mt-1 block text-xs text-red-300">{fieldError('dateOfBirth')}</span>}</label>
                      <label className="block text-xs font-medium text-[#E6EDF3]">Gender <span className="text-[#94A3B8]">(optional)</span><select aria-label="Gender" className={inputClass('gender')} value={form.gender} onChange={e => updateField('gender', e.target.value)}><option value="">Prefer not to say</option><option>Male</option><option>Female</option><option>Non-binary</option><option>Other</option></select></label>
                    </div>
                    <label className="block text-xs font-medium text-[#E6EDF3]">Password <span className="text-[#3DD9E8]">*</span><span className="relative block"><input type={showPassword ? 'text' : 'password'} aria-label="Password" className={`${inputClass('password')} pr-11`} value={form.password} onChange={e => updateField('password', e.target.value)} onBlur={() => setTouched(v => ({
                      ...v,
                      password: true
                    }))} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#3DD9E8]">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{fieldError('password') && <span className="mt-1 block text-xs text-red-300">{fieldError('password')}</span>}<span className="mt-3 flex items-center gap-2"><span className="flex flex-1 gap-1">{strengthSegments.map((segment, segmentIndex) => <span key={segment.id} className={`h-1 flex-1 rounded-full transition-colors ${segmentIndex < strength ? segment.activeClass : 'bg-[#34414D]'}`} />)}</span><span className="w-[94px] text-right text-[10px] text-[#94A3B8]">Password strength</span></span></label>
                    <label className="block text-xs font-medium text-[#E6EDF3]">Confirm Password <span className="text-[#3DD9E8]">*</span><span className="relative block"><input type={showConfirm ? 'text' : 'password'} aria-label="Confirm Password" className={`${inputClass('confirmPassword')} pr-11`} value={form.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} onBlur={() => setTouched(v => ({
                      ...v,
                      confirmPassword: true
                    }))} /><button type="button" aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'} onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#3DD9E8]">{showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{fieldError('confirmPassword') && <span className="mt-1 block text-xs text-red-300">{fieldError('confirmPassword')}</span>}</label>
                    <button type="submit" disabled={isLoading} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#3DD9E8] text-base font-bold text-[#10151B] transition hover:bg-[#68e3ee] hover:shadow-[0_0_22px_rgba(61,217,232,0.28)] disabled:cursor-wait disabled:opacity-70">{isLoading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#10151B]/30 border-t-[#10151B]" aria-label="Creating account" /> : <span className="inline-flex items-center gap-2"><span>Create Account</span><ArrowRight size={17} /></span>}</button>
                  </form>
                  <p className="mt-6 text-center text-sm text-[#94A3B8]">Already have an account? <button type="button" className="font-medium text-[#3DD9E8] underline-offset-4 hover:underline">Log in</button></p>
                  <p className="mt-5 text-center font-mono text-[10px] tracking-wide text-[#94A3B8]/60">By continuing, you agree to the NEXUS marketplace terms.</p>
                </div>
              </section>
            </div>
          </main>
        </div>}
      {!showMarketplace && <button type="button" onClick={startTransition} className="fixed bottom-5 right-5 z-50 rounded-md border border-[#34414D] bg-transparent px-[14px] py-[6px] text-[12px] font-medium text-[#94A3B8] transition hover:border-[#3DD9E8] hover:text-[#3DD9E8]">
          <span>Preview Transition</span>
        </button>}
      <RegistrationTransition phase={transitionPhase} reducedMotion={reducedMotion} />
    </div>;
};