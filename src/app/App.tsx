import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { createUser } from "../lib/userService";
import { getAllUsers } from "../lib/userService";
import { getHouseOwners, getWorkers } from "../lib/userService";
import { createHouseOwner } from "../lib/userService";
import { deleteUser } from "../lib/userService";
import { createWorker } from "../lib/userService";
import { deleteWorker } from "../lib/userService";
import { addCollection, getCollections } from "../lib/userService";
import { Html5QrcodeScanner } from "html5-qrcode";
import { getPayments } from "../lib/userService";
import * as XLSX from "xlsx";
import { resetPassword } from "../lib/userService";
import { addPayment } from "../lib/userService";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";



import { 
  LayoutDashboard, Home, User, Users, QrCode, ClipboardList,
  CreditCard, BarChart3, FileText, Package, Factory, ShoppingCart,
  Bell, Settings, UserCircle, Scan, Bluetooth, PlusCircle, LogOut,
  Menu, X, ChevronRight, CheckCircle, AlertCircle, AlertTriangle,
  IndianRupee, TrendingUp, MapPin, Weight, Upload, Check, Circle,
  FileSpreadsheet, File, HardHat, Shield, Sun, Moon, Palette,
  Trash2, Eye, EyeOff, Download, Globe, Lock, UserPlus, ChevronLeft,
  Copy, RefreshCw
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Theme = "light" | "dark" | "custom";
interface House { id: string; owner: string; village: string; phone: string; collections: number; earnings: number; qr_code: string }
interface Worker { id: string; name: string; phone: string; area: string; collections: number; username: string; credential: string }
interface Payment { h: string; n: string; a: string; s: "Completed" | "Pending" }
interface PendingRequest { id: string; house: House; requestedBy: string; time: string }
interface ToastMsg { id: number; msg: string; type: string }

// ─── Translations ─────────────────────────────────────────────────────────────
const T: Record<string, Record<string, string>> = {
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
    // Login
    d2dSubtitle: "Dung To Development Portal", username: "Username",
    password: "Password", enterUsername: "Enter username", enterPassword: "Enter password",
    admin: "Admin", workerRole: "Worker", houseOwnerRole: "House Owner",
    // Profile
    activityTimeline: "Activity Timeline", months: "Months", badges: "Badges",
    collectionRecorded: "Collection recorded", paymentReceived: "Payment received",
    joinedD2D: "Joined D2D network", yesterday: "Yesterday", sixMonthsAgo: "6 months ago",
    // Settings
    themeSettings: "Theme", lightTheme: "Light Theme", darkTheme: "Dark Theme",
    customTheme: "Custom Theme (Earthy)", profileSettings: "Profile Settings",
    languageSettings: "Language", notificationSettings: "Notifications",
    securitySettings: "Security", changePassword: "Change Password",
    saveChanges: "Save Changes", enableNotifications: "Enable Notifications",
    currentPassword: "Current Password", newPassword: "New Password",
    confirmPassword: "Confirm Password", updatePassword: "Update Password",
    fullName: "Full Name", emailAddress: "Email Address", phoneNumber: "Phone Number",
    settingsUpdated: "Settings updated successfully", passwordUpdated: "Password updated successfully",
    passwordMismatch: "Passwords do not match", passwordTooShort: "Minimum 6 characters required",
    // Worker management
    addWorkerTitle: "Add New Worker", workerName: "Worker Name",
    workerPhone: "Phone Number", workerArea: "Area / Zone",
    generatedUsername: "Generated Username", generatedPassword: "Generated Password",
    deleteWorker: "Delete", confirmDelete: "Delete this worker?",
    workerAdded: "Worker added successfully", workerDeleted: "Worker deleted",
    credentials: "Credentials", copyCredentials: "Copy Credentials",
    // House management
    addHouseTitle: "Add New House", ownerName: "Owner Name", villageName: "Village",
    houseAdded: "House added successfully", requestSubmitted: "Request sent to Admin for approval",
    pendingRequests: "Pending Requests", approveHouse: "Approve", rejectHouse: "Reject",
    pendingApproval: "Pending Approval", houseApproved: "House approved",
    houseRejected: "Request rejected", requestedBy: "Requested by",
    // Payments
    paid: "Paid", markAsPaid: "Mark as Paid", markAsPending: "Mark as Pending",
    paymentUpdated: "Payment status updated",
    // QR
    downloadQR: "Download QR Code", qrRevealed: "QR Code revealed",
    // E-commerce
    total: "Total", orderPlaced: "Order placed! (Demo)",
    // Register
    emailOptional: "Email (optional)", collectionWorkerRole: "Collection Worker",
    panchayat: "Panchayat", district: "District", pinCode: "PIN Code",
    numberOfCows: "Number of Cows", estimatedDung: "Estimated Daily Dung (kg)",
    idType: "ID Type", aadhaar: "Aadhaar Card", voterId: "Voter ID",
    rationCard: "Ration Card", idNumber: "ID Number", uploadId: "Upload ID Document",
    agreementText: "By submitting, you agree to the D2D terms of service and privacy policy.",
    inProgress: "In Progress",
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
    // Login
    d2dSubtitle: "கழிவிலிருந்து வளம் - போர்டல்", username: "பயனர்பெயர்",
    password: "கடவுச்சொல்", enterUsername: "பயனர்பெயர் உள்ளிடவும்",
    enterPassword: "கடவுச்சொல் உள்ளிடவும்",
    admin: "நிர்வாகி", workerRole: "பணியாளர்", houseOwnerRole: "வீட்டு உரிமையாளர்",
    // Profile
    activityTimeline: "செயல்பாட்டு காலவரிசை", months: "மாதங்கள்", badges: "பட்டங்கள்",
    collectionRecorded: "சேகரிப்பு பதிவாகியது", paymentReceived: "பணம் கிடைத்தது",
    joinedD2D: "D2D வலையமைப்பில் சேர்ந்தார்", yesterday: "நேற்று", sixMonthsAgo: "6 மாதங்களுக்கு முன்",
    // Settings
    themeSettings: "தீம்", lightTheme: "வெளிர் தீம்", darkTheme: "இருண்ட தீம்",
    customTheme: "தனிப்பயன் தீம் (மண் நிறம்)", profileSettings: "சுயவிவர அமைப்புகள்",
    languageSettings: "மொழி", notificationSettings: "அறிவிப்புகள்",
    securitySettings: "பாதுகாப்பு", changePassword: "கடவுச்சொல் மாற்று",
    saveChanges: "மாற்றங்களை சேமி", enableNotifications: "அறிவிப்புகளை இயக்கு",
    currentPassword: "தற்போதைய கடவுச்சொல்", newPassword: "புதிய கடவுச்சொல்",
    confirmPassword: "கடவுச்சொல் உறுதிப்படுத்து", updatePassword: "கடவுச்சொல் புதுப்பி",
    fullName: "முழு பெயர்", emailAddress: "மின்னஞ்சல் முகவரி", phoneNumber: "தொலைபேசி எண்",
    settingsUpdated: "அமைப்புகள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன",
    passwordUpdated: "கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
    passwordMismatch: "கடவுச்சொற்கள் பொருந்தவில்லை", passwordTooShort: "குறைந்தது 6 எழுத்துகள் தேவை",
    // Worker management
    addWorkerTitle: "புதிய பணியாளர் சேர்க்க", workerName: "பணியாளர் பெயர்",
    workerPhone: "தொலைபேசி எண்", workerArea: "பகுதி / மண்டலம்",
    generatedUsername: "உருவாக்கப்பட்ட பயனர்பெயர்", generatedPassword: "உருவாக்கப்பட்ட கடவுச்சொல்",
    deleteWorker: "நீக்கு", confirmDelete: "இந்த பணியாளரை நீக்கவா?",
    workerAdded: "பணியாளர் வெற்றிகரமாக சேர்க்கப்பட்டார்", workerDeleted: "பணியாளர் நீக்கப்பட்டார்",
    credentials: "நற்சான்றிதழ்கள்", copyCredentials: "நகலெடு",
    // House management
    addHouseTitle: "புதிய வீடு சேர்க்க", ownerName: "உரிமையாளர் பெயர்", villageName: "கிராமம்",
    houseAdded: "வீடு வெற்றிகரமாக சேர்க்கப்பட்டது",
    requestSubmitted: "நிர்வாகியிடம் ஒப்புதலுக்கு கோரிக்கை அனுப்பப்பட்டது",
    pendingRequests: "நிலுவை கோரிக்கைகள்", approveHouse: "ஒப்புதல்", rejectHouse: "நிராகரி",
    pendingApproval: "நிர்வாக ஒப்புதல் காத்திருக்கிறது", houseApproved: "வீடு ஒப்புதல் அளிக்கப்பட்டது",
    houseRejected: "கோரிக்கை நிராகரிக்கப்பட்டது", requestedBy: "கோரியவர்",
    // Payments
    paid: "செலுத்தப்பட்டது", markAsPaid: "செலுத்தப்பட்டதாக குறி",
    markAsPending: "நிலுவையில் குறி", paymentUpdated: "பணம் நிலை புதுப்பிக்கப்பட்டது",
    // QR
    downloadQR: "QR குறியீடு பதிவிறக்கம்", qrRevealed: "QR குறியீடு காட்டப்பட்டது",
    // E-commerce
    total: "மொத்தம்", orderPlaced: "ஆர்டர் வைக்கப்பட்டது! (பரீட்சை)",
    // Register
    emailOptional: "மின்னஞ்சல் (விருப்பமானது)", collectionWorkerRole: "சேகரிப்பு பணியாளர்",
    panchayat: "பஞ்சாயத்து", district: "மாவட்டம்", pinCode: "பின் குறியீடு",
    numberOfCows: "பசுக்களின் எண்ணிக்கை", estimatedDung: "மதிப்பிடப்பட்ட தினசரி எரு (கிலோ)",
    idType: "அடையாள வகை", aadhaar: "ஆதார் அட்டை", voterId: "வாக்காளர் அட்டை",
    rationCard: "குடும்ப அட்டை", idNumber: "அடையாள எண்", uploadId: "அடையாளத்தை பதிவேற்றவும்",
    agreementText: "சமர்ப்பிப்பதன் மூலம், D2D சேவை விதிமுறைகளுக்கு சம்மதிக்கிறீர்கள்.",
    inProgress: "நடந்து கொண்டிருக்கிறது",
  }
};

