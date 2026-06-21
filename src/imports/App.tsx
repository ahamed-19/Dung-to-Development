import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Home, User, Users, QrCode, ClipboardList,
  CreditCard, BarChart3, FileText, Package, Factory, ShoppingCart,
  Bell, Settings, UserCircle, Scan, Bluetooth, PlusCircle, LogOut,
  Menu, X, ChevronRight, CheckCircle, AlertCircle, AlertTriangle,
  IndianRupee, TrendingUp, MapPin, Weight, Upload, Check, Circle,
  FileSpreadsheet, File, HardHat, Shield
} from "lucide-react";

// ─── Translations ───────────────────────────────────────────────────────────
const translations: Record<string, Record<string, string>> = {
  en: {
    dashboard: "Dashboard", houses: "House Management", houseProfile: "House Profile",
    workers: "Worker Management", qrManagement: "QR Management", collections: "Collection Monitoring",
    payments: "Payments", analytics: "Analytics", reports: "Reports", inventory: "Inventory",
    manufacturing: "Product Manufacturing", ecommerce: "E-Commerce", notifications: "Notifications",
    settings: "Settings", profile: "Profile", qrScanner: "QR Scanner",
    bluetoothScale: "Bluetooth Scale", collectionEntry: "Collection Entry", logout: "Logout",
    totalHouses: "Total Houses", totalWorkers: "Total Workers", todayCollection: "Today Collection",
    monthlyCollection: "Monthly Collection", revenueGenerated: "Revenue Generated",
    pendingPayments: "Pending Payments", inventoryStock: "Inventory Stock",
    marketplaceOrders: "Marketplace Orders", weeklyCollectionTrend: "Weekly Collection Trend",
    recentActivity: "Recent Activity", searchHouses: "Search houses...", addHouse: "+ Add House",
    allVillages: "All Villages", searchWorkers: "Search workers...", addWorker: "+ Add Worker",
    totalQRCodes: "Total QR Codes", assigned: "Assigned", unassigned: "Unassigned",
    qrCodeManagement: "QR Code Management", totalWeight: "Total Weight", earnings: "Earnings",
    recentCollections: "Recent Collections", daily: "Daily", weekly: "Weekly",
    monthly: "Monthly", yearly: "Yearly", date: "Date", weight: "Weight",
    amount: "Amount", status: "Status", complete: "Complete", pending: "Pending",
    completed: "Completed", all: "All", totalPaid: "Total Paid",
    todayRoute: "Today's Route", housesCovered: "Houses Covered",
    remaining: "Remaining", weightCollected: "Weight Collected",
    earningsToday: "Earnings Today", newCollectionEntry: "New Collection Entry",
    houseNumber: "House Number", houseOwner: "House Owner", ratePerKg: "Rate Per KG (₹)",
    totalAmount: "Total Amount", saveCollection: "Save Collection",
    collectionHistory: "Collection History", verifyPassword: "Verify Password",
    viewQrCode: "View QR Code", accessDenied: "Access Denied. Wrong password.",
    selectRole: "Select Role", forgotPassword: "Forgot Password?", createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account?", login: "Login",
    createAccountTitle: "Create Account", joinNetwork: "Join D2D Village Network",
    personalInfo: "Personal Information", addressInfo: "Address Information",
    houseDetails: "House Details", identityVerification: "Identity Verification",
    reviewSubmit: "Review & Submit", back: "← Back", next: "Next →", submit: "Submit",
    products: "Products", addToCart: "Add", cart: "Cart", placeOrder: "Place Order",
    manufacturingPipeline: "Manufacturing Pipeline", lowStock: "Low Stock",
    inStock: "In Stock", totalProducts: "Total Products", totalUnits: "Total Units",
    dailyCollection: "Daily Collection (kg)", revenueGrowth: "Revenue Growth (₹)",
    villagePerformance: "Village Performance", productSales: "Product Sales",
    connectDevice: "Connect Device", captureWeight: "Capture Weight",
    liveWeightReading: "Live Weight Reading", kilograms: "Kilograms",
    pointCamera: "Point camera at QR Code", autoDetection: "Auto-detection enabled",
    simulateScan: "Simulate Scan", bluetoothScale2: "Bluetooth Weight Scale",
    connectToScale: "Connect to your weight machine",
    welcomeToD2D: "Welcome to D2D", transformingWaste: "Transforming Waste Into Wealth",
    thisWeek: "This Week", thisMonth: "This Month", today: "Today",
    house: "House", worker: "Worker", time: "Time", trips: "trips",
    totalEarnings: "Total Earnings", yourQrCode: "Your QR Code",
    cancel: "Cancel", verify: "Verify",
  },
  ta: {
    dashboard: "டாஷ்போர்டு", houses: "வீடுகள்", houseProfile: "வீட்டு சுயவிவரம்",
    workers: "பணியாளர்கள்", qrManagement: "QR நிர்வாகம்", collections: "சேகரிப்புகள்",
    payments: "பணம்", analytics: "பகுப்பாய்வு", reports: "அறிக்கைகள்", inventory: "சரக்கு",
    manufacturing: "உற்பத்தி", ecommerce: "மின்னணு வணிகம்", notifications: "அறிவிப்புகள்",
    settings: "அமைப்புகள்", profile: "சுயவிவரம்", qrScanner: "QR ஸ்கேனர்",
    bluetoothScale: "ப்ளூடூத் எடை இயந்திரம்", collectionEntry: "சேகரிப்பு பதிவு",
    logout: "வெளியேறு", totalHouses: "மொத்த வீடுகள்", totalWorkers: "மொத்த பணியாளர்கள்",
    todayCollection: "இன்றைய சேகரிப்பு", monthlyCollection: "மாதாந்திர சேகரிப்பு",
    revenueGenerated: "வருவாய்", pendingPayments: "நிலுவை பணம்",
    inventoryStock: "சரக்கு இருப்பு", marketplaceOrders: "சந்தை ஆர்டர்கள்",
    weeklyCollectionTrend: "வாராந்திர சேகரிப்பு", recentActivity: "சமீபத்திய செயல்பாடுகள்",
    searchHouses: "வீடுகளை தேடுங்கள்...", addHouse: "+ வீடு சேர்க்க",
    allVillages: "அனைத்து கிராமங்கள்", searchWorkers: "பணியாளர்களை தேடுங்கள்...",
    addWorker: "+ பணியாளர் சேர்க்க", totalQRCodes: "மொத்த QR குறியீடுகள்",
    assigned: "ஒதுக்கப்பட்டது", unassigned: "ஒதுக்கப்படாதது",
    qrCodeManagement: "QR நிர்வாகம்", totalWeight: "மொத்த எடை", earnings: "வருமானம்",
    recentCollections: "சமீபத்திய சேகரிப்புகள்", daily: "தினசரி", weekly: "வாராந்திரம்",
    monthly: "மாதாந்திரம்", yearly: "வார்டாண்டிரம்", date: "தேதி", weight: "எடை",
    amount: "தொகை", status: "நிலை", complete: "முடிந்தது", pending: "நிலுவையில்",
    completed: "முடிந்தது", all: "அனைத்தும்", totalPaid: "மொத்தம் கொடுத்தது",
    todayRoute: "இன்றைய பாதை", housesCovered: "வீடுகள் முடிந்தது",
    remaining: "மீதமுள்ளது", weightCollected: "சேகரித்த எடை",
    earningsToday: "இன்றைய வருமானம்", newCollectionEntry: "புதிய சேகரிப்பு பதிவு",
    houseNumber: "வீட்டு எண்", houseOwner: "வீட்டு உரிமையாளர்", ratePerKg: "கிலோவிற்கு விலை (₹)",
    totalAmount: "மொத்த தொகை", saveCollection: "சேகரிப்பு சேமி",
    collectionHistory: "சேகரிப்பு வரலாறு", verifyPassword: "கடவுச்சொல் சரிபார்",
    viewQrCode: "QR குறியீடு பார்க்க", accessDenied: "அணுகல் மறுக்கப்பட்டது. தவறான கடவுச்சொல்.",
    selectRole: "பாத்திரம் தேர்வு", forgotPassword: "கடவுச்சொல் மறந்தீர்களா?",
    createAccount: "கணக்கு உருவாக்கு", alreadyHaveAccount: "ஏற்கனவே கணக்கு இருக்கிறதா?",
    login: "உள்நுழைய", createAccountTitle: "கணக்கு உருவாக்கு",
    joinNetwork: "D2D கிராம வலையமைப்பில் சேரவும்",
    personalInfo: "தனிப்பட்ட தகவல்", addressInfo: "முகவரி தகவல்",
    houseDetails: "வீட்டு விவரங்கள்", identityVerification: "அடையாள சரிபார்ப்பு",
    reviewSubmit: "மதிப்பீடு & சமர்ப்பிக்கவும்", back: "← பின்னால்",
    next: "அடுத்து →", submit: "சமர்ப்பி", products: "தயாரிப்புகள்",
    addToCart: "சேர்க்க", cart: "வண்டி", placeOrder: "ஆர்டர் போட",
    manufacturingPipeline: "உற்பத்தி வழிமுறை", lowStock: "குறைந்த சரக்கு",
    inStock: "சரக்கு இருக்கிறது", totalProducts: "மொத்த தயாரிப்புகள்",
    totalUnits: "மொத்த அலகுகள்", dailyCollection: "தினசரி சேகரிப்பு (கிலோ)",
    revenueGrowth: "வருவாய் வளர்ச்சி (₹)", villagePerformance: "கிராம செயல்திறன்",
    productSales: "தயாரிப்பு விற்பனை", connectDevice: "சாதனம் இணைக்க",
    captureWeight: "எடை பதிவு", liveWeightReading: "நேரடி எடை அளவீடு",
    kilograms: "கிலோகிராம்", pointCamera: "QR குறியீட்டை நோக்கி கேமரா பிடிக்கவும்",
    autoDetection: "தானியங்கி கண்டறிதல் இயக்கப்பட்டது", simulateScan: "ஸ்கேன் பரீட்சை",
    bluetoothScale2: "ப்ளூடூத் எடை இயந்திரம்", connectToScale: "எடை இயந்திரத்துடன் இணைக்கவும்",
    welcomeToD2D: "D2D-க்கு வரவேற்கிறோம்", transformingWaste: "கழிவை வளமாக மாற்றுகிறோம்",
    thisWeek: "இந்த வாரம்", thisMonth: "இந்த மாதம்", today: "இன்று",
    house: "வீடு", worker: "பணியாளர்", time: "நேரம்", trips: "பயணங்கள்",
    totalEarnings: "மொத்த வருமானம்", yourQrCode: "உங்கள் QR குறியீடு",
    cancel: "ரத்து செய்", verify: "சரிபார்",
  }
};

// ─── Data ────────────────────────────────────────────────────────────────────
const houses = [
  { id: 'H001', owner: 'Ramesh Kumar', village: 'Sundarpur', phone: '9876543210', collections: 45, earnings: 2250 },
  { id: 'H002', owner: 'Sita Devi', village: 'Sundarpur', phone: '9876543211', collections: 38, earnings: 1900 },
  { id: 'H003', owner: 'Mohan Lal', village: 'Greenville', phone: '9876543212', collections: 52, earnings: 2600 },
];
const workers = [
  { id: 'W001', name: 'Suresh Yadav', phone: '9988776655', area: 'Zone A', collections: 120 },
  { id: 'W002', name: 'Raju Singh', phone: '9988776656', area: 'Zone B', collections: 98 },
];
const products = [
  { id: 1, name: 'Organic Compost', price: 299, rating: 4.5, desc: 'Premium quality organic compost for healthy plant growth.' },
  { id: 2, name: 'Organic Fertilizer', price: 449, rating: 4.7, desc: 'Natural fertilizer granules for agriculture.' },
  { id: 3, name: 'Cow Dung Diyas', price: 149, rating: 4.8, desc: 'Handmade traditional diyas for festivals.' },
  { id: 4, name: 'Incense Sticks', price: 99, rating: 4.3, desc: 'Natural aromatic incense sticks.' },
  { id: 5, name: 'Mosquito Repellent', price: 79, rating: 4.1, desc: 'Organic mosquito repellent coils.' },
  { id: 6, name: 'Eco Handicrafts', price: 599, rating: 4.9, desc: 'Beautiful handmade eco-friendly crafts.' },
];
const notificationsData: Record<string, string[]> = {
  admin: ['New collection entry from Zone A', 'Payment pending for H003', 'Low stock alert: Diyas', 'Monthly report ready'],
  worker: ['New route assigned: Zone A', 'Collection target updated', '5 houses remaining today'],
  user: ['Payment of ₹150 credited', 'Collection recorded: 3kg', 'Order #1234 shipped']
};