// ─── Default Data ─────────────────────────────────────────────────────────────
const DEFAULT_HOUSES: House[] = [
  { id: "H001", owner: "Ramesh Kumar", village: "Sundarpur", phone: "9876543210", collections: 45, earnings: 2250,qr_code: "", },
  { id: "H002", owner: "Sita Devi", village: "Sundarpur", phone: "9876543211", collections: 38, earnings: 1900, qr_code: "", },
  { id: "H003", owner: "Mohan Lal", village: "Greenville", phone: "9876543212", collections: 52, earnings: 2600, qr_code: "", },
];
const DEFAULT_WORKERS: Worker[] = [
  { id: "W001", name: "Suresh Yadav", phone: "9988776655", area: "Zone A", collections: 120, username: "suresh001", credential: "Pass@1234" },
  { id: "W002", name: "Raju Singh", phone: "9988776656", area: "Zone B", collections: 98, username: "raju002", credential: "Pass@5678" },
];
const DEFAULT_PAYMENTS: Payment[] = [
  { h: "H001", n: "Ramesh Kumar", a: "₹500", s: "Completed" },
  { h: "H002", n: "Sita Devi", a: "₹380", s: "Pending" },
  { h: "H003", n: "Mohan Lal", a: "₹650", s: "Completed" },
];
const PRODUCTS = [
  { id: 1, name: "Organic Compost", price: 299, rating: 4.5, desc: "Premium quality organic compost for healthy plant growth.", img: "https://images.unsplash.com/photo-1492496913980-501348b61469?w=400&q=80" },
  { id: 2, name: "Organic Fertilizer", price: 449, rating: 4.7, desc: "Natural fertilizer granules for agriculture.", img: "https://images.unsplash.com/photo-1557234195-bd9f290f0e4d?w=400&q=80" },
  { id: 3, name: "Cow Dung Diyas", price: 149, rating: 4.8, desc: "Handmade traditional diyas for festivals.", img: "https://images.unsplash.com/photo-1577083753695-e010191bacb5?w=400&q=80" },
  { id: 4, name: "Incense Sticks", price: 99, rating: 4.3, desc: "Natural aromatic incense sticks.", img: "https://images.unsplash.com/photo-1541795083-1b160cf4f3d7?w=400&q=80" },
  { id: 5, name: "Mosquito Repellent", price: 79, rating: 4.1, desc: "Organic mosquito repellent coils.", img: "https://images.unsplash.com/photo-1766855012619-bfe5d8ca94fd?w=400&q=80" },
  { id: 6, name: "Eco Handicrafts", price: 599, rating: 4.9, desc: "Beautiful handmade eco-friendly crafts.", img: "https://images.unsplash.com/photo-1522065893269-6fd20f6d7438?w=400&q=80" },
];
const REPORT_DATA: Record<string, Array<{ d: string; w: string; a: string; s: string }>> = {
  daily: [
    { d: "17 Jun", w: "342 kg", a: "₹1,710", s: "Complete" },
    { d: "16 Jun", w: "298 kg", a: "₹1,490", s: "Complete" },
    { d: "15 Jun", w: "315 kg", a: "₹1,575", s: "Complete" },
    { d: "14 Jun", w: "280 kg", a: "₹1,400", s: "Complete" },
  ],
  weekly: [
    { d: "Week 24 (10–16 Jun)", w: "2,010 kg", a: "₹10,050", s: "Complete" },
    { d: "Week 23 (3–9 Jun)", w: "1,850 kg", a: "₹9,250", s: "Complete" },
    { d: "Week 22 (27 May–2 Jun)", w: "1,960 kg", a: "₹9,800", s: "Complete" },
  ],
  monthly: [
    { d: "Jun 2026", w: "8,500 kg", a: "₹42,500", s: "In Progress" },
    { d: "May 2026", w: "9,200 kg", a: "₹46,000", s: "Complete" },
    { d: "Apr 2026", w: "8,800 kg", a: "₹44,000", s: "Complete" },
  ],
  yearly: [
    { d: "2026 (Jan–Jun)", w: "48,200 kg", a: "₹2,41,000", s: "In Progress" },
    { d: "2025", w: "98,500 kg", a: "₹4,92,500", s: "Complete" },
  ],
};
const NOTIFS: Record<string, string[]> = {
  admin: ["New collection entry from Zone A", "Payment pending for H003", "Low stock alert: Diyas", "Monthly report ready"],
  worker: ["New route assigned: Zone A", "Collection target updated", "5 houses remaining today"],
  user: ["Payment of ₹150 credited", "Collection recorded: 3kg", "Order #1234 shipped"],
};
const MENUS: Record<string, Array<{ id: string; icon: React.ComponentType<{ className?: string }>; key: string }>> = {
  admin: [
    { id: "dashboard", icon: LayoutDashboard, key: "dashboard" },
    { id: "houses", icon: Home, key: "houses" },
    { id: "house-profile", icon: User, key: "houseProfile" },
    { id: "workers", icon: Users, key: "workers" },
    { id: "qr-manage", icon: QrCode, key: "qrManagement" },
    { id: "collections", icon: ClipboardList, key: "collections" },
    { id: "payments", icon: CreditCard, key: "payments" },
    { id: "analytics", icon: BarChart3, key: "analytics" },
    { id: "reports", icon: FileText, key: "reports" },
    { id: "inventory", icon: Package, key: "inventory" },
    { id: "manufacturing", icon: Factory, key: "manufacturing" },
    { id: "ecommerce", icon: ShoppingCart, key: "ecommerce" },
    { id: "notifications", icon: Bell, key: "notifications" },
    { id: "settings", icon: Settings, key: "settings" },
    { id: "profile", icon: UserCircle, key: "profile" },
  ],
  worker: [
    { id: "dashboard", icon: LayoutDashboard, key: "dashboard" },
    { id: "houses", icon: Home, key: "houses" },
    { id: "qr-scanner", icon: Scan, key: "qrScanner" },
    { id: "bluetooth", icon: Bluetooth, key: "bluetoothScale" },
    { id: "collection-entry", icon: PlusCircle, key: "collectionEntry" },
    { id: "notifications", icon: Bell, key: "notifications" },
    { id: "settings", icon: Settings, key: "settings" },
    { id: "profile", icon: UserCircle, key: "profile" },
  ],
  houseOwner: [
    { id: "dashboard", icon: LayoutDashboard, key: "dashboard" },
    { id: "reports", icon: FileText, key: "reports" },
    { id: "ecommerce", icon: ShoppingCart, key: "ecommerce" },
    { id: "notifications", icon: Bell, key: "notifications" },
    { id: "settings", icon: Settings, key: "settings" },
    { id: "profile", icon: UserCircle, key: "profile" },
  ],
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useLS<T>(key: string, def: T): [T, (v: T | ((p: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
  });
  const set = (v: T | ((p: T) => T)) => {
    setVal(prev => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };
  return [val, set];
}

let toastId = 0;
function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const show = (msg: string, type = "success") => {
    const id = ++toastId;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };
  return { toasts, show };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function genId(prefix: string, list: { id: string }[]) {
  const nums = list.map(x => parseInt(x.id.replace(prefix, "")) || 0);
  return prefix + String((Math.max(0, ...nums) + 1)).padStart(3, "0");
}
function genCredentials(name: string) {
  const base = name.toLowerCase().replace(/\s+/g, "").slice(0, 7);
  const num = Math.floor(100 + Math.random() * 900);
  const chars = "ABCDEFGHJKMNabcdefghjkmnpqrstuvwxyz23456789";
  const pass = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return { username: base + num, credential: "D2D@" + pass };
}
function downloadQRCode(user: any) {
  if (!user?.qr_code) {
    alert("No QR Code found");
    return;
  }

  const a = document.createElement("a");
  a.href = user.qr_code;
  a.download = `HOUSE_${user.id}.png`;
  a.click();
}
// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string }) {
  const clr: Record<string, string> = {
    eco: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
    sky: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
  };
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${clr[color] || clr.eco}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{title}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Img with fallback ────────────────────────────────────────────────────────
function ProductImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  if (err) return (
    <div className={`bg-gradient-to-br from-green-100 to-sky-100 dark:from-green-900/30 dark:to-sky-900/30 flex items-center justify-center ${className}`}>
      <Package className="w-12 h-12 text-green-400" />
    </div>
  );
  return <img src={src} alt={alt} className={className} onError={() => setErr(true)} />;
}

// ─── Settings Page ────────────────────────────────────────────────────────────
function SettingsPage({
  t, theme, setTheme, language, setLanguage, user, setUser, showToast
}: {
  t: (k: string) => string;
  theme: Theme; setTheme: (v: Theme) => void;
  language: string; setLanguage: (v: string) => void;
  user: { name: string; role: string } | null;
  setUser: (u: { name: string; role: string } | null) => void;
  showToast: (m: string, t?: string) => void;
}) {
  const [sub, setSub] = useState<string | null>(null);
  const [notifEnabled, setNotifEnabled] = useLS("d2d_notif", true);
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState("9876543210");
  const [editEmail, setEditEmail] = useState("user@d2d.in");

  const settingItems = [
    { id: "profile", icon: User, label: t("profileSettings") },
    { id: "language", icon: Globe, label: t("languageSettings") },
    { id: "theme", icon: Palette, label: t("themeSettings") },
    { id: "notifications", icon: Bell, label: t("notificationSettings") },
    { id: "security", icon: Lock, label: t("securitySettings") },
  ];

  if (sub === "profile") return (
    <div className="max-w-lg">
      <button onClick={() => setSub(null)} className="flex items-center gap-2 text-green-600 text-sm mb-4 font-medium">
        <ChevronLeft className="w-4 h-4" />{t("back")}
      </button>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{t("profileSettings")}</h3>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("fullName")}</label>
          <input className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={editName} onChange={e => setEditName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("phoneNumber")}</label>
          <input className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={editPhone} onChange={e => setEditPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("emailAddress")}</label>
          <input className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
        </div>
        <button onClick={() => { if (user) setUser({ ...user, name: editName }); showToast(t("settingsUpdated")); setSub(null); }}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white font-semibold text-sm">
          {t("saveChanges")}
        </button>
      </div>
    </div>
  );

  if (sub === "language") return (
    <div className="max-w-lg">
      <button onClick={() => setSub(null)} className="flex items-center gap-2 text-green-600 text-sm mb-4 font-medium">
        <ChevronLeft className="w-4 h-4" />{t("back")}
      </button>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-6 space-y-3">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{t("languageSettings")}</h3>
        {[{ val: "en", label: "English" }, { val: "ta", label: "தமிழ் (Tamil)" }].map(l => (
          <button key={l.val} onClick={() => { setLanguage(l.val); showToast(t("settingsUpdated")); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition ${language === l.val ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-gray-200 dark:border-gray-700"}`}>
            <span className="font-medium dark:text-white">{l.label}</span>
            {language === l.val && <CheckCircle className="w-5 h-5 text-green-500" />}
          </button>
        ))}
      </div>
    </div>
  );

  if (sub === "theme") return (
    <div className="max-w-lg">
      <button onClick={() => setSub(null)} className="flex items-center gap-2 text-green-600 text-sm mb-4 font-medium">
        <ChevronLeft className="w-4 h-4" />{t("back")}
      </button>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-6 space-y-3">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{t("themeSettings")}</h3>
        {[
          { val: "light" as Theme, label: t("lightTheme"), icon: Sun, preview: "bg-white border-gray-200" },
          { val: "dark" as Theme, label: t("darkTheme"), icon: Moon, preview: "bg-gray-900 border-gray-700" },
          { val: "custom" as Theme, label: t("customTheme"), icon: Palette, preview: "bg-amber-100 border-amber-400" },
        ].map(th => (
          <button key={th.val} onClick={() => { setTheme(th.val); showToast(t("settingsUpdated")); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition ${theme === th.val ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-gray-200 dark:border-gray-700"}`}>
            <div className={`w-8 h-8 rounded-lg border-2 ${th.preview}`} />
            <span className="font-medium dark:text-white flex-1 text-left">{th.label}</span>
            {theme === th.val && <CheckCircle className="w-5 h-5 text-green-500" />}
          </button>
        ))}
      </div>
    </div>
  );

  if (sub === "notifications") return (
    <div className="max-w-lg">
      <button onClick={() => setSub(null)} className="flex items-center gap-2 text-green-600 text-sm mb-4 font-medium">
        <ChevronLeft className="w-4 h-4" />{t("back")}
      </button>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">{t("notificationSettings")}</h3>
        <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-100">{t("enableNotifications")}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("notifications")}</p>
          </div>
          <button onClick={() => { setNotifEnabled(!notifEnabled); showToast(t("settingsUpdated")); }}
            className={`w-12 h-6 rounded-full transition-colors relative ${notifEnabled ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
        {["Collection Updates", "Payment Alerts", "Weekly Summary"].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b dark:border-gray-700 last:border-0">
            <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
            <button className="w-10 h-5 rounded-full bg-green-500 relative">
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  if (sub === "security") return (
    <div className="max-w-lg">
      <button onClick={() => setSub(null)} className="flex items-center gap-2 text-green-600 text-sm mb-4 font-medium">
        <ChevronLeft className="w-4 h-4" />{t("back")}
      </button>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{t("changePassword")}</h3>
        {[
          { label: t("currentPassword"), val: curPass, set: setCurPass },
          { label: t("newPassword"), val: newPass, set: setNewPass },
          { label: t("confirmPassword"), val: confPass, set: setConfPass },
        ].map((f, i) => (
          <div key={i}>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.label}</label>
            <div className="relative mt-1">
              <input type={showPwd ? "text" : "password"} className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10"
                value={f.val} onChange={e => f.set(e.target.value)} />
              <button className="absolute right-3 top-2.5 text-gray-400" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
        <button onClick={() => {
          if (newPass !== confPass) { showToast(t("passwordMismatch"), "error"); return; }
          if (newPass.length < 6) { showToast(t("passwordTooShort"), "error"); return; }
          setCurPass(""); setNewPass(""); setConfPass("");
          showToast(t("passwordUpdated")); setSub(null);
        }} className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white font-semibold text-sm">
          {t("updatePassword")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-3 max-w-lg">
      {settingItems.map(s => (
        <button key={s.id} onClick={() => setSub(s.id)}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4 w-full flex items-center gap-3 hover:shadow-md transition">
          <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <s.icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </div>
          <span className="font-medium text-gray-800 dark:text-gray-100 text-sm flex-1 text-left">{s.label}</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      ))}
    </div>
  );
}

// ─── Dashboard Pages ──────────────────────────────────────────────────────────
function AdminDashboard({ t }: { t: (k: string) => string }) {
  const bars = [65, 80, 45, 90, 70, 85, 95];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard icon={Home} label={t("totalHouses")} value="156" color="eco" />
        <StatCard icon={Users} label={t("totalWorkers")} value="12" color="sky" />
        <StatCard icon={ClipboardList} label={t("todayCollection")} value="342 kg" color="amber" />
        <StatCard icon={ClipboardList} label={t("monthlyCollection")} value="8.5 Tons" color="eco" />
        <StatCard icon={IndianRupee} label={t("revenueGenerated")} value="₹2,45,000" color="green" />
        <StatCard icon={ClipboardList} label={t("pendingPayments")} value="₹18,500" color="red" />
        <StatCard icon={Package} label={t("inventoryStock")} value="2,340 units" color="purple" />
        <StatCard icon={ShoppingCart} label={t("marketplaceOrders")} value="28" color="sky" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">{t("weeklyCollectionTrend")}</h3>
          <div className="flex items-end gap-2 h-32">
            {bars.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-green-400 dark:bg-green-600 rounded-t" style={{ height: `${v}%` }} />
                <span className="text-[10px] text-gray-400 mt-1">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">{t("recentActivity")}</h3>
          <div className="space-y-3 text-sm">
            {[
              { dot: "bg-green-500", text: "H001 collected 5kg - Zone A", time: "2m ago" },
              { dot: "bg-sky-500", text: "Payment ₹500 to Ramesh", time: "15m ago" },
              { dot: "bg-amber-500", text: "New order #1245 placed", time: "1h ago" },
              { dot: "bg-green-500", text: "Worker Suresh completed route", time: "2h ago" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-2 h-2 ${a.dot} rounded-full`} />
                <span className="text-gray-600 dark:text-gray-300 flex-1">{a.text}</span>
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
  const houseList = JSON.parse(localStorage.getItem("d2d_houses") || JSON.stringify(DEFAULT_HOUSES)) as House[];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard icon={ClipboardList} label={t("todayCollection")} value="45 kg" color="eco" />
        <StatCard icon={Home} label={t("housesCovered")} value="8/15" color="sky" />
        <StatCard icon={MapPin} label={t("remaining")} value="7 houses" color="amber" />
        <StatCard icon={Weight} label={t("weightCollected")} value="45 kg" color="green" />
        <StatCard icon={IndianRupee} label={t("earningsToday")} value="₹225" color="purple" />
      </div>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">{t("todayRoute")}</h3>
        <div className="space-y-2">
          {houseList.slice(0, 3).map((h, i) => (
            <div key={h.id} className={`flex items-center gap-3 p-2 rounded-lg ${i < 2 ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-700/30"}`}>
              <span className={`w-6 h-6 rounded-full ${i < 2 ? "bg-green-500" : "bg-gray-300"} flex items-center justify-center`}>
                {i < 2 ? <Check className="w-3 h-3 text-white" /> : <Circle className="w-3 h-3 text-white" />}
              </span>
              <span className="text-sm font-medium dark:text-gray-200">{h.id} - {h.owner}</span>
              <span className="text-xs text-gray-400 ml-auto">{h.village}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserDashboard({
  t,
  userName,
  qrRevealed,
  onViewQr,
  onDownloadQr,
  user,
}: {
  t: (k: string) => string;
  userName: string;
  qrRevealed: boolean;
  onViewQr: () => void;
  onDownloadQr: () => void;
  user: any;
}) {
  const history = [
    { d: "17 Jun", w: "3 kg", a: "₹15" },
    { d: "16 Jun", w: "4 kg", a: "₹20" },
    { d: "15 Jun", w: "2.5 kg", a: "₹12.50" },
    { d: "14 Jun", w: "5 kg", a: "₹25" },
  ];

  return (
    <div>
      {/* User Info */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-xl">
            {userName?.[0]?.toUpperCase()}
          </div>

          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100">
              {userName}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              House ID: {user?.id}
            </p>
          </div>
        </div>
      </div>

      {/* QR Section */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4 mb-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {t("yourQrCode")}
        </p>

        <div
          className={`inline-block p-4 bg-white rounded-lg border transition-all duration-500 ${
            qrRevealed ? "" : "blur-sm"
          }`}
        >
          {user?.qr_code ? (
            <img
              src={user.qr_code}
              alt="QR Code"
              className="w-[120px] h-[120px]"
            />
          ) : (
            <div className="w-[120px] h-[120px] flex items-center justify-center text-gray-400">
              No QR Code
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-center gap-2">
          {!qrRevealed ? (
            <button
              onClick={onViewQr}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium"
            >
              {t("viewQrCode")}
            </button>
          ) : (
            <button
              onClick={onDownloadQr}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              {t("downloadQR")}
            </button>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard
          icon={ClipboardList}
          label={t("todayCollection")}
          value="3 kg"
          color="eco"
        />

        <StatCard
          icon={ClipboardList}
          label={t("monthlyCollection")}
          value="68 kg"
          color="sky"
        />

        <StatCard
          icon={IndianRupee}
          label={t("totalEarnings")}
          value="₹2,250"
          color="amber"
        />

        <StatCard
          icon={TrendingUp}
          label={t("thisMonth")}
          value="₹340"
          color="green"
        />
      </div>

      {/* History */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
          {t("collectionHistory")}
        </h3>

        <div className="space-y-2 text-sm">
          {history.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
            >
              <span className="text-gray-600 dark:text-gray-300">
                {r.d}
              </span>

              <span className="font-medium dark:text-gray-200">
                {r.w}
              </span>

              <span className="text-green-600 font-medium">
                {r.a}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// ─── Houses Page ──────────────────────────────────────────────────────────────
function HousesPage({ t, role, onNavigate,loadHouses, onSelectHouse, houses,  setHouses, pendingReqs, setPendingReqs, showToast, workerName }: {
  t: (k: string) => string; role: string; onNavigate: (p: string) => void;
  onSelectHouse: (h: House) => void; houses: House[]; setHouses: (h: House[] | ((p: House[]) => House[])) => void;
  pendingReqs: PendingRequest[]; setPendingReqs: (r: PendingRequest[] | ((p: PendingRequest[]) => PendingRequest[])) => void;
  showToast: (m: string, t?: string) => void; workerName: string; loadHouses: () => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [village, setVillage] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [newOwner, setNewOwner] = useState("");
  const [newVillage, setNewVillage] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newHouseNum, setNewHouseNum] = useState("");

  const villages = ["all", ...Array.from(new Set(houses.map(h => h.village)))];
  const filtered = houses.filter(h =>
    (village === "all" || h.village === village) &&
    (h.owner.toLowerCase().includes(search.toLowerCase()) || h.id.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddHouse = async () => {
  if (!newOwner || !newVillage || !newPhone) {
    showToast("Fill all fields", "error");
    return;
  }

  const { data, error } = await createHouseOwner(
    newOwner,
    newVillage,
    newPhone
  );

  console.log(data);
  console.log(error);

  if (error) {
    showToast(error.message, "error");
    return;
  }

  showToast("House added successfully");

await loadHouses();

  const newHouse: House = {
    id: Date.now().toString(),
    owner: newOwner,
    village: newVillage,
    phone: newPhone,
    qr_code: "",
    collections: 0,
    earnings: 0,
  };

  setHouses((prev) => [...prev, newHouse]);

  setNewOwner("");
  setNewVillage("");
  setNewPhone("");
  setNewHouseNum("");
  setShowAdd(false);
};

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input className="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white" value={search} onChange={e => setSearch(e.target.value)} placeholder={t("searchHouses")} />
        <select className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white" value={village} onChange={e => setVillage(e.target.value)}>
          {villages.map(v => <option key={v} value={v}>{v === "all" ? t("allVillages") : v}</option>)}
        </select>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium whitespace-nowrap flex items-center gap-2">
          <UserPlus className="w-4 h-4" />{t("addHouse")}
        </button>
        {role === "admin" && pendingReqs.length > 0 && (
          <button onClick={() => setShowPending(true)} className="px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-sm font-medium relative whitespace-nowrap">
            {t("pendingRequests")}
            <span className="ml-1 bg-amber-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">{pendingReqs.length}</span>
          </button>
        )}
      </div>
      <div className="space-y-3">
        {filtered.map(h => (
          <div key={h.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition"
            onClick={() => {
  onSelectHouse(h);
  onNavigate("house-profile");
}}>
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center font-bold text-green-700 dark:text-green-400 text-sm">{h.id.slice(-2)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{h.owner}</p>
              <p className="text-xs text-gray-400">{h.id} • {h.village}</p>
            </div>
            <div className="text-right">
  <p className="text-sm font-semibold text-green-600">
    ₹{h.earnings}
  </p>

  <p className="text-xs text-gray-400">
    {h.collections} {t("collections")}
  </p>

  {role === "admin" && (
    <button
      onClick={async (e) => {
        e.stopPropagation();

        const confirmDelete = window.confirm(
          `Delete ${h.owner}?`
        );

        if (!confirmDelete) return;

        const { error } = await deleteUser(Number(h.id));

        if (error) {
          showToast(error.message, "error");
          return;
        }

        await loadHouses();

        showToast("House deleted successfully");
      }}
      className="mt-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
    >
      Delete
    </button>
  )}
</div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8">{t("allVillages")} — {t("searchHouses")}</p>}
      </div>

      {showAdd && (
        <Modal title={t("addHouseTitle")} onClose={() => setShowAdd(false)}>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("houseNumber")}</label>
              <input className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newHouseNum} onChange={e => setNewHouseNum(e.target.value)} placeholder="Enter House Number" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("ownerName")}</label>
              <input className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newOwner} onChange={e => setNewOwner(e.target.value)} placeholder="Enter Owner Name" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("villageName")}</label>
              <input className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newVillage} onChange={e => setNewVillage(e.target.value)} placeholder="Enter Village Name" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("phoneNumber")}</label>
              <input className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Enter Phone no" />
            </div>
            {role !== "admin" && <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">{t("pendingApproval")}</p>}
            <div className="flex gap-2 pt-2">
              <button onClick={handleAddHouse} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium">
                {role === "admin" ? t("saveChanges") : t("requestSubmitted").split(" ")[0]}
              </button>
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">{t("cancel")}</button>
            </div>
          </div>
        </Modal>
      )}

      {showPending && (
        <Modal title={t("pendingRequests")} onClose={() => setShowPending(false)}>
          <div className="space-y-3">
            {pendingReqs.map(req => (
              <div key={req.id} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">{req.house.owner} — {req.house.id}</p>
                    <p className="text-xs text-gray-500">{req.house.village} • {t("requestedBy")}: {req.requestedBy}</p>
                    <p className="text-xs text-gray-400">{req.time}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    setHouses((p: House[]) => [...p, req.house]);
                    setPendingReqs((p: PendingRequest[]) => p.filter(r => r.id !== req.id));
                    showToast(t("houseApproved"));
                  }} className="flex-1 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-medium">{t("approveHouse")}</button>
                  <button onClick={() => {
                    setPendingReqs((p: PendingRequest[]) => p.filter(r => r.id !== req.id));
                    showToast(t("houseRejected"), "error");
                  }} className="flex-1 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium">{t("rejectHouse")}</button>
                </div>
              </div>
            ))}
            {pendingReqs.length === 0 && <p className="text-center text-gray-400 py-4">{t("allVillages")}</p>}
          </div>
        </Modal>
      )}
    </div>
  );
}

function HouseProfilePage({
  t,
  house,
}: {
  t: (k: string) => string;
  house: any;
}) {
  if (!house) {
    return (
      <div className="bg-white rounded-xl p-6">
        <h3 className="text-lg font-semibold">No House Selected</h3>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-xl">
            {house.owner?.substring(0, 2).toUpperCase()}
          </div>

          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100">
              {house.owner}
            </h3>

            <p className="text-sm text-gray-500">
              {house.id} • {house.village}
            </p>

            <p className="text-xs text-gray-400">
              {house.phone}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <p className="text-lg font-bold text-green-700">
              {house.collections || 0}
            </p>
            <p className="text-[10px] text-gray-500">
              {t("collections")}
            </p>
          </div>

          <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3">
            <p className="text-lg font-bold text-sky-700">
              {house.totalWeight || 0} kg
            </p>
            <p className="text-[10px] text-gray-500">
              {t("totalWeight")}
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
            <p className="text-lg font-bold text-amber-700">
              ₹{house.earnings || 0}
            </p>
            <p className="text-[10px] text-gray-500">
              {t("earnings")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
          {t("recentCollections")}
        </h4>

        <div className="space-y-2 text-sm">
          {(house.recentCollections || []).map(
            (r: any, i: number) => (
              <div
                key={i}
                className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
              >
                <span className="dark:text-gray-300">{r.date}</span>

                <span className="font-medium dark:text-gray-200">
                  {r.weight}
                </span>

                <span className="text-green-600">
                  ₹{r.amount}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
// ─── Workers Page ─────────────────────────────────────────────────────────────
function WorkersPage({ t, workers, setWorkers, showToast , loadWorkers}: {
  t: (k: string) => string;
  workers: Worker[]; setWorkers: (w: Worker[] | ((p: Worker[]) => Worker[])) => void;
  showToast: (m: string, t?: string) => void; loadWorkers: () => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showCreds, setShowCreds] = useState<Worker | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const filtered = workers.filter(w => w.name.toLowerCase().includes(search.toLowerCase()) || w.id.includes(search));

 const handleAdd = async () => {
  if (!newName || !newPhone || !newArea || !newPassword) {
    showToast("Fill all fields", "error");
    return;
  }

  const { data, error } = await createWorker(
    newName,
    newArea,
    newPhone,
    newPassword
  );

  if (error) {
    showToast(error.message, "error");
    return;
  }

  showToast("Worker added successfully");

  await loadWorkers();

  setNewName("");
  setNewPhone("");
  setNewArea("");
  setNewPassword("");
  setShowAdd(false);
};

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input className="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white" value={search} onChange={e => setSearch(e.target.value)} placeholder={t("searchWorkers")} />
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium whitespace-nowrap flex items-center gap-2">
          <UserPlus className="w-4 h-4" />{t("addWorker")}
        </button>
      </div>
      <div className="space-y-3">
        {filtered.map(w => (
          <div key={w.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center font-bold text-sky-700 dark:text-sky-400 text-sm">{w.name[0]}</div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 dark:text-gray-100">{w.name}</p>
              <p className="text-xs text-gray-400">{w.id} • {w.area}</p>
            </div>
            <div className="text-right mr-2">
              <p className="text-sm font-semibold dark:text-gray-200">{w.collections} {t("trips")}</p>
              <p className="text-xs text-gray-400">{w.phone}</p>
            </div>
            <button onClick={() => setShowCreds(w)} className="p-2 rounded-lg bg-sky-50 dark:bg-sky-900/20 text-sky-600 hover:bg-sky-100 transition">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={() => setConfirmDel(w.id)} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {showAdd && (
  <Modal
    title={t("addWorkerTitle")}
    onClose={() => setShowAdd(false)}
  >
    <div className="space-y-3">

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Worker Name
        </label>

        <input
          className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Full Name"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Phone Number
        </label>

        <input
          type="tel"
          maxLength={10}
          className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={newPhone}
          onChange={(e) =>
            setNewPhone(
              e.target.value.replace(/\D/g, "")
            )
          }
          placeholder="9876543210"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Area / Village
        </label>

        <input
          className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={newArea}
          onChange={(e) => setNewArea(e.target.value)}
          placeholder="Village Name"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>

        <input
          type="password"
          className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
          placeholder="Enter Password"
        />
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
        <p className="text-xs text-green-700 dark:text-green-400">
          Worker credentials will be:
        </p>

        <p className="text-xs mt-1">
          Username: <b>{newPhone || "Phone Number"}</b>
        </p>

        <p className="text-xs">
          Password: <b>{newPassword || "Password"}</b>
        </p>
      </div>

      <div className="flex gap-2 pt-2">

        <button
          onClick={handleAdd}
          className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium"
        >
          Add Worker
        </button>

        <button
          onClick={() => setShowAdd(false)}
          className="flex-1 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm"
        >
          Cancel
        </button>

      </div>

    </div>
  </Modal>
)}

      {showCreds && (
        <Modal title={t("credentials")} onClose={() => setShowCreds(null)}>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("generatedUsername")}</p>
                <p className="font-mono font-bold text-gray-800 dark:text-gray-100 text-lg">{showCreds.username}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("generatedPassword")}</p>
                <p className="font-mono font-bold text-gray-800 dark:text-gray-100 text-lg">{showCreds.credential}</p>
              </div>
            </div>
            <button onClick={() => { navigator.clipboard?.writeText(`Username: ${showCreds.username}\nPassword: ${showCreds.credential}`); }}
              className="w-full py-2 rounded-lg bg-sky-50 dark:bg-sky-900/20 text-sky-600 text-sm flex items-center justify-center gap-2">
              <Copy className="w-4 h-4" />{t("copyCredentials")}
            </button>
          </div>
        </Modal>
      )}

      {confirmDel && (
  <Modal
    title={t("deleteWorker")}
    onClose={() => setConfirmDel(null)}
  >
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      {t("confirmDelete")}
    </p>

    <div className="flex gap-2">
      <button
        onClick={async () => {
          const { error } = await deleteWorker(
            Number(confirmDel)
          );

          if (error) {
            showToast(error.message, "error");
            return;
          }

          await loadWorkers();

          showToast(
            t("workerDeleted"),
            "success"
          );

          setConfirmDel(null);
        }}
        className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium"
      >
        {t("deleteWorker")}
      </button>

      <button
        onClick={() => setConfirmDel(null)}
        className="flex-1 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm"
      >
        {t("cancel")}
      </button>
    </div>
  </Modal>
)}
    </div>
  );
}

// ─── QR Manage ────────────────────────────────────────────────────────────────
function QrManagePage({
  t,
  houses,
}: {
  t: (k: string) => string;
  houses: House[];
}) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <StatCard
          icon={QrCode}
          label={t("totalQRCodes")}
          value={String(houses.length)}
          color="eco"
        />

        <StatCard
          icon={CheckCircle}
          label={t("assigned")}
          value={String(
            houses.filter((h) => h.qr_code).length
          )}
          color="sky"
        />

        <StatCard
          icon={AlertCircle}
          label={t("unassigned")}
          value={String(
            houses.filter((h) => !h.qr_code).length
          )}
          color="amber"
        />
      </div>

      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
          {t("qrCodeManagement")}
        </h3>

        <div className="space-y-3">
          {houses.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
            >
              <div>
                <p className="font-medium text-sm dark:text-gray-200">
                  {h.owner}
                </p>

                <p className="text-xs text-gray-400">
                  House ID: {h.id}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {h.qr_code ? (
                  <>
                    <img
                      src={h.qr_code}
                      alt="QR Code"
                      className="w-20 h-20 border rounded-lg bg-white p-1"
                    />

                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                      {t("assigned")}
                    </span>
                  </>
                ) : (
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded text-xs font-medium">
                    {t("unassigned")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Payments Page ────────────────────────────────────────────────────────────
function PaymentsPage({
  t,
  payments,
  setPayments,
  showToast,
}: {
  t: (k: string) => string;
  payments: any[];
  setPayments: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (m: string) => void;
}) {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? payments
      : payments.filter(
          (p) => p.status.toLowerCase() === filter
        );

  const toggle = (id: number) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status:
                p.status === "Completed"
                  ? "Pending"
                  : "Completed",
            }
          : p
      )
    );

    showToast("Payment Updated");
  };

  const totalPaid = payments
    .filter((p) => p.status === "Completed")
    .reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );
    const pendingCount = payments.filter(
  p => p.status === "Pending"
).length;

const completedCount = payments.filter(
  p => p.status === "Completed"
).length;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">

        <StatCard
          icon={IndianRupee}
          label={t("totalPaid")}
          value={`₹${totalPaid}`}
          color="eco"
        />

        <StatCard
          icon={ClipboardList}
          label={t("pending")}
          value={`${
            payments.filter(
              (p) => p.status === "Pending"
            ).length
          }`}
          color="amber"
        />

        <StatCard
          icon={CheckCircle}
          label={t("completed")}
          value={`${
            payments.filter(
              (p) => p.status === "Completed"
            ).length
          }`}
          color="sky"
        />

      </div>

      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4">

        <div className="flex gap-2 mb-4 flex-wrap">
          {["all", "pending", "completed"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
                  filter === f
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {f}
              </button>
            )
          )}
        </div>

        <div className="space-y-2">

          {filtered.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">
                  {p.owner_name}
                </p>

                <p className="text-xs text-gray-400">
                  House {p.house_id}
                </p>
              </div>

              <div className="flex items-center gap-3">

                <div className="text-right">
                  <p className="font-semibold text-sm">
                    ₹{p.amount}
                  </p>

                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      p.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <button
                  onClick={() => toggle(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    p.status === "Completed"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {p.status === "Completed"
                    ? "Mark as Pending"
                    : "Mark as Paid"}
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
// ─── Analytics ────────────────────────────────────────────────────────────────
function AnalyticsPage({
  t,
  collections,
  payments,
}: {
  t: (k: string) => string;
  collections: any[];
  payments: any[];
}) {

  const totalWeight = collections.reduce(
    (sum, c) => sum + Number(c.weight || 0),
    0
  );

  const totalRevenue = payments
    .filter((p) => p.status === "Completed")
    .reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

  const totalCollections = collections.length;

  const totalPending = payments.filter(
    (p) => p.status === "Pending"
  ).length;

  const totalCompleted = payments.filter(
    (p) => p.status === "Completed"
  ).length;

  const dailyData = collections.map((item) => ({
    date: new Date(
      item.collection_date || Date.now()
    ).toLocaleDateString(),
    weight: Number(item.weight || 0),
  }));

  const revenueData = payments
    .filter((p) => p.status === "Completed")
    .map((p) => ({
      date: new Date(
        p.payment_date || Date.now()
      ).toLocaleDateString(),
      amount: Number(p.amount || 0),
    }));

  return (
    <div className="grid md:grid-cols-2 gap-4">

      <div className="bg-white rounded-xl p-4 shadow">
        <h3 className="font-semibold mb-3">
          Total Collection
        </h3>

        <div className="text-4xl font-bold text-green-600">
          {totalWeight.toFixed(2)} kg
        </div>

        <p className="text-gray-500 mt-2">
          Total dung collected from all houses
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow">
        <h3 className="font-semibold mb-3">
          Revenue Generated
        </h3>

        <div className="text-4xl font-bold text-blue-600">
          ₹{totalRevenue.toFixed(2)}
        </div>

        <p className="text-gray-500 mt-2">
          Completed Payments Revenue
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow">
        <h3 className="font-semibold mb-3">
          Collection Records
        </h3>

        <div className="text-4xl font-bold text-purple-600">
          {totalCollections}
        </div>

        <p className="text-gray-500 mt-2">
          Total collection entries
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow">
        <h3 className="font-semibold mb-3">
          Payment Status
        </h3>

        <div className="space-y-3">

          <div>
            <div className="flex justify-between">
              <span>Completed</span>
              <span>{totalCompleted}</span>
            </div>

            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="bg-green-500 h-3 rounded"
                style={{
                  width: `${
                    payments.length
                      ? (totalCompleted /
                          payments.length) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <span>Pending</span>
              <span>{totalPending}</span>
            </div>

            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="bg-amber-500 h-3 rounded"
                style={{
                  width: `${
                    payments.length
                      ? (totalPending /
                          payments.length) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow col-span-1">
        <h3 className="font-semibold mb-4">
          Daily Collection (kg)
        </h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="weight"
              fill="#22c55e"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-4 shadow col-span-1">
        <h3 className="font-semibold mb-4">
          Revenue Growth
        </h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
// ─── Reports ──────────────────────────────────────────────────────────────────
function ReportsPage({
  t,
  role,
  collections,
  payments,
  showToast,
}: {
  t: (k: string) => string;
  role: string;
  collections: any[];
  payments: any[];
  showToast: (m: string) => void;
}) {
  const tabs =
    role === "admin"
      ? ["daily", "weekly", "monthly", "yearly"]
      : ["daily", "weekly", "monthly"];

  const [active, setActive] = useState("daily");

  const rows = collections.map((c) => {
    const payment = payments.find(
      (p) => p.house_id === c.house_id
    );

    return {
      date: c.collection_date
        ? new Date(c.collection_date).toLocaleDateString()
        : "-",

      weight: Number(c.weight || 0),

      amount: payment
        ? Number(payment.amount || 0)
        : 0,

      status: payment
        ? payment.status
        : "Pending",
    };
  });

  const totalWeight = rows.reduce(
    (sum, r) => sum + r.weight,
    0
  );

  const totalAmount = rows.reduce(
    (sum, r) => sum + r.amount,
    0
  );
  const exportCSV = () => {
  const csvRows = rows.map((r) => ({
    Date: r.date,
    Weight: r.weight,
    Amount: r.amount,
    Status: r.status,
  }));

  const csv =
    "Date,Weight,Amount,Status\n" +
    csvRows
      .map(
        (r) =>
          `${r.Date},${r.Weight},${r.Amount},${r.Status}`
      )
      .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv",
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "D2D_Report.csv";
  a.click();
};

const exportExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(rows);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Report"
  );

  XLSX.writeFile(
    workbook,
    "D2D_Report.xlsx"
  );
};

const exportPDF = () => {
  window.print();
};

  return (
    <div>
      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">

        <div className="bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold">
            Total Collection
          </h3>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {totalWeight.toFixed(2)} kg
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold">
            Total Revenue
          </h3>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            ₹{totalAmount.toFixed(2)}
          </p>
        </div>

      </div>

      {/* Report Table */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4 mb-4">

        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
                active === tab
                  ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <th className="pb-2">
                  {t("date")}
                </th>

                <th className="pb-2">
                  {t("weight")}
                </th>

                <th className="pb-2">
                  {t("amount")}
                </th>

                <th className="pb-2">
                  {t("status")}
                </th>
              </tr>
            </thead>

            <tbody>

              {rows.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-50 dark:border-gray-700/50"
                >
                  <td className="py-2 dark:text-gray-300">
                    {row.date}
                  </td>

                  <td className="dark:text-gray-300">
                    {row.weight} kg
                  </td>

                  <td className="text-green-600 font-medium">
                    ₹{row.amount}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        row.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Export Buttons */}
      <div className="flex gap-2">

        <button
  onClick={exportPDF}
  className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium flex items-center gap-1"
>
  <FileText className="w-4 h-4" />
  PDF
</button>

        <button
  onClick={exportExcel}
  className="px-4 py-2 rounded-lg bg-green-50 text-green-600 text-sm font-medium flex items-center gap-1"
>
  <FileSpreadsheet className="w-4 h-4" />
  Excel
</button>

        <button
  onClick={exportCSV}
  className="px-4 py-2 rounded-lg bg-sky-50 text-sky-600 text-sm font-medium flex items-center gap-1"
>
  <File className="w-4 h-4" />
  CSV
</button>

      </div>
    </div>
  );
}
// ─── Inventory ────────────────────────────────────────────────────────────────
function InventoryPage({ t }: { t: (k: string) => string }) {
  const items = [
    { n: "Organic Compost", s: 450, u: "bags", low: false }, { n: "Organic Fertilizer", s: 280, u: "bags", low: false },
    { n: "Cow Dung Diyas", s: 1200, u: "pcs", low: false }, { n: "Incense Sticks", s: 45, u: "packs", low: true },
    { n: "Mosquito Repellent", s: 320, u: "pcs", low: false }, { n: "Handicrafts", s: 15, u: "pcs", low: true },
  ];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <StatCard icon={Package} label={t("totalProducts")} value="6" color="eco" />
        <StatCard icon={AlertTriangle} label={t("lowStock")} value="2" color="red" />
        <StatCard icon={TrendingUp} label={t("totalUnits")} value="2,310" color="sky" />
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.low ? "bg-red-100 dark:bg-red-900/40" : "bg-green-100 dark:bg-green-900/40"}`}>
              <Package className={`w-5 h-5 ${item.low ? "text-red-600" : "text-green-600"}`} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">{item.n}</p>
              <p className="text-xs text-gray-400">{item.s} {item.u}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${item.low ? "bg-red-100 dark:bg-red-900/40 text-red-600" : "bg-green-100 dark:bg-green-900/40 text-green-600"}`}>
              {item.low ? t("lowStock") : t("inStock")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Manufacturing ────────────────────────────────────────────────────────────
function ManufacturingPage({ t }: { t: (k: string) => string }) {
  const stages = [
    { n: "Raw Collection", v: 850, u: "kg", c: "amber" }, { n: "Processing", v: 600, u: "kg", c: "sky" },
    { n: "Product Creation", v: 420, u: "units", c: "eco" }, { n: "Packaging", v: 380, u: "units", c: "purple" },
    { n: "Ready Stock", v: 2310, u: "units", c: "green" },
  ];
  const bg: Record<string, string> = { amber: "bg-amber-100 text-amber-700", sky: "bg-sky-100 text-sky-700", eco: "bg-green-100 text-green-700", purple: "bg-purple-100 text-purple-700", green: "bg-green-100 text-green-700" };
  const bar: Record<string, string> = { amber: "bg-amber-500", sky: "bg-sky-500", eco: "bg-green-500", purple: "bg-purple-500", green: "bg-green-500" };
  return (
    <div>
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">{t("manufacturingPipeline")}</h3>
      <div className="space-y-4">
        {stages.map((s, i) => (
          <div key={i} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${bg[s.c]}`}>{i + 1}</div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 dark:text-gray-100">{s.n}</p>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                <div className={`h-2 rounded-full ${bar[s.c]}`} style={{ width: `${Math.min(100, (s.v / 850) * 100)}%` }} />
              </div>
            </div>
            <p className="font-semibold text-sm dark:text-gray-200">{s.v} {s.u}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── E-Commerce ───────────────────────────────────────────────────────────────
function EcommercePage({ t, cart, onAddToCart, showToast }: {
  t: (k: string) => string; cart: { id: number; qty: number }[];
  onAddToCart: (id: number) => void; showToast: (m: string) => void;
}) {
  const total = cart.reduce((s, c) => { const p = PRODUCTS.find(x => x.id === c.id); return s + (p ? p.price * c.qty : 0); }, 0);
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {PRODUCTS.map(p => (
          <div key={p.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer">
            <div className="h-36 overflow-hidden">
              <ProductImg src={p.img} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">{p.name}</h4>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{p.desc}</p>
              <div className="flex items-center gap-1 mt-1"><span className="text-amber-500 text-xs">★ {p.rating}</span></div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-green-700">₹{p.price}</span>
                <button onClick={() => { onAddToCart(p.id); showToast(`${p.name} added`); }}
                  className="px-2 py-1 rounded bg-green-500 text-white text-xs font-medium hover:bg-green-600">{t("addToCart")}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div className="mt-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">🛒 {t("cart")} ({cart.length})</h3>
          <div className="space-y-2">
            {cart.map(c => { const p = PRODUCTS.find(x => x.id === c.id); return p ? (
              <div key={c.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <span className="text-sm dark:text-gray-300">{p.name} x{c.qty}</span>
                <span className="font-medium text-sm dark:text-gray-200">₹{p.price * c.qty}</span>
              </div>
            ) : null; })}
          </div>
          <div className="border-t dark:border-gray-700 mt-3 pt-3 flex justify-between">
            <span className="font-semibold dark:text-gray-200">{t("total")}</span>
            <span className="font-bold text-green-700">₹{total}</span>
          </div>
          <button onClick={() => showToast(t("orderPlaced"))} className="w-full mt-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium">
            {t("placeOrder")}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Other Pages ──────────────────────────────────────────────────────────────
function QrScannerPage({
  t,
  showToast,
  setScannedHouse,
  setPage,
}: {
  t: (k: string) => string;
  showToast: (m: string) => void;
  setScannedHouse: (house: any) => void;
  setPage: (page: string) => void;
}) {

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(

      async (decodedText) => {

        try {

          console.log("QR DATA:", decodedText);

          const houseId = decodedText.replace("HOUSE:", "");

          const { data, error } = await supabase
            .from("app_user")
            .select("*")
            .eq("id", houseId)
            .single();

          if (error || !data) {
            showToast("House not found");
            return;
          }

          setScannedHouse(data);

          showToast(`House Found: ${data.name}`);

          setPage("collection-entry");

          scanner.clear();

        } catch (err) {
          console.log(err);
        }

      },

      (error) => {
        // Ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };

  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8">

      <div
        id="reader"
        className="w-full max-w-md"
      ></div>

      <p className="text-gray-600 dark:text-gray-300 font-medium mt-4">
        {t("pointCamera")}
      </p>

      <p className="text-sm text-gray-400 mt-1">
        {t("autoDetection")}
      </p>

    </div>
  );
}



function BluetoothPage({
  t,
  showToast,
  setCapturedWeight,
}: {
  t: (k: string) => string;
  showToast: (m: string) => void;
  setCapturedWeight: (weight: string) => void;
}) {

  const [weight, setWeight] = useState("0.0");
  const [connected, setConnected] = useState(false);

  const connectScale = () => {

    setConnected(true);

    showToast("Scale Connected");

    let w = 0;

    const iv = setInterval(() => {

      w += 0.3;

      if (w > 4.5) {
        clearInterval(iv);
        return;
      }

      setWeight(w.toFixed(1));

    }, 200);
  };

  const captureWeight = () => {

    setCapturedWeight(weight);

    showToast(`Weight Captured: ${weight} kg`);
  };

  return (
    <div className="flex flex-col items-center py-8">

      <div className="w-32 h-32 rounded-full bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center mb-4 relative">

        <div
          className={`absolute inset-0 rounded-full border-4 ${
            connected
              ? "border-green-400 animate-pulse"
              : "border-sky-200"
          }`}
        />

        <Bluetooth className="w-12 h-12 text-sky-500" />
      </div>

      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
        {t("bluetoothScale2")}
      </h3>

      <p className="text-sm text-gray-400 mb-6">
        {connected
          ? "Connected"
          : t("connectToScale")}
      </p>

      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-6 w-full max-w-sm text-center mb-4">

        <p className="text-xs text-gray-400">
          {t("liveWeightReading")}
        </p>

        <p className="text-5xl font-bold text-gray-800 dark:text-gray-100 my-3">
          {weight}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("kilograms")}
        </p>

      </div>

      <div className="flex gap-3">

        <button
          onClick={connectScale}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium"
        >
          {t("connectDevice")}
        </button>

        <button
          onClick={captureWeight}
          className="px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-sm font-medium"
        >
          {t("captureWeight")}
        </button>

      </div>

    </div>
  );
}
function CollectionEntryPage({
  t,
  showToast,
  scannedHouse,
  capturedWeight,
  user,
}: {
  t: (k: string) => string;
  showToast: (m: string) => void;
  scannedHouse: any;
  capturedWeight: string;
  user: any;
}) {

  const [rate, setRate] = useState("5");
  const [houseNo, setHouseNo] = useState("");
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    if (scannedHouse) {
      setHouseNo(scannedHouse.id?.toString() || "");
      setOwnerName(scannedHouse.name || "");
    }
  }, [scannedHouse]);

  const amount = (
    parseFloat(capturedWeight || "0") *
    parseFloat(rate || "0")
  ).toFixed(2);

  const saveCollection = async () => {
    if (!scannedHouse) {
      showToast("Please scan QR code first");
      return;
    }

    const { error } = await supabase
      .from("collections")
      .insert([
        {
          house_id: scannedHouse.id,
          owner_name: scannedHouse.name,
          weight: Number(capturedWeight),
          worker_name: user?.name,
          rate_per_kg: Number(rate),
          amount: Number(amount),
          collection_date: new Date(),
        },
      ]);

    if (error) {
      console.log(error);
      showToast("Failed to save collection");
      return;
    }
 await supabase
    .from("payments")
    .insert([
      {
        house_id: scannedHouse.id,
        owner_name: scannedHouse.name,
        amount: Number(amount),
              payment_date: new Date(),

        status: "Pending",
      },
    ]);

  showToast("Collection saved successfully!");
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCollection();
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-5 max-w-lg mx-auto">

      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {t("newCollectionEntry")}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="text-sm font-medium">
            {t("houseNumber")}
          </label>

          <input
            value={houseNo}
            readOnly
            className="w-full mt-1 px-3 py-2 rounded-lg border"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            {t("houseOwner")}
          </label>

          <input
            value={ownerName}
            readOnly
            className="w-full mt-1 px-3 py-2 rounded-lg border"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            {t("date")}
          </label>

          <input
            type="date"
            value={new Date().toISOString().split("T")[0]}
            readOnly
            className="w-full mt-1 px-3 py-2 rounded-lg border"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            {t("weight")} (kg)
          </label>

          <input
            value={capturedWeight}
            readOnly
            className="w-full mt-1 px-3 py-2 rounded-lg border"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            {t("ratePerKg")}
          </label>

          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg border"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            {t("totalAmount")}
          </label>

          <input
            value={`₹${amount}`}
            readOnly
            className="w-full mt-1 px-3 py-2 rounded-lg border bg-green-50 font-semibold"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white font-semibold"
        >
          {t("saveCollection")}
        </button>

      </form>
    </div>
  );
}
function CollectionsPage({
  t,
  collections,
  houses,
  workers,
}: {
  t: (k: string) => string;
  collections: any[];
  houses: House[];
  workers: Worker[];
}) {
  console.log("Collections Page Data:", collections);

  const todayTotal = collections
    .filter((c) => {
      const today = new Date().toDateString();
      return new Date(c.created_at).toDateString() === today;
    })
    .reduce((sum, c) => sum + Number(c.weight || 0), 0);

  const weekTotal = collections.reduce(
    (sum, c) => sum + Number(c.weight || 0),
    0
  );

  const monthTotal = collections
    .filter((c) => {
      const now = new Date();
      const d = new Date(c.created_at);

      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, c) => sum + Number(c.weight || 0), 0);

  const activeHouses = new Set(
    collections.map((c) => c.house_id)
  ).size;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard
          icon={ClipboardList}
          label={t("today")}
          value={`${todayTotal} kg`}
          color="eco"
        />

        <StatCard
          icon={ClipboardList}
          label={t("thisWeek")}
          value={`${weekTotal} kg`}
          color="sky"
        />

        <StatCard
          icon={TrendingUp}
          label={t("thisMonth")}
          value={`${monthTotal} kg`}
          color="amber"
        />

        <StatCard
          icon={Home}
          label="Houses Active"
          value={String(activeHouses)}
          color="green"
        />
      </div>

      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
          {t("recentCollections")}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <th className="pb-2">{t("house")}</th>
                <th className="pb-2">{t("worker")}</th>
                <th className="pb-2">{t("weight")}</th>
                <th className="pb-2">{t("amount")}</th>
                <th className="pb-2">{t("time")}</th>
              </tr>
            </thead>

            <tbody>
              {collections.map((c) => {
                const house = houses.find(
                  (h) => Number(h.id) === Number(c.house_id)
                );

                const worker = workers.find(
                  (w) => Number(w.id) === Number(c.worker_id)
                );

                return (
                  <tr
                    key={c.id}
                    className="border-b border-gray-50 dark:border-gray-700/50"
                  >
                    <td className="py-2 dark:text-gray-300">
                      {house?.id || c.house_id}
                    </td>

                    <td className="dark:text-gray-300">
                      {worker?.name || c.worker_name || "Unknown"}
                    </td>

                    <td className="dark:text-gray-300">
                      {c.weight} kg
                    </td>

                    <td className="dark:text-gray-300">
                      ₹{c.amount}
                    </td>

                    <td className="text-gray-400">
                      {new Date(
                        c.created_at
                      ).toLocaleString()}
                    </td>
                  </tr>
                );
              })}

              {collections.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-400"
                  >
                    No collections found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function NotificationsPage({ t, role }: { t: (k: string) => string; role: string }) {
  const notifs = NOTIFS[role] || [];
  return (
    <div className="space-y-3">
      {notifs.map((n, i) => (
        <div key={i} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-800 dark:text-gray-200">{n}</p>
            <p className="text-xs text-gray-400 mt-1">{t("today")}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfilePage({ t, role, userName }: { t: (k: string) => string; role: string; userName: string }) {
  const roleLabel = role === "admin" ? t("admin") : role === "worker" ? t("workerRole") : t("houseOwnerRole");
  return (
    <div>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-6 text-center max-w-sm mx-auto mb-4">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-2xl mx-auto mb-3">
          {userName[0]?.toUpperCase()}
        </div>
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{userName}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{roleLabel} • Sundarpur Village</p>
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-3 text-center"><p className="text-lg font-bold text-green-700">45</p><p className="text-[10px] text-gray-500 dark:text-gray-400">{t("collections")}</p></div>
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-3 text-center"><p className="text-lg font-bold text-sky-700">12</p><p className="text-[10px] text-gray-500 dark:text-gray-400">{t("months")}</p></div>
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-3 text-center"><p className="text-lg font-bold text-amber-700">3</p><p className="text-[10px] text-gray-500 dark:text-gray-400">{t("badges")}</p></div>
      </div>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4 max-w-sm mx-auto">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">{t("activityTimeline")}</h4>
        <div className="space-y-3 text-sm">
          {[{ text: t("collectionRecorded"), d: t("today") }, { text: `${t("paymentReceived")} ₹150`, d: t("yesterday") }, { text: t("joinedD2D"), d: t("sixMonthsAgo") }].map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-600 dark:text-gray-300 flex-1">{a.text}</span>
              <span className="text-xs text-gray-400">{a.d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────
function RegisterPage({ t, onLogin }: { t: (k: string) => string; onLogin: () => void }) {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    role: "houseOwner",
    fullName: "",
    phone: "",
    email: "",
    password: "",
    village: "",
    panchayat: "",
    district: "",
    pinCode: "",
    houseNumber: "",
    cows: "",
    dung: "",
    idType: "",
    idNumber: "",
  });

  const isWorker = formData.role === "Worker";
  const totalSteps = isWorker ? 4 : 5;

  const stepTitles = isWorker
    ? [t("personalInfo"), t("addressInfo"), t("identityVerification"), t("reviewSubmit")]
    : [t("personalInfo"), t("addressInfo"), t("houseDetails"), t("identityVerification"), t("reviewSubmit")];

const handleSubmit = async () => {

  if (!formData.fullName.trim()) {
    alert("Full Name is required");
    return;
  }

  if (!/^[A-Za-z ]+$/.test(formData.fullName)) {
    alert("Name should contain only letters");
    return;
  }

  if (!/^[0-9]{10}$/.test(formData.phone)) {
    alert("Phone number must be exactly 10 digits");
    return;
  }

  if (
    formData.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    alert("Invalid email address");
    return;
  }

  if (formData.password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  if (!formData.village.trim()) {
    alert("Village is required");
    return;
  }

  if (!formData.panchayat.trim()) {
    alert("Panchayat is required");
    return;
  }

  if (!formData.district.trim()) {
    alert("District is required");
    return;
  }

  if (!/^[0-9]{6}$/.test(formData.pinCode)) {
    alert("PIN Code must be 6 digits");
    return;
  }

  if (!isWorker) {

    if (!formData.houseNumber.trim()) {
      alert("House Number is required");
      return;
    }

    if (
      formData.cows &&
      isNaN(Number(formData.cows))
    ) {
      alert("Number of cows must be numeric");
      return;
    }

    if (
      formData.dung &&
      isNaN(Number(formData.dung))
    ) {
      alert("Dung quantity must be numeric");
      return;
    }
  }

  if (!formData.idType.trim()) {
    alert("ID Type is required");
    return;
  }

  if (!formData.idNumber.trim()) {
    alert("ID Number is required");
    return;
  }

  const { data, error } = await createUser(
    formData.fullName,
    0,
    formData.village,
    formData.phone,
    formData.role,
    formData.password
  );

  if (error) {
    alert(error.message);
    return;
  }

  alert("Account Created Successfully");
  onLogin();
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{t("createAccountTitle")}</h1>
          <p>{t("joinNetwork")}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">

          <h3 className="font-semibold mb-4">
            {stepTitles[step - 1]}
          </h3>

          {step === 1 && (
            <div className="space-y-3">

              <select
                className="w-full px-3 py-2 rounded-lg border"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="houseOwner">{t("houseOwnerRole")}</option>
                
              </select>

              <input
                className="w-full px-3 py-2 rounded-lg border"
                placeholder={t("fullName")}
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />

              <input
  className="w-full px-3 py-2 rounded-lg border"
  placeholder={t("phoneNumber")}
  value={formData.phone}
  maxLength={10}
  onChange={(e) =>
    setFormData({
      ...formData,
      phone: e.target.value.replace(/\D/g, "")
    })
  }
/>

              <input
                className="w-full px-3 py-2 rounded-lg border"
                placeholder={t("emailOptional")}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <input
  type="password"
  minLength={6}
  className="w-full px-3 py-2 rounded-lg border"
  placeholder="Password"
  value={formData.password}
  onChange={(e) =>
    setFormData({
      ...formData,
      password: e.target.value
    })
  }
/>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">

              <input
                className="w-full px-3 py-2 rounded-lg border"
                placeholder={t("villageName")}
                value={formData.village}
                onChange={(e) =>
                  setFormData({ ...formData, village: e.target.value })
                }
              />

              <input
                className="w-full px-3 py-2 rounded-lg border"
                placeholder={t("panchayat")}
                value={formData.panchayat}
                onChange={(e) =>
                  setFormData({ ...formData, panchayat: e.target.value })
                }
              />

              <input
                className="w-full px-3 py-2 rounded-lg border"
                placeholder={t("district")}
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
              />

              <input
                className="w-full px-3 py-2 rounded-lg border"
                placeholder={t("pinCode")}
                value={formData.pinCode}
                onChange={(e) =>
                  setFormData({ ...formData, pinCode: e.target.value })
                }
              />
            </div>
          )}

          {step === 3 && !isWorker && (
            <div className="space-y-3">

              <input
                className="w-full px-3 py-2 rounded-lg border"
                placeholder={t("houseNumber")}
                value={formData.houseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, houseNumber: e.target.value })
                }
              />

              <input
                className="w-full px-3 py-2 rounded-lg border"
                placeholder={t("numberOfCows")}
                value={formData.cows}
                onChange={(e) =>
                  setFormData({ ...formData, cows: e.target.value })
                }
              />

              <input
                className="w-full px-3 py-2 rounded-lg border"
                placeholder={t("estimatedDung")}
                value={formData.dung}
                onChange={(e) =>
                  setFormData({ ...formData, dung: e.target.value })
                }
              />
            </div>
          )}

          {((step === 3 && isWorker) || (step === 4 && !isWorker)) && (
            <div className="space-y-3">

              <input
                className="w-full px-3 py-2 rounded-lg border"
                placeholder={t("idType")}
                value={formData.idType}
                onChange={(e) =>
                  setFormData({ ...formData, idType: e.target.value })
                }
              />

              <input
                className="w-full px-3 py-2 rounded-lg border"
                placeholder={t("idNumber")}
                value={formData.idNumber}
                onChange={(e) =>
                  setFormData({ ...formData, idNumber: e.target.value })
                }
              />
            </div>
          )}

          {step === totalSteps && (
            <div className="space-y-2 text-sm">
              <p><b>Name:</b> {formData.fullName}</p>
              <p><b>Phone:</b> {formData.phone}</p>
              <p><b>Email:</b> {formData.email}</p>
              <p><b>Village:</b> {formData.village}</p>
            </div>
          )}

          <div className="flex justify-between mt-6">

            <button
              onClick={() => step > 1 && setStep(step - 1)}
              className={`px-4 py-2 rounded-lg bg-gray-100 ${
                step === 1 ? "invisible" : ""
              }`}
            >
              {t("back")}
            </button>

            <button
              onClick={() => {
                if (step < totalSteps) {
                  setStep(step + 1);
                } else {
                  handleSubmit();
                }
              }}
              className="px-4 py-2 rounded-lg bg-green-600 text-white"
            >
              {step === totalSteps ? t("submit") : t("next")}
            </button>

          </div>

        </div>

        <p className="text-center mt-4 text-sm">
          {t("alreadyHaveAccount")}{" "}
          <button
            onClick={onLogin}
            className="text-green-600"
          >
            {t("login")}
          </button>
        </p>

      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [showForgot, setShowForgot] = useState(false);

const [resetPhone, setResetPhone] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
  const [scannedHouse, setScannedHouse] = useState<any>(null);
  const [capturedWeight, setCapturedWeight] = useState("0.0");
  const [dbWorkers, setDbWorkers] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [page, setPage] = useState<string>("splash");
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<{
  id?: number;
  name: string;
  role: string;
  qr_code?: string;
} | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<any>(null);

  const [language, setLanguage] = useLS("d2d_lang", "en");
  const [theme, setTheme] = useLS<Theme>("d2d_theme", "light");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrRevealed, setQrRevealed] = useState(false);
  const [qrPass, setQrPass] = useState("");
  const [qrError, setQrError] = useState(false);

  const [houses, setHouses] = useState<House[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);

  const [payments, setPayments] = useLS<Payment[]>(
    "d2d_payments",
    DEFAULT_PAYMENTS
  );

  const [pendingReqs, setPendingReqs] = useLS<PendingRequest[]>(
    "d2d_pending",
    []
  );

  const { toasts, show: showToast } = useToast();

  const t = (key: string) =>
    T[language]?.[key] || T["en"]?.[key] || key;

  // Load Admin Users
  useEffect(() => {
    async function loadUsers() {
      if (role !== "admin") return;

      const { data } = await getAllUsers();

      if (data) {
        setAllUsers(data);
      }
    }

    loadUsers();
  }, [role]);

  // Load Houses + Workers from Supabase
  useEffect(() => {
    loadDatabaseData();
  }, []);

const loadWorkers = async () => {
  const { data, error } = await getWorkers();

  if (error) {
    console.log(error);
    return;
  }

  if (!data) return;

const workerData: Worker[] = data.map((u: any) => ({
  id: u.id.toString(),
  name: u.name,
  phone: u.phone_no,
  area: u.address,
  collections: 0,
  username: u.username || "",
  credential: u.password || "",
}));

  setWorkers(workerData);
};

useEffect(() => {
  loadWorkers();
}, []);
const loadHouses = async () => {
  const { data, error } = await getHouseOwners();

  if (error) {
    console.log(error);
    return;
  }

  if (!data) return;

  const houseData = data.map((u: any) => ({
    id: u.id.toString(),
    owner: u.name,
    village: u.address,
    phone: u.phone_no,
    qr_code: u.qr_code,
    collections: 0,
    earnings: 0,
  }));

  setHouses(houseData);
};

useEffect(() => {
  loadHouses();
}, []);

  async function loadDatabaseData() {
    const houseResult = await getHouseOwners();
    const workerResult = await getWorkers();

    if (houseResult.data) {
      setHouses(
        houseResult.data.map((u: any) => ({
          id: u.id.toString(),
          owner: u.name,
          village: u.address,
          phone: u.phone_no,
          qr_code: u.qr_code || "",
          collections: 0,
          earnings: 0,
        }))
      );
    }

    if (workerResult.data) {
      setWorkers(
        workerResult.data.map((u: any) => ({
          id: u.id.toString(),
          name: u.name,
          phone: u.phone_no,
          area: u.address,
          collections: 0,
        }))
      );
    }
  }
useEffect(() => {
  if (page === "splash") {
    const timer = setTimeout(() => {
      setPage("login");
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [page]);
const loadCollections = async () => {
  const { data, error } = await getCollections();

  console.log("COLLECTION DATA:", data);
  console.log("COLLECTION ERROR:", error);

  if (error) {
    console.log(error);
    return;
  }

  setCollections(data || []);
};
useEffect(() => {
  loadCollections();
}, []);

const loadPayments = async () => {
  const { data, error } = await getPayments();

  if (error) {
    console.log(error);
    return;
  }

  setPayments(data || []);
};
useEffect(() => {
  loadPayments();
}, []);
  // Keep the rest of your App code unchanged below this


const handleQRScan = async (qrText: string) => {

  const houseId = qrText.replace("HOUSE:", "");

  const { data, error } = await supabase
    .from("app_user")
    .select("*")
    .eq("id", houseId)
    .single();

  if(error){
    showToast("House not found", "error");
    return;
  }

  setScannedHouse(data);

  setPage("collection-entry");
};

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedRole) {
    showToast(t("selectRole"), "error");
    return;
  }

  const username =
    (e.target as HTMLFormElement)
      .querySelector<HTMLInputElement>("#username")
      ?.value || "";

  const password =
    (e.target as HTMLFormElement)
      .querySelector<HTMLInputElement>("#password")
      ?.value || "";

const { data, error } = await supabase
  .from("app_user")
  .select("*")
  .eq("name", username)
  .eq("password", password)
  .limit(1);

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error || !data || data.length === 0) {
    showToast("Invalid username or password", "error");
    return;
  }

  const userData = data[0];
  console.log("selectedRole =", selectedRole);
  console.log("db role =", userData.role);

  if (selectedRole !== userData.role) {
  showToast("Selected role does not match account role", "error");
  return;
}

  setRole(userData.role);

setUser({
  id: userData.id,
  name: userData.name,
  role: userData.role,
  qr_code: userData.qr_code,
});
console.log("USER DATA:", userData);
console.log("QR CODE:", userData.qr_code);

  showToast(`Welcome ${userData.fullName}`);

  setPage("dashboard");
};
  const handleLogout = () => { setRole(null); setUser(null); showToast("Logged out"); setPage("login"); };

  const addToCart = (id: number) => {
    setCart(prev => { const ex = prev.find(c => c.id === id); if (ex) return prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c); return [...prev, { id, qty: 1 }]; });
  };

  const bgClass = theme === "dark" ? "bg-gray-950" : theme === "custom" ? "bg-amber-50" : "bg-gray-50";
  const sidebarClass = theme === "dark" ? "bg-gray-900 border-gray-800" : theme === "custom" ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100";
  const headerClass = theme === "dark" ? "bg-gray-900/80 border-gray-800" : theme === "custom" ? "bg-amber-50/80 border-amber-200" : "bg-white/80 border-gray-200";

  // ── Splash ──
  if (page === "splash") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-800 via-green-700 to-sky-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 rounded-full bg-green-500/20 absolute inset-0 animate-ping" />
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-sky-400 flex items-center justify-center relative">
              <span className="text-4xl font-extrabold text-white">D2D</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">{t("welcomeToD2D").replace("Welcome to ", "Dung To Development")}</h1>
          <p className="text-green-200 text-lg mb-8">{t("transformingWaste")}</p>
          <div className="flex justify-center gap-2">
            <span className="w-3 h-3 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
            <span className="w-3 h-3 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            <span className="w-3 h-3 bg-sky-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    );
  }

  // ── Register ──
  if (page === "register") return <RegisterPage t={t} onLogin={() => setPage("login")} />;

  // ── Login ──
  if (page === "login" || !role) {
    const handlePasswordReset = async () => {

  if (!resetPhone) {
    alert("Enter phone number");
    return;
  }

  if (!newPassword) {
    alert("Enter new password");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const { error } = await supabase
    .from("app_user")
    .update({
      password: newPassword,
    })
    .eq("phone_no", resetPhone);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Password updated successfully");

  setShowForgot(false);

  setResetPhone("");
  setNewPassword("");
  setConfirmPassword("");
};
    const roles = [
      { id: "admin", icon: Shield, label: t("admin"), color: "eco" },
      { id: "worker", icon: HardHat, label: t("workerRole"), color: "sky" },
      { id: "houseOwner", icon: Home, label: t("houseOwnerRole"), color: "amber" },
    ];

    const borderColors: Record<string, string> = { eco: "border-green-500 bg-green-50", sky: "border-sky-500 bg-sky-50", amber: "border-amber-500 bg-amber-50" };
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-sky-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">D2D</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{t("welcomeToD2D")}</h1>
            <p className="text-gray-500 mt-1">{t("d2dSubtitle")}</p>
          </div>
          <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl">
            <p className="text-sm font-semibold text-gray-600 mb-3">{t("selectRole")}</p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {roles.map(r => (
                <button key={r.id} onClick={() => setSelectedRole(r.id)}
                  className={`p-3 rounded-xl border-2 transition text-center ${selectedRole === r.id ? borderColors[r.color] : "border-gray-200 hover:border-gray-300"}`}>
                  <r.icon className="w-6 h-6 mx-auto text-gray-600 mb-1" />
                  <span className="text-xs font-medium block">{r.label}</span>
                </button>
              ))}
            </div>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="text-sm font-medium text-gray-700">{t("username")}</label>
                  <input id="username" type="text" className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none" placeholder={t("enterUsername")} required />
                </div>
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">{t("password")}</label>
                  <input id="password" type="password" className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none" placeholder={t("enterPassword")} required />
                </div>
                <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white font-semibold text-sm">
                  {t("login")}
                </button>
              </div>
            </form>
            <div className="flex justify-between mt-4 text-xs">
              <button
  onClick={() => setShowForgot(true)}
  className="text-green-600 hover:underline"
>
  {t("forgotPassword")}
</button>
              <button onClick={() => setPage("register")} className="text-sky-600 hover:underline">{t("createAccount")}</button>
            </div>
            <div className="mt-3 flex justify-end">
              <select value={language} onChange={e => setLanguage(e.target.value)} className="px-2 py-1 rounded-lg border text-xs bg-white">
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
          </div>
        </div>
        {showForgot && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-96">

      <h2 className="text-xl font-bold mb-4">
        Reset Password
      </h2>

      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="Phone Number"
        value={resetPhone}
        onChange={(e) =>
          setResetPhone(e.target.value)
        }
      />

      <input
        type="password"
        className="w-full border p-2 mb-3 rounded"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) =>
          setNewPassword(e.target.value)
        }
      />

      <input
        type="password"
        className="w-full border p-2 mb-4 rounded"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(e.target.value)
        }
      />

      <div className="flex justify-end gap-2">

        <button
          onClick={() => setShowForgot(false)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handlePasswordReset}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Update Password
        </button>

      </div>

    </div>

  </div>
)}
        <div className="fixed top-4 right-4 z-[999] space-y-2">
          {toasts.map(toast => (
            <div key={toast.id} className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-red-500" : "bg-sky-500"}`}>{toast.msg}</div>
          ))}
        </div>
      </div>
    );
  }

  // ── Dashboard Layout ──
  const menu = MENUS[role] || [];
  const currentPageKey = menu.find(m => m.id === page)?.key || "dashboard";
  const pendingBadge = role === "admin" && pendingReqs.length > 0;

  const renderPage = () => {
    const userName = user?.name || "User";
    switch (page) {
case "dashboard":
  if (role === "admin") {
    return <AdminDashboard t={t} />;
  }

  if (role === "collectionWorker") {
    return <WorkerDashboard t={t} />;
  }

  if (role === "houseOwner") {
    return (
      <UserDashboard
        t={t}
        userName={user?.name || ""}
        qrRevealed={qrRevealed}
        onViewQr={() => setQrModalOpen(true)}
        onDownloadQr={() => downloadQRCode(user)}
        user={user}
      />
    );
  }

  return <AdminDashboard t={t} />;
      case "houses": return (
        <HousesPage
  t={t}
  role={role}
  onNavigate={setPage}
  houses={houses}
  setHouses={setHouses}
  pendingReqs={pendingReqs}
  onSelectHouse={(house) => setSelectedHouse(house)}
  setPendingReqs={setPendingReqs}
  showToast={showToast}
  workerName={user?.name || "Worker"}
  loadHouses={loadHouses}
  
/>
      );
      case "house-profile":
  return (
    <HouseProfilePage
      t={t}
      house={selectedHouse}
    />
  );
      case "workers":
  return (
    <WorkersPage
      t={t}
      workers={workers}
      setWorkers={setWorkers}
      showToast={showToast}
      loadWorkers={loadWorkers}
    />
  );
      case "qr-manage": return <QrManagePage t={t} houses={houses} />;
      case "qr-scanner": return <QrScannerPage t={t} showToast={showToast} setScannedHouse={setScannedHouse}
  setPage={setPage} />;
      case "bluetooth": return <BluetoothPage t={t} showToast={showToast} setCapturedWeight={setCapturedWeight}/>;
      case "collection-entry": return <CollectionEntryPage t={t} showToast={showToast} scannedHouse={scannedHouse} capturedWeight={capturedWeight} user={user}/>;
      case "collections": return <CollectionsPage t={t} collections={collections}
      houses={houses}
      workers={workers} />;
      case "payments": return <PaymentsPage t={t} payments={payments}
  setPayments={setPayments} showToast={showToast} />;
      case "analytics": return <AnalyticsPage t={t} collections={collections}
      payments={payments}/>;
      case "reports": return <ReportsPage t={t} role={role} collections={collections}
      payments={payments} showToast={showToast} />;
      case "inventory": return <InventoryPage t={t} />;
      case "manufacturing": return <ManufacturingPage t={t} />;
      case "ecommerce": return <EcommercePage t={t} cart={cart} onAddToCart={addToCart} showToast={showToast} />;
      case "notifications": return <NotificationsPage t={t} role={role} />;
      case "settings": return (
        <SettingsPage t={t} theme={theme} setTheme={setTheme}
          language={language} setLanguage={setLanguage}
          user={user} setUser={setUser} showToast={showToast} />
      );
      case "profile": return <ProfilePage t={t} role={role} userName={userName} />;
      default: return <AdminDashboard t={t} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${bgClass}`}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative z-50 md:z-auto w-[260px] h-full flex flex-col shadow-lg md:shadow-none transition-transform duration-300 border-r ${sidebarClass}`}>
        <div className={`p-4 border-b ${theme === "dark" ? "border-gray-800" : theme === "custom" ? "border-amber-200" : "border-gray-100"} flex items-center gap-3`}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-sky-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">D2D</span>
          </div>
          <div className="flex-1">
            <p className={`text-sm font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>D2D Portal</p>
            <p className="text-[10px] text-gray-400 capitalize">{t(role === "admin" ? "admin" : role === "worker" ? "workerRole" : "houseOwnerRole")} Panel</p>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menu.map(m => (
            <button key={m.id} onClick={() => { setPage(m.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative
                ${page === m.id
                  ? theme === "custom" ? "bg-amber-200 text-amber-800" : "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                  : theme === "dark" ? "text-gray-400 hover:bg-gray-800 hover:text-green-400" : theme === "custom" ? "text-amber-700 hover:bg-amber-100" : "text-gray-600 hover:bg-green-50 hover:text-green-600"}`}>
              <m.icon className="w-4 h-4" />
              {t(m.key)}
              {m.id === "houses" && pendingBadge && (
                <span className="absolute right-2 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>
        <div className={`p-3 border-t ${theme === "dark" ? "border-gray-800" : theme === "custom" ? "border-amber-200" : "border-gray-100"}`}>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
            <LogOut className="w-4 h-4" />{t("logout")}
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="md:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 overflow-y-auto min-w-0">
        <header className={`sticky top-0 backdrop-blur-md border-b px-4 py-3 flex items-center gap-3 z-30 ${headerClass}`}>
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
          <h2 className={`font-semibold flex-1 capitalize ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>{t(currentPageKey)}</h2>
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className={`px-2 py-1 rounded-lg border text-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white"}`}>
            <option value="en">EN</option>
            <option value="ta">தமிழ்</option>
          </select>
          <button onClick={() => setPage("notifications")} className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-sm cursor-pointer" onClick={() => setPage("profile")}>
            {(user?.name || "U")[0].toUpperCase()}
          </div>
        </header>
        <div className="p-4 md:p-6">{renderPage()}</div>
      </main>

      {/* QR Password Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">{t("verifyPassword")}</h3>
            <input type="password" className="w-full px-3 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-white mb-4"
              placeholder={t("enterPassword")} value={qrPass} onChange={e => setQrPass(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={() => {
                if (qrPass.length >= 4) {
                  setQrModalOpen(false); setQrPass(""); setQrError(false);
                  setQrRevealed(true); showToast(t("qrRevealed"));
                } else setQrError(true);
              }} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium">
                {t("verify")}
              </button>
              <button onClick={() => { setQrModalOpen(false); setQrPass(""); setQrError(false); }}
                className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                {t("cancel")}
              </button>
            </div>
            {qrError && <p className="text-red-500 text-xs mt-2">{t("accessDenied")}</p>}
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[999] space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-red-500" : "bg-sky-500"}`}>
            {toast.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