const reportData: Record<string, Array<{ d: string; w: string; a: string; s: string }>> = {
  daily: [
    { d: '17 Jun', w: '342 kg', a: '₹1,710', s: 'Complete' },
    { d: '16 Jun', w: '298 kg', a: '₹1,490', s: 'Complete' },
    { d: '15 Jun', w: '315 kg', a: '₹1,575', s: 'Complete' },
    { d: '14 Jun', w: '280 kg', a: '₹1,400', s: 'Complete' },
    { d: '13 Jun', w: '260 kg', a: '₹1,300', s: 'Complete' },
  ],
  weekly: [
    { d: 'Week 24 (10–16 Jun)', w: '2,010 kg', a: '₹10,050', s: 'Complete' },
    { d: 'Week 23 (3–9 Jun)', w: '1,850 kg', a: '₹9,250', s: 'Complete' },
    { d: 'Week 22 (27 May–2 Jun)', w: '1,960 kg', a: '₹9,800', s: 'Complete' },
    { d: 'Week 21 (20–26 May)', w: '1,720 kg', a: '₹8,600', s: 'Complete' },
  ],
  monthly: [
    { d: 'Jun 2026', w: '8,500 kg', a: '₹42,500', s: 'In Progress' },
    { d: 'May 2026', w: '9,200 kg', a: '₹46,000', s: 'Complete' },
    { d: 'Apr 2026', w: '8,800 kg', a: '₹44,000', s: 'Complete' },
    { d: 'Mar 2026', w: '7,600 kg', a: '₹38,000', s: 'Complete' },
    { d: 'Feb 2026', w: '6,900 kg', a: '₹34,500', s: 'Complete' },
    { d: 'Jan 2026', w: '7,200 kg', a: '₹36,000', s: 'Complete' },
  ],
  yearly: [
    { d: '2026 (Jan–Jun)', w: '48,200 kg', a: '₹2,41,000', s: 'In Progress' },
    { d: '2025', w: '98,500 kg', a: '₹4,92,500', s: 'Complete' },
    { d: '2024', w: '85,200 kg', a: '₹4,26,000', s: 'Complete' },
  ],
};

// ─── Menus ───────────────────────────────────────────────────────────────────
const menus: Record<string, Array<{ id: string; icon: React.ComponentType<{ className?: string }>; key: string }>> = {
  admin: [
    { id: 'dashboard', icon: LayoutDashboard, key: 'dashboard' },
    { id: 'houses', icon: Home, key: 'houses' },
    { id: 'house-profile', icon: User, key: 'houseProfile' },
    { id: 'workers', icon: Users, key: 'workers' },
    { id: 'qr-manage', icon: QrCode, key: 'qrManagement' },
    { id: 'collections', icon: ClipboardList, key: 'collections' },
    { id: 'payments', icon: CreditCard, key: 'payments' },
    { id: 'analytics', icon: BarChart3, key: 'analytics' },
    { id: 'reports', icon: FileText, key: 'reports' },
    { id: 'inventory', icon: Package, key: 'inventory' },
    { id: 'manufacturing', icon: Factory, key: 'manufacturing' },
    { id: 'ecommerce', icon: ShoppingCart, key: 'ecommerce' },
    { id: 'notifications', icon: Bell, key: 'notifications' },
    { id: 'settings', icon: Settings, key: 'settings' },
    { id: 'profile', icon: UserCircle, key: 'profile' },
  ],
  worker: [
    { id: 'dashboard', icon: LayoutDashboard, key: 'dashboard' },
    { id: 'houses', icon: Home, key: 'houses' },
    { id: 'qr-scanner', icon: Scan, key: 'qrScanner' },
    { id: 'bluetooth', icon: Bluetooth, key: 'bluetoothScale' },
    { id: 'collection-entry', icon: PlusCircle, key: 'collectionEntry' },
    { id: 'notifications', icon: Bell, key: 'notifications' },
    { id: 'settings', icon: Settings, key: 'settings' },
    { id: 'profile', icon: UserCircle, key: 'profile' },
  ],
  user: [
    { id: 'dashboard', icon: LayoutDashboard, key: 'dashboard' },
    { id: 'reports', icon: FileText, key: 'reports' },
    { id: 'ecommerce', icon: ShoppingCart, key: 'ecommerce' },
    { id: 'notifications', icon: Bell, key: 'notifications' },
    { id: 'settings', icon: Settings, key: 'settings' },
    { id: 'profile', icon: UserCircle, key: 'profile' },
  ],
};

// ─── Toast ───────────────────────────────────────────────────────────────────
interface ToastMsg { id: number; msg: string; type: string }
let toastId = 0;
function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const show = (msg: string, type = 'success') => {
    const id = ++toastId;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };
  return { toasts, show };
}

// ─── StatCard ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    eco: 'bg-green-100 text-green-600', sky: 'bg-sky-100 text-sky-600',
    amber: 'bg-amber-100 text-amber-600', green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600', purple: 'bg-purple-100 text-purple-600',
  };
  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color] || colors.eco}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Pages ───────────────────────────────────────────────────────────────────
function AdminDashboard({ t }: { t: (k: string) => string }) {
  const bars = [65, 80, 45, 90, 70, 85, 95];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard icon={Home} label={t('totalHouses')} value="156" color="eco" />
        <StatCard icon={Users} label={t('totalWorkers')} value="12" color="sky" />
        <StatCard icon={ClipboardList} label={t('todayCollection')} value="342 kg" color="amber" />
        <StatCard icon={ClipboardList} label={t('monthlyCollection')} value="8.5 Tons" color="eco" />
        <StatCard icon={IndianRupee} label={t('revenueGenerated')} value="₹2,45,000" color="green" />
        <StatCard icon={ClipboardList} label={t('pendingPayments')} value="₹18,500" color="red" />
        <StatCard icon={Package} label={t('inventoryStock')} value="2,340 units" color="purple" />
        <StatCard icon={ShoppingCart} label={t('marketplaceOrders')} value="28" color="sky" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">{t('weeklyCollectionTrend')}</h3>
          <div className="flex items-end gap-2 h-32">
            {bars.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-green-400 rounded-t" style={{ height: `${v}%` }} />
                <span className="text-[10px] text-gray-400 mt-1">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">{t('recentActivity')}</h3>
          <div className="space-y-3 text-sm">
            {[
              { dot: 'bg-green-500', text: 'H001 collected 5kg - Zone A', time: '2m ago' },
              { dot: 'bg-sky-500', text: 'Payment ₹500 to Ramesh', time: '15m ago' },
              { dot: 'bg-amber-500', text: 'New order #1245 placed', time: '1h ago' },
              { dot: 'bg-green-500', text: 'Worker Suresh completed route', time: '2h ago' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-2 h-2 ${a.dot} rounded-full`} />
                <span className="text-gray-600 flex-1">{a.text}</span>
                <span className="text-xs text-gray-400">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkerDashboard({ t }: { t: (k: string) => string }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard icon={ClipboardList} label={t('todayCollection')} value="45 kg" color="eco" />
        <StatCard icon={Home} label={t('housesCovered')} value="8/15" color="sky" />
        <StatCard icon={MapPin} label={t('remaining')} value="7 houses" color="amber" />
        <StatCard icon={Weight} label={t('weightCollected')} value="45 kg" color="green" />
        <StatCard icon={IndianRupee} label={t('earningsToday')} value="₹225" color="purple" />
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3">{t('todayRoute')}</h3>
        <div className="space-y-2">
          {houses.map((h, i) => (
            <div key={h.id} className={`flex items-center gap-3 p-2 rounded-lg ${i < 2 ? 'bg-green-50' : 'bg-gray-50'}`}>
              <span className={`w-6 h-6 rounded-full ${i < 2 ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
                {i < 2 ? <Check className="w-3 h-3 text-white" /> : <Circle className="w-3 h-3 text-white" />}
              </span>
              <span className="text-sm font-medium">{h.id} - {h.owner}</span>
              <span className="text-xs text-gray-400 ml-auto">{h.village}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserDashboard({ t, userName, onViewQr }: { t: (k: string) => string; userName: string; onViewQr: () => void }) {
  const history = [
    { d: '17 Jun', w: '3 kg', a: '₹15' }, { d: '16 Jun', w: '4 kg', a: '₹20' },
    { d: '15 Jun', w: '2.5 kg', a: '₹12.50' }, { d: '14 Jun', w: '5 kg', a: '₹25' }
  ];
  return (
    <div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
            {userName[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{userName}</h3>
            <p className="text-sm text-gray-500">House: H001 | Village: Sundarpur</p>
          </div>
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4 mb-4 text-center">
        <p className="text-xs text-gray-500 mb-2">{t('yourQrCode')}</p>
        <div className="inline-block p-4 bg-white rounded-lg border blur-sm">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <rect width="120" height="120" fill="white"/>
            <rect x="10" y="10" width="30" height="30" fill="black"/>
            <rect x="80" y="10" width="30" height="30" fill="black"/>
            <rect x="10" y="80" width="30" height="30" fill="black"/>
            <rect x="50" y="50" width="20" height="20" fill="black"/>
            <rect x="20" y="50" width="10" height="10" fill="black"/>
            <rect x="60" y="20" width="10" height="10" fill="black"/>
            <rect x="50" y="80" width="10" height="10" fill="black"/>
            <rect x="90" y="60" width="10" height="10" fill="black"/>
          </svg>
        </div>
        <div className="mt-3">
          <button onClick={onViewQr} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium">
            {t('viewQrCode')}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard icon={ClipboardList} label={t('todayCollection')} value="3 kg" color="eco" />
        <StatCard icon={ClipboardList} label={t('monthlyCollection')} value="68 kg" color="sky" />
        <StatCard icon={IndianRupee} label={t('totalEarnings')} value="₹2,250" color="amber" />
        <StatCard icon={TrendingUp} label={t('thisMonth')} value="₹340" color="green" />
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">{t('collectionHistory')}</h3>
        <div className="space-y-2 text-sm">
          {history.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600">{r.d}</span>
              <span className="font-medium">{r.w}</span>
              <span className="text-green-600 font-medium">{r.a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HousesPage({ t, role, onNavigate }: { t: (k: string) => string; role: string; onNavigate: (p: string) => void }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input className="flex-1 px-4 py-2 rounded-lg border bg-white" placeholder={t('searchHouses')} />
        <select className="px-4 py-2 rounded-lg border bg-white">
          <option>{t('allVillages')}</option>
          <option>Sundarpur</option>
          <option>Greenville</option>
        </select>
        {role === 'admin' && (
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium whitespace-nowrap">
            {t('addHouse')}
          </button>
        )}
      </div>
      <div className="space-y-3">
        {houses.map(h => (
          <div key={h.id} className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition"
            onClick={() => onNavigate('house-profile')}>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center font-bold text-green-700 text-sm">{h.id.slice(-2)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{h.owner}</p>
              <p className="text-xs text-gray-400">{h.id} • {h.village}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">₹{h.earnings}</p>
              <p className="text-xs text-gray-400">{h.collections} {t('collections')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HouseProfilePage({ t }: { t: (k: string) => string }) {
  const h = houses[0];
  return (
    <div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">RK</div>
          <div>
            <h3 className="font-bold text-gray-800">{h.owner}</h3>
            <p className="text-sm text-gray-500">{h.id} • {h.village}</p>
            <p className="text-xs text-gray-400">{h.phone}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-green-50 rounded-lg p-3"><p className="text-lg font-bold text-green-700">{h.collections}</p><p className="text-[10px] text-gray-500">{t('collections')}</p></div>
          <div className="bg-sky-50 rounded-lg p-3"><p className="text-lg font-bold text-sky-700">225 kg</p><p className="text-[10px] text-gray-500">{t('totalWeight')}</p></div>
          <div className="bg-amber-50 rounded-lg p-3"><p className="text-lg font-bold text-amber-700">₹{h.earnings}</p><p className="text-[10px] text-gray-500">{t('earnings')}</p></div>
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4">
        <h4 className="font-semibold text-gray-800 mb-3">{t('recentCollections')}</h4>
        <div className="space-y-2 text-sm">
          {[{d:'17 Jun 2026',w:'5 kg',a:'₹25'},{d:'16 Jun 2026',w:'4 kg',a:'₹20'},{d:'15 Jun 2026',w:'3 kg',a:'₹15'}].map((r, i) => (
            <div key={i} className="flex justify-between p-2 bg-gray-50 rounded-lg">
              <span>{r.d}</span><span className="font-medium">{r.w}</span><span className="text-green-600">{r.a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkersPage({ t }: { t: (k: string) => string }) {
  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input className="flex-1 px-4 py-2 rounded-lg border bg-white" placeholder={t('searchWorkers')} />
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium whitespace-nowrap">
          {t('addWorker')}
        </button>
      </div>
      <div className="space-y-3">
        {workers.map(w => (
          <div key={w.id} className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center font-bold text-sky-700 text-sm">{w.name[0]}</div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{w.name}</p>
              <p className="text-xs text-gray-400">{w.id} • {w.area}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{w.collections} {t('trips')}</p>
              <p className="text-xs text-gray-400">{w.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QrManagePage({ t }: { t: (k: string) => string }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <StatCard icon={QrCode} label={t('totalQRCodes')} value="156" color="eco" />
        <StatCard icon={CheckCircle} label={t('assigned')} value="148" color="sky" />
        <StatCard icon={AlertCircle} label={t('unassigned')} value="8" color="amber" />
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">{t('qrCodeManagement')}</h3>
        <div className="space-y-2">
          {houses.map(h => (
            <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div><p className="font-medium text-sm">{h.owner}</p><p className="text-xs text-gray-400">{h.id}</p></div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">{t('assigned')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QrScannerPage({ t, showToast }: { t: (k: string) => string; showToast: (m: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-64 h-64 rounded-2xl bg-gray-900 relative overflow-hidden flex items-center justify-center mb-4">
        <div className="absolute inset-4 border-2 border-green-400 rounded-lg" />
        <div className="absolute w-full h-0.5 bg-green-400 animate-pulse" style={{ top: '50%' }} />
        <Scan className="w-12 h-12 text-green-400 opacity-50" />
      </div>
      <p className="text-gray-600 font-medium">{t('pointCamera')}</p>
      <p className="text-sm text-gray-400 mt-1">{t('autoDetection')}</p>
      <button onClick={() => showToast('QR Scanned: H001 - Ramesh Kumar')}
        className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium">
        {t('simulateScan')}
      </button>
    </div>
  );
}

function BluetoothPage({ t, showToast }: { t: (k: string) => string; showToast: (m: string) => void }) {
  const [weight, setWeight] = useState('0.0');
  const simulateBT = () => {
    showToast('Connected to Scale');
    let w = 0;
    const interval = setInterval(() => {
      w += 0.3;
      if (w > 4.5) { clearInterval(interval); return; }
      setWeight(w.toFixed(1));
    }, 200);
  };
  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-32 h-32 rounded-full bg-sky-50 flex items-center justify-center mb-4 relative">
        <div className="absolute inset-0 rounded-full border-4 border-sky-200 animate-pulse" />
        <Bluetooth className="w-12 h-12 text-sky-500" />
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">{t('bluetoothScale2')}</h3>
      <p className="text-sm text-gray-400 mb-6">{t('connectToScale')}</p>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-6 w-full max-w-sm text-center mb-4">
        <p className="text-xs text-gray-400">{t('liveWeightReading')}</p>
        <p className="text-5xl font-bold text-gray-800 my-3">{weight}</p>
        <p className="text-sm text-gray-500">{t('kilograms')}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={simulateBT} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium">
          {t('connectDevice')}
        </button>
        <button onClick={() => showToast(`Weight captured: ${weight} kg`)} className="px-4 py-2 rounded-lg bg-amber-100 text-amber-700 text-sm font-medium">
          {t('captureWeight')}
        </button>
      </div>
    </div>
  );
}

function CollectionEntryPage({ t, showToast }: { t: (k: string) => string; showToast: (m: string) => void }) {
  const [weight, setWeight] = useState('4.5');
  const [rate, setRate] = useState('5');
  const amount = (parseFloat(weight || '0') * parseFloat(rate || '0')).toFixed(2);
  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-5 max-w-lg mx-auto">
      <h3 className="font-semibold text-gray-800 mb-4">{t('newCollectionEntry')}</h3>
      <form onSubmit={e => { e.preventDefault(); showToast('Collection saved successfully!'); }} className="space-y-4">
        <div><label className="text-sm font-medium text-gray-700">{t('houseNumber')}</label><input className="w-full mt-1 px-3 py-2 rounded-lg border" defaultValue="H001" /></div>
        <div><label className="text-sm font-medium text-gray-700">{t('houseOwner')}</label><input className="w-full mt-1 px-3 py-2 rounded-lg border" defaultValue="Ramesh Kumar" readOnly /></div>
        <div><label className="text-sm font-medium text-gray-700">{t('date')}</label><input type="date" className="w-full mt-1 px-3 py-2 rounded-lg border" defaultValue="2026-06-17" /></div>
        <div><label className="text-sm font-medium text-gray-700">{t('weight')} (kg)</label><input type="number" step="0.1" className="w-full mt-1 px-3 py-2 rounded-lg border" value={weight} onChange={e => setWeight(e.target.value)} /></div>
        <div><label className="text-sm font-medium text-gray-700">{t('ratePerKg')}</label><input type="number" className="w-full mt-1 px-3 py-2 rounded-lg border" value={rate} onChange={e => setRate(e.target.value)} /></div>
        <div><label className="text-sm font-medium text-gray-700">{t('totalAmount')}</label><input className="w-full mt-1 px-3 py-2 rounded-lg border bg-green-50 font-semibold" value={`₹${amount}`} readOnly /></div>
        <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white font-semibold">{t('saveCollection')}</button>
      </form>
    </div>
  );
}

function CollectionsPage({ t }: { t: (k: string) => string }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard icon={ClipboardList} label={t('today')} value="342 kg" color="eco" />
        <StatCard icon={ClipboardList} label={t('thisWeek')} value="1.8 Tons" color="sky" />
        <StatCard icon={TrendingUp} label={t('thisMonth')} value="8.5 Tons" color="amber" />
        <StatCard icon={Home} label="Houses Active" value="148" color="green" />
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">{t('recentCollections')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b">
              <th className="pb-2">{t('house')}</th><th className="pb-2">{t('worker')}</th>
              <th className="pb-2">{t('weight')}</th><th className="pb-2">{t('amount')}</th><th className="pb-2">{t('time')}</th>
            </tr></thead>
            <tbody>
              {[{h:'H001',w:'Suresh',kg:'5 kg',a:'₹25',t:'10:30 AM'},{h:'H002',w:'Suresh',kg:'4 kg',a:'₹20',t:'10:45 AM'},{h:'H003',w:'Raju',kg:'6 kg',a:'₹30',t:'11:00 AM'}].map((r, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2">{r.h}</td><td>{r.w}</td><td>{r.kg}</td><td>{r.a}</td><td className="text-gray-400">{r.t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PaymentsPage({ t }: { t: (k: string) => string }) {
  const [filter, setFilter] = useState('all');
  const payments = [
    {h:'H001',n:'Ramesh Kumar',a:'₹500',s:'Completed',c:'eco'},
    {h:'H002',n:'Sita Devi',a:'₹380',s:'Pending',c:'amber'},
    {h:'H003',n:'Mohan Lal',a:'₹650',s:'Completed',c:'eco'}
  ];
  const filtered = filter === 'all' ? payments : payments.filter(p => p.s.toLowerCase() === filter);
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <StatCard icon={IndianRupee} label={t('totalPaid')} value="₹2,26,500" color="eco" />
        <StatCard icon={ClipboardList} label={t('pending')} value="₹18,500" color="amber" />
        <StatCard icon={CheckCircle} label={t('completed')} value="412" color="sky" />
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4">
        <div className="flex gap-2 mb-4">
          {['all','pending','completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${filter === f ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {t(f) || f}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {filtered.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div><p className="font-medium text-sm">{p.n}</p><p className="text-xs text-gray-400">{p.h}</p></div>
              <div className="text-right">
                <p className="font-semibold text-sm">{p.a}</p>
                <span className={`text-xs px-2 py-0.5 rounded ${p.c === 'eco' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{p.s}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsPage({ t }: { t: (k: string) => string }) {
  const daily = [40,55,30,70,85,60,90,45,75,95,50,80];
  const revenue = [30,45,50,65,55,70,80,75,90,85,95,100];
  const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">{t('dailyCollection')}</h3>
        <div className="flex items-end gap-1 h-40">
          {daily.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full rounded-t" style={{ height: `${v}%`, background: 'linear-gradient(to top,#16a34a,#0ea5e9)' }} />
              <span className="text-[9px] text-gray-400 mt-1">{i + 6}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">{t('revenueGrowth')}</h3>
        <div className="flex items-end gap-2 h-40">
          {revenue.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full rounded-t" style={{ height: `${v}%`, background: 'linear-gradient(to top,#f59e0b,#ea580c)' }} />
              <span className="text-[9px] text-gray-400 mt-1">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">{t('villagePerformance')}</h3>
        <div className="space-y-3">
          {[{n:'Sundarpur',v:85},{n:'Greenville',v:72},{n:'Lakshmipur',v:60}].map((v, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{v.n}</span><span className="font-medium">{v.v}%</span></div>
              <div className="w-full h-2 bg-gray-200 rounded-full"><div className="h-2 bg-green-500 rounded-full" style={{ width: `${v.v}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">{t('productSales')}</h3>
        <div className="space-y-2">
          {[{n:'Compost',v:45,c:'bg-green-500'},{n:'Fertilizer',v:30,c:'bg-sky-500'},{n:'Diyas',v:15,c:'bg-amber-500'},{n:'Others',v:10,c:'bg-purple-500'}].map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${p.c}`} />
              <span className="text-sm text-gray-600 flex-1">{p.n}</span>
              <span className="text-sm font-medium">{p.v}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportsPage({ t, role, showToast }: { t: (k: string) => string; role: string; showToast: (m: string) => void }) {
  const tabs = role === 'admin'
    ? ['daily', 'weekly', 'monthly', 'yearly']
    : ['daily', 'weekly', 'monthly'];
  const [active, setActive] = useState('daily');

  const rows = reportData[active] || [];

  return (
    <div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActive(tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${active === tab ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {t(tab)}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">{t('date')}</th>
                <th className="pb-2">{t('weight')}</th>
                <th className="pb-2">{t('amount')}</th>
                <th className="pb-2">{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2">{r.d}</td>
                  <td>{r.w}</td>
                  <td className="text-green-600 font-medium">{r.a}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-xs ${r.s === 'Complete' ? 'bg-green-100 text-green-700' : r.s === 'In Progress' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>
                      {r.s}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => showToast('PDF Downloaded')} className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium flex items-center gap-1">
          <FileText className="w-4 h-4" />PDF
        </button>
        <button onClick={() => showToast('Excel Downloaded')} className="px-4 py-2 rounded-lg bg-green-50 text-green-600 text-sm font-medium flex items-center gap-1">
          <FileSpreadsheet className="w-4 h-4" />Excel
        </button>
        <button onClick={() => showToast('CSV Downloaded')} className="px-4 py-2 rounded-lg bg-sky-50 text-sky-600 text-sm font-medium flex items-center gap-1">
          <File className="w-4 h-4" />CSV
        </button>
      </div>
    </div>
  );
}

function InventoryPage({ t }: { t: (k: string) => string }) {
  const items = [
    {n:'Organic Compost',s:450,u:'bags',low:false},{n:'Organic Fertilizer',s:280,u:'bags',low:false},
    {n:'Cow Dung Diyas',s:1200,u:'pcs',low:false},{n:'Incense Sticks',s:45,u:'packs',low:true},
    {n:'Mosquito Repellent',s:320,u:'pcs',low:false},{n:'Handicrafts',s:15,u:'pcs',low:true}
  ];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <StatCard icon={Package} label={t('totalProducts')} value="6" color="eco" />
        <StatCard icon={AlertTriangle} label={t('lowStock')} value="2" color="red" />
        <StatCard icon={TrendingUp} label={t('totalUnits')} value="2,310" color="sky" />
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.low ? 'bg-red-100' : 'bg-green-100'}`}>
              <Package className={`w-5 h-5 ${item.low ? 'text-red-600' : 'text-green-600'}`} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">{item.n}</p>
              <p className="text-xs text-gray-400">{item.s} {item.u}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${item.low ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {item.low ? t('lowStock') : t('inStock')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManufacturingPage({ t }: { t: (k: string) => string }) {
  const stages = [
    {n:'Raw Collection',v:850,u:'kg',c:'amber'},
    {n:'Processing',v:600,u:'kg',c:'sky'},
    {n:'Product Creation',v:420,u:'units',c:'eco'},
    {n:'Packaging',v:380,u:'units',c:'purple'},
    {n:'Ready Stock',v:2310,u:'units',c:'green'}
  ];
  const colorMap: Record<string, string> = { amber:'bg-amber-500', sky:'bg-sky-500', eco:'bg-green-500', purple:'bg-purple-500', green:'bg-green-500' };
  const bgMap: Record<string, string> = { amber:'bg-amber-100 text-amber-700', sky:'bg-sky-100 text-sky-700', eco:'bg-green-100 text-green-700', purple:'bg-purple-100 text-purple-700', green:'bg-green-100 text-green-700' };
  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-4">{t('manufacturingPipeline')}</h3>
      <div className="space-y-4">
        {stages.map((s, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${bgMap[s.c]}`}>{i+1}</div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{s.n}</p>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                <div className={`h-2 rounded-full ${colorMap[s.c]}`} style={{ width: `${Math.min(100, (s.v / 850) * 100)}%` }} />
              </div>
            </div>
            <p className="font-semibold text-sm">{s.v} {s.u}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EcommercePage({ t, cart, onAddToCart, showToast }: { t: (k: string) => string; cart: {id:number;qty:number}[]; onAddToCart: (id:number) => void; showToast: (m:string) => void }) {
  const total = cart.reduce((s, c) => { const p = products.find(x => x.id === c.id); return s + (p ? p.price * c.qty : 0); }, 0);
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer">
            <div className="h-32 bg-gradient-to-br from-green-100 to-sky-100 flex items-center justify-center">
              <Package className="w-12 h-12 text-green-400" />
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-sm text-gray-800 truncate">{p.name}</h4>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{p.desc}</p>
              <div className="flex items-center gap-1 mt-1"><span className="text-amber-500 text-xs">★ {p.rating}</span></div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-green-700">₹{p.price}</span>
                <button onClick={() => onAddToCart(p.id)} className="px-2 py-1 rounded bg-green-500 text-white text-xs font-medium hover:bg-green-600">{t('addToCart')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div className="mt-6 bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">🛒 {t('cart')} ({cart.length})</h3>
          <div className="space-y-2">
            {cart.map(c => { const p = products.find(x => x.id === c.id); return p ? (
              <div key={c.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm">{p.name} x{c.qty}</span>
                <span className="font-medium text-sm">₹{p.price * c.qty}</span>
              </div>
            ) : null; })}
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-green-700">₹{total}</span>
          </div>
          <button onClick={() => showToast('Order placed! (Demo)')} className="w-full mt-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium">
            {t('placeOrder')}
          </button>
        </div>
      )}
    </div>
  );
}

function NotificationsPage({ t, role }: { t: (k: string) => string; role: string }) {
  const notifs = notificationsData[role] || [];
  return (
    <div className="space-y-3">
      {notifs.map((n, i) => (
        <div key={i} className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-800">{n}</p>
            <p className="text-xs text-gray-400 mt-1">Just now</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsPage() {
  const items = [
    {i:User,l:'Profile Settings'},{i:Settings,l:'Language'},{i:Settings,l:'Theme'},
    {i:Bell,l:'Notifications'},{i:Shield,l:'Security'},{i:Settings,l:'Change Password'}
  ];
  return (
    <div className="space-y-3 max-w-lg">
      {items.map((s, i) => (
        <button key={i} className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4 w-full flex items-center gap-3 hover:shadow-md transition">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <s.i className="w-4 h-4 text-gray-600" />
          </div>
          <span className="font-medium text-gray-800 text-sm">{s.l}</span>
          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
        </button>
      ))}
    </div>
  );
}

function ProfilePage({ t, role, userName }: { t: (k: string) => string; role: string; userName: string }) {
  return (
    <div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-6 text-center max-w-sm mx-auto mb-4">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl mx-auto mb-3">
          {userName[0]?.toUpperCase()}
        </div>
        <h3 className="font-bold text-gray-800 text-lg">{userName}</h3>
        <p className="text-sm text-gray-500 capitalize">{role} • Sundarpur Village</p>
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-3 text-center"><p className="text-lg font-bold text-green-700">45</p><p className="text-[10px] text-gray-500">{t('collections')}</p></div>
        <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-3 text-center"><p className="text-lg font-bold text-sky-700">12</p><p className="text-[10px] text-gray-500">Months</p></div>
        <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-3 text-center"><p className="text-lg font-bold text-amber-700">3</p><p className="text-[10px] text-gray-500">Badges</p></div>
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl p-4 max-w-sm mx-auto">
        <h4 className="font-semibold text-gray-800 mb-3">Activity Timeline</h4>
        <div className="space-y-3 text-sm">
          {[{text:'Collection recorded',d:'Today'},{text:'Payment received ₹150',d:'Yesterday'},{text:'Joined D2D network',d:'6 months ago'}].map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-600 flex-1">{a.text}</span>
              <span className="text-xs text-gray-400">{a.d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Register Page ───────────────────────────────────────────────────────────
function RegisterPage({ t, onLogin }: { t: (k: string) => string; onLogin: () => void }) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const stepTitles = [t('personalInfo'), t('addressInfo'), t('houseDetails'), t('identityVerification'), t('reviewSubmit')];
  const stepContent = [
    <div key={0} className="space-y-3">
      <input className="w-full px-3 py-2 rounded-lg border" placeholder="Full Name" />
      <input className="w-full px-3 py-2 rounded-lg border" placeholder="Phone Number" />
      <input className="w-full px-3 py-2 rounded-lg border" placeholder="Email (optional)" />
      <select className="w-full px-3 py-2 rounded-lg border"><option>Select Role</option><option>House Owner</option><option>Collection Worker</option></select>
    </div>,
    <div key={1} className="space-y-3">
      <input className="w-full px-3 py-2 rounded-lg border" placeholder="Village Name" />
      <input className="w-full px-3 py-2 rounded-lg border" placeholder="Panchayat" />
      <input className="w-full px-3 py-2 rounded-lg border" placeholder="District" />
      <input className="w-full px-3 py-2 rounded-lg border" placeholder="PIN Code" />
    </div>,
    <div key={2} className="space-y-3">
      <input className="w-full px-3 py-2 rounded-lg border" placeholder="House Number" />
      <select className="w-full px-3 py-2 rounded-lg border"><option>Number of Cows</option><option>1-2</option><option>3-5</option><option>5+</option></select>
      <select className="w-full px-3 py-2 rounded-lg border"><option>Estimated Daily Dung (kg)</option><option>5-10</option><option>10-20</option><option>20+</option></select>
    </div>,
    <div key={3} className="space-y-3">
      <select className="w-full px-3 py-2 rounded-lg border"><option>ID Type</option><option>Aadhaar Card</option><option>Voter ID</option><option>Ration Card</option></select>
      <input className="w-full px-3 py-2 rounded-lg border" placeholder="ID Number" />
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
        <Upload className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">Upload ID Document</p>
      </div>
    </div>,
    <div key={4} className="space-y-2 text-sm text-gray-600">
      <p>✅ Personal Information - Complete</p>
      <p>✅ Address Information - Complete</p>
      <p>✅ House Details - Complete</p>
      <p>✅ Identity Verification - Complete</p>
      <div className="mt-4 p-3 bg-green-50 rounded-lg text-green-700 text-xs">By submitting, you agree to the D2D terms of service and privacy policy.</div>
    </div>
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{t('createAccountTitle')}</h1>
          <p className="text-gray-500 text-sm">{t('joinNetwork')}</p>
        </div>
        <div className="flex justify-center mb-6 gap-2 items-center">
          {[1,2,3,4,5].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="w-6 h-0.5 bg-gray-200" />}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${s < step ? 'bg-green-500 text-white' : s === step ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
            </div>
          ))}
        </div>
        <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl">
          <h3 className="font-semibold text-gray-800 mb-4">{stepTitles[step - 1]}</h3>
          {stepContent[step - 1]}
          <div className="flex justify-between mt-6">
            <button onClick={() => step > 1 && setStep(s => s - 1)}
              className={`px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium ${step === 1 ? 'invisible' : ''}`}>
              {t('back')}
            </button>
            <button onClick={() => { if (step < totalSteps) setStep(s => s + 1); else onLogin(); }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium">
              {step === totalSteps ? t('submit') : t('next')}
            </button>
          </div>
        </div>
        <p className="text-center mt-4 text-sm text-gray-500">
          {t('alreadyHaveAccount')} <button onClick={onLogin} className="text-green-600 font-medium">{t('login')}</button>
        </p>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<'splash' | 'login' | 'register' | string>('splash');
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [language, setLanguage] = useState<string>(() => localStorage.getItem('d2d_lang') || 'en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrPass, setQrPass] = useState('');
  const [qrError, setQrError] = useState(false);
  const { toasts, show: showToast } = useToast();

  const t = (key: string) => translations[language]?.[key] || key;

  useEffect(() => {
    if (page === 'splash') {
      const timer = setTimeout(() => setPage('login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [page]);

  useEffect(() => {
    localStorage.setItem('d2d_lang', language);
  }, [language]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) { showToast('Please select a role', 'error'); return; }
    const name = (e.target as HTMLFormElement).querySelector<HTMLInputElement>('#username')?.value || 'User';
    setRole(selectedRole);
    setUser({ name, role: selectedRole });
    showToast(`Welcome, ${name}!`);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setRole(null); setUser(null);
    showToast('Logged out');
    setPage('login');
  };

  const addToCart = (id: number) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === id);
      if (ex) return prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id, qty: 1 }];
    });
    showToast('Added to cart');
  };

  // ── Splash ──
  if (page === 'splash') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-800 via-green-700 to-sky-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 rounded-full bg-green-500/20 absolute inset-0 animate-ping" />
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-sky-400 flex items-center justify-center relative">
              <span className="text-4xl font-extrabold text-white">D2D</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">Dung To Development</h1>
          <p className="text-green-200 text-lg mb-8">Transforming Waste Into Wealth</p>
          <div className="flex justify-center gap-2">
            <span className="w-3 h-3 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-3 h-3 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="w-3 h-3 bg-sky-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-green-300/60 text-sm mt-6">🌿 Sustainable Village Development</p>
        </div>
      </div>
    );
  }

  // ── Register ──
  if (page === 'register') {
    return <RegisterPage t={t} onLogin={() => setPage('login')} />;
  }

  // ── Login ──
  if (page === 'login' || !role) {
    const roles = [
      { id: 'admin', icon: Shield, label: 'Admin', color: 'eco' },
      { id: 'worker', icon: HardHat, label: 'Worker', color: 'sky' },
      { id: 'user', icon: Home, label: 'House Owner', color: 'amber' },
    ];
    const borderColors: Record<string, string> = { eco: 'border-green-500 bg-green-50', sky: 'border-sky-500 bg-sky-50', amber: 'border-amber-500 bg-amber-50' };
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-sky-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">D2D</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome to D2D</h1>
            <p className="text-gray-500 mt-1">Dung To Development Portal</p>
          </div>
          <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl">
            <p className="text-sm font-semibold text-gray-600 mb-3">{t('selectRole')}</p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {roles.map(r => (
                <button key={r.id} onClick={() => setSelectedRole(r.id)}
                  className={`p-3 rounded-xl border-2 transition text-center ${selectedRole === r.id ? borderColors[r.color] : 'border-gray-200 hover:border-gray-300'}`}>
                  <r.icon className="w-6 h-6 mx-auto text-gray-600 mb-1" />
                  <span className="text-xs font-medium block">{r.label}</span>
                </button>
              ))}
            </div>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
                  <input id="username" type="text" className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none" placeholder="Enter username" required />
                </div>
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                  <input id="password" type="password" className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none" placeholder="Enter password" required />
                </div>
                <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white font-semibold text-sm">
                  {t('login')}
                </button>
              </div>
            </form>
            <div className="flex justify-between mt-4 text-xs">
              <button className="text-green-600 hover:underline">{t('forgotPassword')}</button>
              <button onClick={() => setPage('register')} className="text-sky-600 hover:underline">{t('createAccount')}</button>
            </div>
          </div>
        </div>
        {/* Toasts */}
        <div className="fixed top-4 right-4 z-[999] space-y-2">
          {toasts.map(toast => (
            <div key={toast.id} className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-500' : 'bg-sky-500'}`}>
              {toast.msg}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Dashboard Layout ──
  const menu = menus[role] || [];
  const currentPageKey = menu.find(m => m.id === page)?.key || 'dashboard';

  const renderPage = () => {
    const userName = user?.name || 'User';
    switch (page) {
      case 'dashboard':
        if (role === 'admin') return <AdminDashboard t={t} />;
        if (role === 'worker') return <WorkerDashboard t={t} />;
        return <UserDashboard t={t} userName={userName} onViewQr={() => setQrModalOpen(true)} />;
      case 'houses': return <HousesPage t={t} role={role} onNavigate={setPage} />;
      case 'house-profile': return <HouseProfilePage t={t} />;
      case 'workers': return <WorkersPage t={t} />;
      case 'qr-manage': return <QrManagePage t={t} />;
      case 'qr-scanner': return <QrScannerPage t={t} showToast={showToast} />;
      case 'bluetooth': return <BluetoothPage t={t} showToast={showToast} />;
      case 'collection-entry': return <CollectionEntryPage t={t} showToast={showToast} />;
      case 'collections': return <CollectionsPage t={t} />;
      case 'payments': return <PaymentsPage t={t} />;
      case 'analytics': return <AnalyticsPage t={t} />;
      case 'reports': return <ReportsPage t={t} role={role} showToast={showToast} />;
      case 'inventory': return <InventoryPage t={t} />;
      case 'manufacturing': return <ManufacturingPage t={t} />;
      case 'ecommerce': return <EcommercePage t={t} cart={cart} onAddToCart={addToCart} showToast={showToast} />;
      case 'notifications': return <NotificationsPage t={t} role={role} />;
      case 'settings': return <SettingsPage />;
      case 'profile': return <ProfilePage t={t} role={role} userName={userName} />;
      default: return <AdminDashboard t={t} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-50 md:z-auto w-[260px] h-full bg-white border-r border-gray-100 flex flex-col shadow-lg md:shadow-none transition-transform duration-300`}>
        <div className="p-4 border-b flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-sky-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">D2D</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">D2D Portal</p>
            <p className="text-[10px] text-gray-400 capitalize">{role} Panel</p>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menu.map(m => (
            <button key={m.id} onClick={() => { setPage(m.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${page === m.id ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'}`}>
              <m.icon className="w-4 h-4" />
              {t(m.key)}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition">
            <LogOut className="w-4 h-4" />{t('logout')}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="md:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b px-4 py-3 flex items-center gap-3 z-30">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
          <h2 className="font-semibold text-gray-800 flex-1 capitalize">{t(currentPageKey)}</h2>

          {/* Language selector — shows both EN and TA labels */}
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="px-2 py-1 rounded-lg border text-sm bg-white">
            <option value="en">English</option>
            <option value="ta">தமிழ்</option>
          </select>

          <button onClick={() => setPage('notifications')} className="relative p-2 rounded-lg hover:bg-gray-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
        </header>

        <div className="p-4 md:p-6">
          {renderPage()}
        </div>
      </main>

      {/* QR Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-gray-800 mb-4">{t('verifyPassword')}</h3>
            <input type="password" className="w-full px-3 py-2 rounded-lg border mb-4" placeholder="Enter password"
              value={qrPass} onChange={e => setQrPass(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={() => {
                if (qrPass.length >= 4) { setQrModalOpen(false); setQrPass(''); setQrError(false); showToast('QR Code revealed'); }
                else setQrError(true);
              }} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium">
                {t('verify')}
              </button>
              <button onClick={() => { setQrModalOpen(false); setQrPass(''); setQrError(false); }}
                className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm">
                {t('cancel')}
              </button>
            </div>
            {qrError && <p className="text-red-500 text-xs mt-2">{t('accessDenied')}</p>}
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[999] space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-500' : 'bg-sky-500'}`}>
            {toast.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
