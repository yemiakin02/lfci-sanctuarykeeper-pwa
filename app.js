// Page 5: Admin Panel Dashboard
    page5: document.getElementById('page5'),
    uiAdminStatToday: document.getElementById('uiAdminStatToday'),
    uiAdminStatThisWeek: document.getElementById('uiAdminStatThisWeek'),
    uiAdminStatThisMonth: document.getElementById('uiAdminStatThisMonth'),
    uiAdminStatThisYear: document.getElementById('uiAdminStatThisYear'),
    uiAdminRecentAttendanceList: document.getElementById('uiAdminRecentAttendanceList'),
    uiAdminManageSettingsBtn: document.getElementById('uiAdminManageSettingsBtn'),
    // Page Admin Members
    pageAdminMembers: document.getElementById('pageAdminMembers'),
    uiMemberSearchInput: document.getElementById('uiMemberSearchInput'),
    uiAdminMemberListTableContainer: document.getElementById('uiAdminMemberListTableContainer'),
    // Page Admin Log
    pageAdminLog: document.getElementById('pageAdminLog'),
    uiAttLogFilterMemberId: document.getElementById('uiAttLogFilterMemberId'),
    uiAttLogFilterWeekId: document.getElementById('uiAttLogFilterWeekId'),
    uiApplyAttLogFiltersBtn: document.getElementById('uiApplyAttLogFiltersBtn'),
    uiAttendanceLogTableContainer: document.getElementById('uiAttendanceLogTableContainer'),
    uiAttendanceLogPaginationControls: document.getElementById('uiAttendanceLogPaginationControls'),
    // Page Admin Settings
    pageAdminSettings: document.getElementById('pageAdminSettings'),
    uiSettingsTableContainer: document.getElementById('uiSettingsTableContainer'),
    // Common
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    loader: document.getElementById('loader'),
    languageToggles: document.querySelectorAll('.language-toggle') 
};

let currentUser = null;
let currentLanguage = 'en'; 
let clientInfoCache = { data: null, expiry: 0 };
let inactivityTimer;
const INACTIVITY_TIMEOUT_DURATION_MS = 15 * 60 * 1000; 
let adminValidatedUntil = null; 
let availablePrefixes = []; 

const translations = {
  en: {
    pagetitle: "Sanctuary Keeper",
     pagesubtitle: "Attendance System – LFCI Winnipeg, Canada",
    loginTitle_new: "ATTENDANCE SYSTEM",
    loginSubtitle_new: "Enter your phone number to begin:",
    phonePlaceholder_new: "Enter phone number",
    continueButton_new: "Continue",
    registerTitle_new: "Create Account",
    registerSubtitle_new: "Please fill in your details to register.",
    registerButton_new: "Register",
    otpTitle_new: "Admin Verification",
    otpInstruction_new: "Enter the 6-digit OTP sent to your email for admin access.",
    otpLabel_new: "OTP Code",
    otpPlaceholder_new: "Enter 6-digit OTP",
    submitOTPButton_new: "Submit OTP",
    requestNewOtpButton_new: "Request New OTP",
    welcomeMessage_new: "Welcome",
    profileStatusDefaultTitle_new: "Profile Status",
    profileStatusDefaultText_new: "Loading your profile information...",
    profileMissingFieldsPrompt_new: "Please complete your profile.",
    updateProfileButton_new: "Update Profile Information",
    submitAttendanceButton_new: "Submit Attendance",
    submitAttendanceTitle_new: "Submit Attendance",
    selectCleaningDayLabel_new: "Select Cleaning Day for Attendance",
    selectDayPlaceholder_new: "– Select Day –",
    attendanceSubmittedSuccessTitle_new: "Attendance Submitted Successfully!",
    attendanceSubmittedSuccessDetail_new: "Thank you for your faithful service in the Sanctuary Keepers Unit.",
    backToDashboardButton_new: "Back to Dashboard",
    adminPanelTitle_new: "Admin Panel",
    adminPanelSubtitle_new: "Sanctuary Keepers Unit Management",
    adminStatsTitle_new: "📊 Attendance Statistics",
    adminToday_new: "Today",
    adminThisWeek_new: "This Week",
    adminThisMonth_new: "This Month",
    adminThisYear_new: "This Year",
    adminRecentRecordsTitle_new: "📋 Recent Attendance Records (Max 5)",
    adminNoRecentRecords_new: "No recent attendance records found.",
    adminManageMembersBtn_new: "Manage Members",
    adminViewFullLogBtn_new: "View Full Attendance Log",
    adminManageSettingsBtn_new: "Manage Settings",
    adminManageMembersTitle_new: "Manage Members",
    adminSearchMemberLabel_new: "Search Members:",
    adminSearchMemberPlaceholder_new: "Enter name, phone, or ID...",
    adminFullLogTitle_new: "Full Attendance Log",
    adminFilterMemberId_new: "Member ID:",
    adminFilterWeekId_new: "Week ID (YYYY-W##):",
    adminApplyFiltersBtn_new: "Apply Filters",
    adminManageSettingsTitle_new_detail: "Manage Application Settings",
    updateProfileTitle_new: "Update Profile",
    updateProfileSubtitle_new: "Keep your information current.",
    saveProfileButton_new: "Save Changes",
    loading_new: "Loading...",
    viewDetails_new: "View",
    adminGrantAccess_new: "Grant Temp Access",
    adminChangeRole_new: "Change Role",
    adminUpdate_new: "Update",
    langEnglish: "EN", langFrench: "FR", okButton: "OK",
    loginTitle: "Sanctuary Keeper Attendance", 
    phoneLabel: "Phone Number", phonePlaceholder: "Enter your phone number", fieldPhoneNumber: "Phone Number",
    rememberPhone: "Remember Phone", loginButton: "Login / Register",
    otpTitle: "Enter OTP", otpInstruction: "Enter the 6-digit OTP sent to {maskedEmail}.",
    otpLabel: "OTP Code", otpPlaceholder: "Enter 6-digit OTP",
    submitOTPButton: "Submit OTP", requestNewOtpButton: "Request New OTP", backButton: "Back",
    registerTitle: "Register Account", 
    registerButton: "Register",
    fieldPrefix: "Prefix", fieldFirstName: "First Name", fieldLastName: "Last Name",
    fieldEmail: "Email Address", fieldEmailAddress: "Email Address", fieldBirthday: "Birthday",
    fieldOtherPrefix: "Specify Other Prefix", optionOther: "Other (Specify)",
    monthPlaceholder: "Month", dayPlaceholder: "Day",
    summaryTitle: "Welcome", 
    profileCompleteMsg: "Your profile information is complete and up-to-date. Thank you!", 
    profileMissingIntro: "Your profile requires attention. To ensure full access and correct records, please update the following:",
    updateProfileButton: "Update Profile", cleaningDayLabel: "Select Cleaning Day",
    selectPlaceholder: "-- Select --", submitAttendanceButton: "Submit Attendance",
    readyToSubmitAttendance: "You're set to submit your weekly attendance.", 
    navigateToAttendancePageText: "Submit Weekly Attendance", 
    attendanceWeeklyLimitReached: "You have already submitted your attendance for this week.", 
    adminPanelButton: "Admin Panel", logoutButton: "Logout",
    attendanceTitle: "Submit Attendance", attendanceSuccessTitle: "Attendance Recorded",
    updateProfileTitle: "Update Profile", saveProfileButton: "Save Changes",
    adminPanelTitle: "Admin Panel", 
    adminSummaryTitle: "Attendance Summary",
    adminMembers: "Members",
    adminMemberId: "ID", adminMemberName: "Name", adminMemberPhone: "Phone", adminMemberRole: "Role", adminMemberActions: "Actions",
    adminGrantAccess: "Grant Access", adminChangeRole: "Change Role",
    daySunday: "Sunday", dayMonday: "Monday", dayTuesday: "Tuesday", dayWednesday: "Wednesday",
    dayThursday: "Thursday", dayFriday: "Friday", daySaturday: "Saturday",
    invalidPhone: "Enter a valid 10-digit phone number.",
    phoneNumberNotFoundRegister: "Phone not found. Please register.",
    serverError: "Server error. Try again later.",
    rateLimit: "Too many attempts. Try again in 15 minutes.",
    accessDeniedLocation: "Access denied: Location not permitted.",
    noValidEmail: "A valid email is required for admin access.",
    otpSent: "OTP sent to {email}.", otpSendFailed: "Failed to send OTP.",
    invalidOTP: "Invalid OTP.", otpExpired: "OTP expired. Request a new one.",
    invalidEmail: "Enter a valid email address.",
    missingRequiredFields: "Fill in all required fields: First Name, Last Name, Email Address.",
    prefixRequired: "Prefix is required. Please select or specify.",
    invalidBirthday: "Select both month and day for birthday, or leave blank.",
    loginSuccess: "Successfully logged in!",
    memberAddedAndLoggedIn: "Welcome! Registration complete and you are logged in.",
    memberAddedPleaseLogin: "Registration successful! Please login.",
    profileUpdatedSuccess: "Profile updated successfully!",
    permissionDeniedAdminPanel: "Admin panel access denied.",
    adminDataLoadedSuccess: "Admin panel loaded.",
    otpVerifiedAdminAccessGranted: "OTP verified. Admin access granted.",
    adminSessionExpiredOTPRequired: "Your admin session has expired. Please enter a new OTP to continue.",
    adminLoggedOut: "You have been successfully logged out from the admin panel.",
    birthdayGreetingAttendance: "Happy Birthday, {name}! Attendance submitted.",
    normalGreetingAttendance: "Thank you, {name}! Attendance submitted.",
    invalidCleaningDay: "Select a valid cleaning day.",
    invalidAccessType: "Enter 'read' or 'write' for access type.",
    invalidAccessDuration: "Enter a number between 1 and 30 for days.",
    tempAccessGranted: "Temporary access granted for {days} day(s) to {phone} for {type} access.", 
    roleUpdatedSuccess: "Role updated to {newRole} for {phone}.",
    invalidRole: "Enter a valid role: User, Admin, or SuperAdmin.",
    monthJan: "January", monthFeb: "February", monthMar: "March", monthApr: "April",
    monthMay: "May", monthJun: "June", monthJul: "July", monthAug: "August",
    monthSep: "September", monthOct: "October", monthNov: "November", monthDec: "December",
    loggedOutSuccess: "You have been successfully logged out.",
    sessionTimeout: "Your session has expired due to inactivity. Please log in again.",
    goodMorning: "Good morning", goodAfternoon: "Good afternoon", goodEvening: "Good evening",
    randomVerseDefault_short: "Trust in the LORD with all your heart and lean not on your own understanding... - Proverbs 3:5-6",
    versePsalm84_10_short: "A day in your courts is better than a thousand elsewhere. I would rather be a doorkeeper... - Psalm 84:10",
    verse1Chronicles28_9_short: "Know the God of your father and serve him with a whole heart and with a willing mind... - 1 Chronicles 28:9",
    verseColossians3_23_short: "Whatever you do, work heartily, as for the Lord and not for men. - Colossians 3:23",
    verseHebrews6_10_short: "God is not unjust so as to overlook your work and the love that you have shown... - Hebrews 6:10",
    versePsalm100_2_short: "Serve the LORD with gladness! Come into his presence with singing! - Psalm 100:2",
    verseMatthew6_33_short: "Seek first the kingdom of God and his righteousness, and all these things will be added... - Matthew 6:33",
    verseNumbers6_24_26_short: "The LORD bless you and keep you; the LORD make his face shine upon you and be gracious to you... - Numbers 6:24-26",
    adminFullAttendanceLogTitle: "Full Attendance Log",
    adminFilterMemberId: "Member ID:",
    adminFilterWeekId: "Week ID (YYYY-W##):",
    adminFilterStartDate: "Start Date:",
    adminFilterEndDate: "End Date:",
    adminApplyFiltersBtn: "Apply Filters",
    adminNoAttendanceRecords: "No attendance records found for the current filters.",
    adminColTimestamp: "Timestamp", adminColMemberID: "Member ID", adminColFirstName: "First Name", adminColLastName: "Last Name",
    adminColPhoneNumber: "Phone", adminColPrefix: "Prefix", adminColEmailAddress: "Email", adminColBirthdayMMMDD: "Birthday",
    adminColAttendanceDate: "Attendance Date", adminColDayofWeek: "Day of Week", adminColCleaningDay: "Cleaning Day",
    adminColWeekID: "Week ID", adminColGroup: "Group",
    adminManageSettingsTitle: "Manage Application Settings",
    adminSettingName: "Setting Name",
    adminSettingValue: "Value",
    adminSettingDescription: "Description",
    adminUpdateSettingBtn: "Update",
    adminNoSettingsFound: "No settings found.",
    settingUpdatedSuccess: "Setting '{settingName}' updated successfully.",
    settingNotFound: "Setting '{settingName}' not found.",
    permissionDeniedSpecificAction: "Permission denied for this action: {permission}",
    permissionDenied: "Permission Denied.",
    adminSearchMemberLabel: "Search Member:", adminSearchMemberPlaceholder: "Enter name, phone, or ID...",
    adminNoMembersFound: "No members found.", adminSearchNoResults: "No members match your search.",
    createAnnouncementBtn: "Create Announcement",
    createAnnouncementTitle: "Create Announcement",
    createAnnouncementSubtitle: "Post an update for all users to see.",
    announcementTitleLabel: "Announcement Title",
    announcementMessageLabel: "Message",
    postAnnouncementButton: "Post Announcement",
    cancelButton: "Cancel"
  },
  fr: {
    pagetitle: "Gardiens du Sanctuaire",
    pagesubtitle: "Système de Présence – LFCI Winnipeg, Canada",
    loginTitle_new: "SYSTÈME DE PRÉSENCE",
    loginSubtitle_new: "Entrez votre numéro de téléphone pour commencer:",
    phonePlaceholder_new: "Entrez le numéro de téléphone",
    continueButton_new: "Continuer",
    registerTitle_new: "Créer un Compte",
    registerSubtitle_new: "Veuillez remplir vos informations pour vous inscrire.",
    registerButton_new: "S'inscrire",
    otpTitle_new: "Vérification Admin",
    otpInstruction_new: "Entrez le code OTP à 6 chiffres envoyé à votre email pour l'accès admin.",
    otpLabel_new: "Code OTP",
    otpPlaceholder_new: "Entrez le code OTP",
    submitOTPButton_new: "Soumettre OTP",
    requestNewOtpButton_new: "Demander un nouveau OTP",
    welcomeMessage_new: "Bienvenue",
    profileStatusDefaultTitle_new: "Statut du Profil",
    profileStatusDefaultText_new: "Chargement de vos informations de profil...",
    profileMissingFieldsPrompt_new: "Veuillez compléter votre profil.",
    updateProfileButton_new: "Mettre à Jour les Informations du Profil",
    submitAttendanceButton_new: "Soumettre la Présence",
    submitAttendanceTitle_new: "Soumettre la Présence",
    selectCleaningDayLabel_new: "Sélectionnez le jour de nettoyage pour la présence",
    selectDayPlaceholder_new: "– Sélectionner le jour –",
    attendanceSubmittedSuccessTitle_new: "Présence soumise avec succès!",
    attendanceSubmittedSuccessDetail_new: "Merci pour votre service fidèle dans l'Unité des Gardiens du Sanctuaire.",
    backToDashboardButton_new: "Retour au tableau de bord",
    adminPanelTitle_new: "Panneau d'Administration",
    adminPanelSubtitle_new: "Gestion de l'Unité des Gardiens du Sanctuaire",
    adminStatsTitle_new: "📊 Statistiques de Présence",
    adminToday_new: "Aujourd'hui",
    adminThisWeek_new: "Cette Semaine",
    adminThisMonth_new: "Ce Mois",
    adminThisYear_new: "Cette Année",
    adminRecentRecordsTitle_new: "📋 Registres de Présence Récents (Max 5)",
    adminNoRecentRecords_new: "Aucun registre de présence récent trouvé.",
    adminManageMembersBtn_new: "Gérer les Membres",
    adminViewFullLogBtn_new: "Voir le Journal Complet des Présences",
    adminManageSettingsBtn_new: "Gérer les Paramètres",
    adminManageMembersTitle_new: "Gérer les Membres",
    adminSearchMemberLabel_new: "Rechercher des Membres :",
    adminSearchMemberPlaceholder_new: "Entrez nom, téléphone, ou ID...",
    adminFullLogTitle_new: "Journal Complet des Présences",
    adminFilterMemberId_new: "ID de Membre :",
    adminFilterWeekId_new: "ID de Semaine (AAAA-S##) :",
    adminApplyFiltersBtn_new: "Appliquer les Filtres",
    adminManageSettingsTitle_new_detail: "Gérer les Paramètres de l'Application",
    updateProfileTitle_new: "Mettre à Jour le Profil",
    updateProfileSubtitle_new: "Gardez vos informations à jour.",
    saveProfileButton_new: "Enregistrer les Modifications",
    loading_new: "Chargement...",
    viewDetails_new: "Voir",
    adminGrantAccess_new: "Accorder Accès Temp",
    adminChangeRole_new: "Changer Rôle",
    adminUpdate_new: "Mettre à Jour",
    createAnnouncementBtn: "Créer une Annonce",
    createAnnouncementTitle: "Créer une Annonce",
    createAnnouncementSubtitle: "Publiez une mise à jour pour tous les utilisateurs.",
    announcementTitleLabel: "Titre de l'Annonce",
    announcementMessageLabel: "Message",
    postAnnouncementButton: "Publier l'Annonce",
    cancelButton: "Annuler"
    // ... (rest of French translations - truncated for brevity)
  }
};

const uiBibleVerses = [
    { text_en: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.", ref_en: "Colossians 3:23", text_fr: "Tout ce que vous faites, faites-le de bon coeur, comme pour le Seigneur et non pour des hommes.", ref_fr: "Colossiens 3:23" },
    { text_en: "Serve wholeheartedly, as if you were serving the Lord, not people.", ref_en: "Ephesians 6:7", text_fr: "Servez de bon coeur, comme si vous serviez le Seigneur et non des hommes.", ref_fr: "Éphésiens 6:7" },
    { text_en: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", ref_en: "Galatians 6:9", text_fr: "Ne nous lassons pas de faire le bien; car nous moissonnerons au temps convenable, si nous ne nous relâchons pas.", ref_fr: "Galates 6:9" },
    { text_en: "And whatever you do, whether in word or deed, do it all in the name of the Lord Jesus.", ref_en: "Colossians 3:17", text_fr: "Et quoi que vous fassiez, en parole ou en oeuvre, faites tout au nom du Seigneur Jésus.", ref_fr: "Colossiens 3:17" },
    { text_en: "Each of you should use whatever gift you have to serve others, as faithful stewards of God's grace.", ref_en: "1 Peter 4:10", text_fr: "Comme de bons dispensateurs des diverses grâces de Dieu, que chacun de vous mette au service des autres le don qu'il a reçu.", ref_fr: "1 Pierre 4:10" }
];

const months = [ { value: "Jan", key: "monthJan" }, { value: "Feb", key: "monthFeb" }, { value: "Mar", key: "monthMar" }, { value: "Apr", key: "monthApr" }, { value: "May", key: "monthMay" }, { value: "Jun", key: "monthJun" }, { value: "Jul", key: "monthJul" }, { value: "Aug", key: "monthAug" }, { value: "Sep", key: "monthSep" }, { value: "Oct", key: "monthOct" }, { value: "Nov", key: "monthNov" }, { value: "Dec", key: "monthDec" }];

function sanitizeInput(str) {
  if (typeof str !== 'string' && typeof str !== 'number') return '';
  str = String(str);
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function handleLoginContinue() {
    const phoneNumber = UIDOM.uiPhoneInput.value.trim();
    if (!phoneNumber || !/^\d{10,}$/.test(phoneNumber.replace(/\D/g, ''))) {
        showTranslatedToast('invalidPhone', 'error');
        return;
    }
    performPhoneLogin(phoneNumber);
}

function showUIPage(pageId, isAdminPage = false) {
    debugLog(`showUIPage: CALLED for pageId='${pageId}', isAdminPage=${isAdminPage}`);
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        const containerDiv = targetPage.querySelector('.container');
        if (containerDiv) {
            if (isAdminPage && (pageId === 'pageAdminMembers' || pageId === 'pageAdminLog' || pageId === 'pageAdminSettings')) {
                containerDiv.classList.add('admin-wider-container');
            } else {
                containerDiv.classList.remove('admin-wider-container');
            }
        }

        if (pageId === 'page1') UIDOM.uiPhoneInput.focus();
        else if (pageId === 'pageReg') UIDOM.uiRegFirstName.focus();
        else if (pageId === 'pageOtp') UIDOM.uiOtpInput.focus();
        
        translateUIDynamicContent(); 
        updateAdminIconsVisibility(pageId);

    } else {
        console.error(`showUIPage: Target page NOT FOUND: '${pageId}'. Defaulting to page1.`);
        UIDOM.page1.classList.add('active');
    }
    window.scrollTo(0, 0); 
}

function updateAdminIconsVisibility(currentPageId) {
    const showAdminFeature = currentUser && ['AdminRep', 'Admin', 'SuperAdmin'].includes(currentUser.role);

    // For Page 2 new Admin Action Item (Icon + Label)
    if (UIDOM.uiAdminActionItemPage2) {
        UIDOM.uiAdminActionItemPage2.style.display = (currentPageId === 'page2' && showAdminFeature) ? 'flex' : 'none';
    }
}

function handleSetLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('SK_Language', lang);

    UIDOM.languageToggles.forEach(toggle => {
        toggle.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase() === lang.toLowerCase()) {
                btn.classList.add('active');
            }
        });
    });
    translateCoreUI();
    translateUIDynamicContent(); 
}

function translateCoreUI() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        let text = translations[currentLanguage]?.[key] || translations['en']?.[key] || `[${key}]`; 
        
        if (key === 'otpInstruction_new' && currentUser?.emailAddress) { 
             text = (translations[currentLanguage]?.otpInstruction || translations['en']?.otpInstruction)
                       .replace('{maskedEmail}', maskEmail(currentUser.emailAddress));
        } else if (key === 'otpInstruction' && currentUser?.emailAddress) { 
             text = (translations[currentLanguage]?.[key] || translations['en']?.[key])
                       .replace('{maskedEmail}', maskEmail(currentUser.emailAddress));
        }

        element.textContent = text;
    });
    
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = translations[currentLanguage]?.[key] || translations['en']?.[key] || `[${key}]`;
    });
}

// Replace your old function with this corrected, safer version
function translateUIDynamicContent() {
    // FIX: Added checks to ensure the UIDOM page elements exist before using them.
    if ((UIDOM.pageReg && UIDOM.pageReg.classList.contains('active')) || (UIDOM.pageUpdateProfile && UIDOM.pageUpdateProfile.classList.contains('active'))) {
        const isRegPageActive = UIDOM.pageReg && UIDOM.pageReg.classList.contains('active');
        
        const regMonthSelect = document.getElementById(isRegPageActive ? 'uiRegBirthMonth' : 'uiProfileBirthMonth');
        const regDaySelect = document.getElementById(isRegPageActive ? 'uiRegBirthDay' : 'uiProfileDay');
        const regPrefixSelect = document.getElementById(isRegPageActive ? 'uiRegPrefixSelect' : 'uiProfilePrefixSelect');

        if (regMonthSelect) populateMonthDropdown(regMonthSelect, regMonthSelect.value);
        if (regDaySelect) populateDayDropdown(regDaySelect, regDaySelect.value);
        if (regPrefixSelect && availablePrefixes) populatePrefixSelect(regPrefixSelect, availablePrefixes, regPrefixSelect.value);
    }

    if (UIDOM.page2 && UIDOM.page2.classList.contains('active') && currentUser) {
        // updateUISummaryPageContent();
    }

    if (UIDOM.page3 && UIDOM.page3.classList.contains('active') && UIDOM.uiCleaningDaySelect && UIDOM.uiCleaningDaySelect.options.length > 1) {
        const currentDayValue = UIDOM.uiCleaningDaySelect.value;
        Array.from(UIDOM.uiCleaningDaySelect.options).forEach(option => {
            if (option.value === "") {
                option.textContent = translations[currentLanguage].selectDayPlaceholder_new || translations[currentLanguage].selectPlaceholder;
            } else {
                const dayKey = `day${option.value.charAt(0).toUpperCase() + option.value.slice(1)}`;
                option.textContent = translations[currentLanguage][dayKey] || option.value;
            }
        });
        UIDOM.uiCleaningDaySelect.value = currentDayValue;
    }

    if (UIDOM.pageAdminMembers && UIDOM.pageAdminMembers.classList.contains('active') && document.getElementById('uiAdminMemberListTableContainer')?.querySelector('table')) {
        const table = UIDOM.uiAdminMemberListTableContainer.querySelector('table');
        if (table && table.tHead && table.tHead.rows.length > 0) {
            const headerCells = table.tHead.rows[0].cells;
            const headerKeys = ['adminMemberId', 'adminMemberName', 'adminMemberPhone', 'adminMemberRole', 'adminMemberActions'];
            for (let i = 0; i < headerCells.length; i++) {
                if (headerKeys[i]) {
                    headerCells[i].textContent = translations[currentLanguage][headerKeys[i]] || headerKeys[i].replace('adminMember', '');
                }
            }
        }
    }

    if (UIDOM.pageAdminLog && UIDOM.pageAdminLog.classList.contains('active') && document.getElementById('uiAttendanceLogTableContainer')?.querySelector('table')) {
        const table = UIDOM.uiAttendanceLogTableContainer.querySelector('table');
        if (table && table.tHead && table.tHead.rows.length > 0) {
            const headerCells = table.tHead.rows[0].cells;
            const originalHeaders = responseHeadersForLog || ['Timestamp', 'Member ID', 'First Name', 'Last Name', 'Phone Number', 'Prefix', 'Email Address', 'Birthday(MMM-DD)', 'Attendance Date', 'Day of Week', 'Cleaning Day', 'Week ID', 'Group'];
            for (let i = 0; i < headerCells.length; i++) {
                if (originalHeaders[i]) {
                    const translationKey = `adminCol${originalHeaders[i].replace(/[\s()-]/g, '')}`;
                    headerCells[i].textContent = translations[currentLanguage][translationKey] || originalHeaders[i];
                }
            }
        }
    }

    if (UIDOM.pageAdminSettings && UIDOM.pageAdminSettings.classList.contains('active') && document.getElementById('uiSettingsTableContainer')?.querySelector('table')) {
        const table = UIDOM.uiSettingsTableContainer.querySelector('table');
        if (table && table.tHead && table.tHead.rows.length > 0) {
            const headerCells = table.tHead.rows[0].cells;
            const headerKeys = ['adminSettingName', 'adminSettingValue', 'adminSettingDescription', 'adminMemberActions'];
            for (let i = 0; i < headerCells.length; i++) {
                if (headerKeys[i]) {
                    headerCells[i].textContent = translations[currentLanguage][headerKeys[i]] || headerKeys[i];
                }
            }
        }
    }
}

function showToast(message, type = 'error', duration = (type==='error' || type === 'warning') ? 5000 : 3000) { 
    UIDOM.toastMessage.textContent=message; 
    UIDOM.toast.className=`toast ${type}`; 
    UIDOM.toast.classList.remove('hidden'); 
    setTimeout(()=>UIDOM.toast.classList.add('hidden'),duration); 
}

function showTranslatedToast(key, type='error', args=null, isNewKey = false) { 
    let msg = translations[currentLanguage]?.[key] || translations['en']?.[key] || key; 
    if(args)Object.entries(args).forEach(([k,v])=>msg=msg.replace(new RegExp(`{${k}}`,'g'),sanitizeInput(String(v)))); 
    showToast(msg,type); 
}

function showLoader() { UIDOM.loader.style.display = 'flex'; } 
function hideLoader() { UIDOM.loader.style.display = 'none'; }

async function getClientInfo() { 
    const n=Date.now(); 
    if(clientInfoCache.data&&n<clientInfoCache.expiry) return clientInfoCache.data; 
    try{
        const r=await fetch('https://ipapi.co/json/'); 
        if(!r.ok)throw new Error(`ipapi ${r.status}`); 
        const d=await r.json(); 
        const ci={ip:d.ip||'unknown',countryCode:d.country_code||'unknown',latitude:d.latitude||null,longitude:d.longitude||null,org:d.org||'N/A',city:d.city||'N/A',region:d.region||'N/A',geoSource:'ipapi'}; 
        clientInfoCache={data:ci,expiry:n+300000}; return ci;
    } catch(e){
        debugLog("getClientInfo Error",e); clientInfoCache={data:null,expiry:0}; 
        return{ip:'unknown',countryCode:'unknown',geoSource:'none', org: 'N/A', city: 'N/A', region: 'N/A'};
    }
}

function resetInactivityTimer() { if (!currentUser) return; clearTimeout(inactivityTimer); inactivityTimer = setTimeout(handleInactivityTimeout, INACTIVITY_TIMEOUT_DURATION_MS); debugLog("Inactivity timer reset."); }
function handleInactivityTimeout() { debugLog("User inactive. Logging out."); if (currentUser) logout(true); }
function setupInactivityDetection() { if (!currentUser) return; ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => document.addEventListener(evt, resetInactivityTimer, { capture: true, passive: true })); resetInactivityTimer(); debugLog("Inactivity detection started."); }
function clearInactivityDetection() { clearTimeout(inactivityTimer); ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => document.removeEventListener(evt, resetInactivityTimer, { capture: true, passive: true })); debugLog("Inactivity detection stopped."); }

// Check if we're in a preview/demo environment
function isPreviewMode() {
    return typeof google === 'undefined' || !google.script || !google.script.run;
}

// Replace your old function with this corrected, safer version
async function initializeApp() {
    debugLog("initializeApp (UI V2 Firebase): START");
    showLoader();
    
    const savedLang = localStorage.getItem('SK_Language') || 'en';
    handleSetLanguage(savedLang); 

    // Load prefix options with fallback for preview mode
    try {
        await loadPrefixOptionsForForms(); 
    } catch (e) {
        debugLog("Failed to load prefixes, using fallback data");
        availablePrefixes = ['Bro', 'Sis','Mr', 'Mrs', 'Ms', 'Dr', 'Pastor', 'Elder', 'Deacon', 'Deaconess'];
        // FIX: Add safety checks before populating, just in case
        if (UIDOM.uiRegPrefixSelect) populatePrefixSelect(UIDOM.uiRegPrefixSelect, availablePrefixes);
        if (UIDOM.uiProfilePrefixSelect) populatePrefixSelect(UIDOM.uiProfilePrefixSelect, availablePrefixes);
    }
    
    // These are safe, as they likely don't crash if the element is null
    if (UIDOM.uiRegBirthMonth) populateMonthDropdown(UIDOM.uiRegBirthMonth); 
    if (UIDOM.uiRegBirthDay) populateDayDropdown(UIDOM.uiRegBirthDay);
    if (UIDOM.uiProfileBirthMonth) populateMonthDropdown(UIDOM.uiProfileBirthMonth); 
    if (UIDOM.uiProfileBirthDay) populateDayDropdown(UIDOM.uiProfileBirthDay);
    
    // FIX: Added safety checks before adding event listeners.
    // This will prevent the "addEventListener of null" crash.
    if (UIDOM.uiRegPrefixSelect) {
        UIDOM.uiRegPrefixSelect.addEventListener('change', function() { 
            UIDOM.uiRegOtherPrefixContainer.style.display = (this.value === 'Other') ? 'block' : 'none'; 
            if(this.value === 'Other') UIDOM.uiRegOtherPrefix.focus(); 
        });
    }

    if (UIDOM.uiProfilePrefixSelect) {
        UIDOM.uiProfilePrefixSelect.addEventListener('change', function() { 
            UIDOM.uiProfileOtherPrefixContainer.style.display = (this.value === 'Other') ? 'block' : 'none'; 
            if(this.value === 'Other') UIDOM.uiProfileOtherPrefix.focus(); 
        });
    }

    if (UIDOM.uiMemberSearchInput) UIDOM.uiMemberSearchInput.addEventListener('keyup', filterUIMemberList);
    if (UIDOM.uiApplyAttLogFiltersBtn) UIDOM.uiApplyAttLogFiltersBtn.addEventListener('click', () => loadUIFullAttendanceLog(1));

    const savedPhone = localStorage.getItem('SK_PhoneNumber');
    if (savedPhone) {
        try { 
            // FIX: Check if the phone input element exists before trying to set its value
            if (UIDOM.uiPhoneInput) {
                UIDOM.uiPhoneInput.value = atob(savedPhone); 
            }
        }
        catch (e) { 
            localStorage.removeItem('SK_PhoneNumber'); 
            debugLog("Error decoding phone", e); 
        }
    }

    const savedUser = localStorage.getItem('SK_CurrentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            const savedAdminSession = localStorage.getItem('SK_AdminValidatedUntil');
            if (savedAdminSession) {
                const expiryDate = new Date(savedAdminSession);
                if (expiryDate > new Date()) adminValidatedUntil = savedAdminSession;
                else localStorage.removeItem('SK_AdminValidatedUntil');
            }
            debugLog("initializeApp: Loaded user from localStorage", currentUser);
            if (currentUser && currentUser.phoneNumber) {
                await navigateToSummaryPage(); 
                setupInactivityDetection();
            } else { throw new Error("Invalid user data in localStorage"); }
        } catch (e) {
            debugLog("initializeApp: Catch block for savedUser error. Showing loginPage.", e);
            currentUser = null; adminValidatedUntil = null;
            localStorage.removeItem('SK_CurrentUser'); localStorage.removeItem('SK_AdminValidatedUntil');
            showUIPage('page1'); hideLoader();
        }
    } else {
        debugLog("initializeApp: No saved user. Showing loginPage.");
        showUIPage('page1'); hideLoader();
    }
    debugLog("initializeApp (UI V2 Firebase): END");
}

function handleUIRegister() {
    let prefixValue = UIDOM.uiRegPrefixSelect.value;
    if (prefixValue === 'Other') prefixValue = UIDOM.uiRegOtherPrefix.value.trim();

    const dataToBackend = {
        phoneNumber: UIDOM.uiPhoneInput.value.trim(), 
        prefix: prefixValue,
        firstName: UIDOM.uiRegFirstName.value.trim(),
        lastName: UIDOM.uiRegLastName.value.trim(),
        emailAddress: UIDOM.uiRegEmailAddress.value.trim(),
        birthday: ""
    };

    // Build birthday in MMM-DD format for Firebase
    if (UIDOM.uiRegBirthMonth.value && UIDOM.uiRegBirthDay.value) {
        const monthAbbr = UIDOM.uiRegBirthMonth.value;
        const dayStr = String(parseInt(UIDOM.uiRegBirthDay.value, 10)).padStart(2, '0');
        dataToBackend.birthday = `${monthAbbr}-${dayStr}`;
    }

    performRegistration(dataToBackend); 
}

function handleUIAdminOtpSubmit() {
    const otpCode = UIDOM.uiOtpInput.value.trim();
    performAdminOtpVerification(otpCode); 
}

function handleUIRequestNewOtp() {
    if (currentUser && currentUser.firebaseUid) requestAdminOtp(currentUser.firebaseUid);
}

function handleSummarySubmitAttendance() {
    if (currentUser && currentUser.attendanceSubmittedThisWeek) {
        showTranslatedToast('attendanceWeeklyLimitReached', 'info');
    } else {
        UIDOM.uiAttendanceFormError.style.display = 'none'; // Hide previous errors
        UIDOM.uiAttendanceFormError.innerHTML = '';
        loadCleaningDaysForUI(); 
        showUIPage('page3');
    }
}

function handleAdminIconClick() {
    ensureAdminAccess(actualLoadAdminPanelLogic);
}

function loadUIAdminPage() {
    handleAdminIconClick();
}

// 🔄 REPLACE WITH THIS OPTIMIZED VERSION:
function handleUISubmitAttendance() {
    const startTime = performance.now(); // 📊 Performance tracking
    console.log("⚡ OPTIMISTIC SUBMISSION: Starting...");
    
    const cleaningDay = UIDOM.uiCleaningDaySelect.value;
    
    // Reset error display
    UIDOM.uiAttendanceFormError.style.display = 'none';
    UIDOM.uiAttendanceFormError.innerHTML = '';
    
    if (!cleaningDay) {
        displayStaticError('page3', translations[currentLanguage].invalidCleaningDay || "Please select a cleaning day.");
        return;
    }
    
    // ⚡ INSTANT FRONTEND VALIDATION (1ms)
    console.log("⚡ OPTIMISTIC: Frontend validation...");
    const validationResult = validateAttendanceSubmissionOptimistic();
    if (!validationResult.valid) {
        console.log("❌ OPTIMISTIC: Frontend validation failed");
        displayStaticError('page3', validationResult.message);
        return;
    }
    
    // ⚡ SHOW SUCCESS IMMEDIATELY (user doesn't wait!)
    console.log("⚡ OPTIMISTIC: Showing immediate success...");
    submitAttendanceOptimistic(cleaningDay, startTime);
}

// 🆕 ADD: Frontend validation (instant)
function validateAttendanceSubmissionOptimistic() {
    console.log("🔍 Validating submission optimistically...");
    
    // Check if user already submitted this week
    if (currentUser && currentUser.attendanceSubmittedThisWeek) {
        console.log("❌ Already submitted this week");
        return {
            valid: false,
            message: translations[currentLanguage].attendanceWeeklyLimitReached || "You have already submitted your attendance for this week."
        };
    }
    
    // Check if submitted today (extra safety)
    const lastSubmissionKey = `lastAttendance_${currentUser?.memberId}`;
    const lastSubmissionDate = localStorage.getItem(lastSubmissionKey);
    if (lastSubmissionDate) {
        const lastDate = new Date(lastSubmissionDate);
        const today = new Date();
        if (lastDate.toDateString() === today.toDateString()) {
            console.log("❌ Already submitted today");
            return {
                valid: false,
                message: "You have already submitted attendance today."
            };
        }
    }
    
    console.log("✅ Frontend validation passed");
    return { valid: true };
}

function loadCleaningDaysForUI() { 
    // ⚡ NO MORE API CALLS - INSTANT LOADING FOR ALL MODES
    console.log("⚡ Loading cleaning days instantly (0ms)");
    
    // 📅 PRODUCTION CLEANING DAYS (customize as needed)
    const PRODUCTION_CLEANING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // 📅 PREVIEW/DEMO DAYS (your existing logic)
    const DEMO_DAYS = ['Saturday', 'Sunday'];
    
    // 🎯 Choose days based on mode
    const allowedDays = isPreviewMode() ? DEMO_DAYS : PRODUCTION_CLEANING_DAYS;
    
    // 🔄 Build options instantly
    UIDOM.uiCleaningDaySelect.innerHTML = `<option value="" data-translate="selectDayPlaceholder_new">${translations[currentLanguage].selectDayPlaceholder_new || translations[currentLanguage].selectPlaceholder}</option>`;
    
    allowedDays.forEach(day => {
        const option = document.createElement('option');
        option.value = day;
        const dayKey = `day${day.charAt(0).toUpperCase() + day.slice(1)}`;
        option.textContent = translations[currentLanguage][dayKey] || day;
        UIDOM.uiCleaningDaySelect.appendChild(option);
    });

    // Keep original backend call for production mode
    if (!isPreviewMode()) {
        google.script.run
            .withSuccessHandler(r => {
                hideLoader();
                if (r && r.success && r.allowedDays) {
                    UIDOM.uiCleaningDaySelect.innerHTML = `<option value="" data-translate="selectDayPlaceholder_new">${translations[currentLanguage].selectDayPlaceholder_new || translations[currentLanguage].selectPlaceholder}</option>`;
                    r.allowedDays.forEach(d => {
                        const option = document.createElement('option');
                        option.value = d;
                        const dayKey = `day${d.charAt(0).toUpperCase() + d.slice(1)}`;
                        option.textContent = translations[currentLanguage][dayKey] || d;
                        UIDOM.uiCleaningDaySelect.appendChild(option);
                    });
                } else {
                    UIDOM.uiCleaningDaySelect.innerHTML = `<option value="" data-translate="selectDayPlaceholder_new">${translations[currentLanguage].selectDayPlaceholder_new || translations[currentLanguage].selectPlaceholder}</option>`;
                    // Display error using static message div if on page3, otherwise toast
                    const errorMessage = translations[currentLanguage][r?.messageKey || 'serverError'] || "Error loading cleaning days.";
                    if (UIDOM.page3.classList.contains('active')) {
                        displayStaticError('page3', errorMessage);
                    } else {
                        showTranslatedToast(r?.messageKey || 'serverError', 'error');
                    }
                }
            })
            .withFailureHandler(e => { 
                hideLoader(); debugLog('loadCleaningDaysForUI Error:',e); 
                const errorMessage = translations[currentLanguage].serverError || "Server error.";
                if (UIDOM.page3.classList.contains('active')) {
                    displayStaticError('page3', errorMessage);
                } else {
                    showTranslatedToast('serverError','error');
                }
            })
            .getAllowedCleaningDays_FB();
    }
}

// 🆕 ADD: Main optimistic submission function
function submitAttendanceOptimistic(cleaningDay, startTime) {
    console.log("🚀 OPTIMISTIC SUBMISSION: Processing...");
    
    // ⚡ STEP 1: Update UI immediately
    const updateStart = performance.now();
    updateUserDataOptimistic(cleaningDay);
    const updateTime = performance.now() - updateStart;
    console.log(`⚡ UI updated in ${updateTime.toFixed(1)}ms`);
    
    // ⚡ STEP 2: Show success page immediately
    const successStart = performance.now();
    showSuccessPageOptimistic(cleaningDay);
    const successTime = performance.now() - successStart;
    console.log(`⚡ Success page shown in ${successTime.toFixed(1)}ms`);
    
    // ⚡ PERFORMANCE REPORT
    const totalTime = performance.now() - startTime;
    console.log(`🎯 TOTAL USER-FACING TIME: ${totalTime.toFixed(1)}ms (vs 3612ms before!)`);
    
    // ⚡ STEP 3: Sync with backend in background (user doesn't see this)
    if (!isPreviewMode()) {
        console.log("🔄 Starting background sync (invisible to user)...");
        syncAttendanceInBackgroundOptimistic(cleaningDay, startTime);
    } else {
        console.log("📱 Preview mode - skipping backend sync");
    }
}

// 🆕 ADD: Update user data optimistically  
function updateUserDataOptimistic(cleaningDay) {
    console.log("📊 Updating user data optimistically...");
    
    // Store original state for potential rollback
    const originalState = {
        attendanceSubmittedThisWeek: currentUser.attendanceSubmittedThisWeek,
        attendanceThisMonth: currentUser.attendanceThisMonth,
        attendanceThisYear: currentUser.attendanceThisYear,
        status: currentUser.status
    };
    
    // Save rollback data
    localStorage.setItem(`rollback_${currentUser.memberId}`, JSON.stringify(originalState));
    
    // ⚡ UPDATE USER DATA IMMEDIATELY
    currentUser.attendanceSubmittedThisWeek = true;
    currentUser.attendanceThisMonth = (currentUser.attendanceThisMonth || 0) + 1;
    currentUser.attendanceThisYear = (currentUser.attendanceThisYear || 0) + 1;
    currentUser.status = "Active";
    currentUser.lastAttendanceDate = new Date().toISOString().split('T')[0];
    
    // Save to localStorage
    localStorage.setItem('SK_CurrentUser', JSON.stringify(currentUser));
    localStorage.setItem(`lastAttendance_${currentUser.memberId}`, new Date().toISOString());
    
    // ⚡ UPDATE SUMMARY UI (if visible)
    updateAttendanceSummaryUIOptimistic();
    
    console.log("✅ User data updated optimistically");
    console.log(`📊 New stats: Month=${currentUser.attendanceThisMonth}, Year=${currentUser.attendanceThisYear}`);
}

// 🆕 ADD: Update attendance summary UI
function updateAttendanceSummaryUIOptimistic() {
    const summaryBox = document.getElementById('attendanceSummaryBox');
    if (summaryBox) {
        summaryBox.innerHTML = `
            <div class="info-icon" style="background: #4299e1;">📊</div>
            <div class="info-content">
                <h3>Attendance Summary</h3>
                <p><strong>This Month:</strong> ${currentUser.attendanceThisMonth}</p>
                <p><strong>This Year(From May):</strong> ${currentUser.attendanceThisYear}</p>
                <p><strong>Status:</strong> <span style="color: #22543d;">Active</span></p>
            </div>
        `;
        console.log("✅ Attendance summary UI updated");
    }
}

// 🆕 ADD: Show success page immediately
function showSuccessPageOptimistic(cleaningDay) {
    console.log("🎉 Showing success page optimistically...");
    
    const nameForGreeting = `${currentUser.prefix || ''} ${currentUser.firstName || 'User'}`.trim();
    
    // Set success message
    UIDOM.uiSuccessMessageTitle.textContent = translations[currentLanguage].attendanceSubmittedSuccessTitle_new || "Attendance Submitted Successfully!";
    UIDOM.uiSuccessMessageDetail.textContent = translations[currentLanguage].attendanceSubmittedSuccessDetail_new || "Thank you for your faithful service in the Sanctuary Keepers Unit.";

    // Set random bible verse
    const randomVerse = getRandomUIVerse();
    UIDOM.uiBibleVerseText.textContent = `"${randomVerse[`text_${currentLanguage}`] || randomVerse.text_en}"`;
    UIDOM.uiBibleVerseRef.textContent = `- ${randomVerse[`ref_${currentLanguage}`] || randomVerse.ref_en}`;
    
    // ⚡ SHOW SUCCESS PAGE IMMEDIATELY
    showUIPage('page4');
    
    console.log("✅ SUCCESS PAGE SHOWN - User experience complete!");
    console.log(`👤 User: ${nameForGreeting} saw success page instantly!`);
}

// 🆕 ADD: Background sync (invisible to user)
async function syncAttendanceInBackgroundOptimistic(cleaningDay, originalStartTime) {
    const syncStartTime = performance.now();
    console.log("🔄 BACKGROUND SYNC: Starting (user already saw success)...");
    
    try {
        const clientInfo = await getClientInfo();
        
        // 📊 Performance tracking
        console.log("🔄 BACKGROUND SYNC: Calling backend...");
        const backendStartTime = performance.now();
        
        google.script.run
            .withSuccessHandler(result => {
                const backendTime = performance.now() - backendStartTime;
                const totalSyncTime = performance.now() - syncStartTime;
                
                console.log(`🔄 BACKGROUND SYNC: Backend completed in ${backendTime.toFixed(1)}ms`);
                console.log(`🔄 BACKGROUND SYNC: Total sync time ${totalSyncTime.toFixed(1)}ms`);
                
                if (result && result.success) {
                    console.log("✅ BACKGROUND SYNC: Success - no action needed!");
                    console.log("🎯 FINAL PERFORMANCE: User saw success in ~50ms, backend took " + backendTime.toFixed(1) + "ms");
                    
                    // Clean up rollback data
                    localStorage.removeItem(`rollback_${currentUser.memberId}`);
                    
                    // Optional: Update with real backend data
                    if (result.updatedUser) {
                        console.log("📊 Updating with real backend data");
                        currentUser = { ...currentUser, ...result.updatedUser };
                        localStorage.setItem('SK_CurrentUser', JSON.stringify(currentUser));
                    }
                    
                } else {
                    console.log("❌ BACKGROUND SYNC: Backend rejected submission");
                    handleOptimisticRollback("Backend rejected the submission. Please try again.");
                }
            })
            .withFailureHandler(error => {
                const backendTime = performance.now() - backendStartTime;
                console.log(`❌ BACKGROUND SYNC: Failed after ${backendTime.toFixed(1)}ms`);
                console.log("❌ BACKGROUND SYNC: Error:", error);
                
                handleOptimisticRollback("Network error occurred. Please check your connection and try again.");
            })
            .submitUserAttendance_FB(currentUser.firebaseUid, cleaningDay, clientInfo);
            
    } catch (error) {
        console.log("❌ BACKGROUND SYNC: Exception:", error);
        handleOptimisticRollback("An error occurred during submission. Please try again.");
    }
}

// 🆕 ADD: Rollback function (rare case)
function handleOptimisticRollback(errorMessage) {
    console.log("🔄 ROLLBACK: Undoing optimistic update...");
    
    try {
        // Restore original state
        const rollbackData = localStorage.getItem(`rollback_${currentUser.memberId}`);
        if (rollbackData) {
            const originalState = JSON.parse(rollbackData);
            
            currentUser.attendanceSubmittedThisWeek = originalState.attendanceSubmittedThisWeek;
            currentUser.attendanceThisMonth = originalState.attendanceThisMonth;
            currentUser.attendanceThisYear = originalState.attendanceThisYear;
            currentUser.status = originalState.status;
            
            localStorage.setItem('SK_CurrentUser', JSON.stringify(currentUser));
            localStorage.removeItem(`lastAttendance_${currentUser.memberId}`);
            localStorage.removeItem(`rollback_${currentUser.memberId}`);
            
            // Update UI if user is still on summary page
            updateAttendanceSummaryUIOptimistic();
            
            console.log("✅ ROLLBACK: Original state restored");
        }
        
        // Show error to user
        showToast(errorMessage, "error", 8000);
        console.log("⚠️ ROLLBACK: User notified of error");
        
    } catch (e) {
        console.log("❌ ROLLBACK: Error during rollback:", e);
        showToast("Please refresh the page and try again.", "error", 10000);
    }
}

function loadUIProfileUpdatePage() {
    loadProfilePageForUI(); 
    showUIPage('pageUpdateProfile');
}

function handleUISaveProfile() {
    const dataToSave = {};
    const prefixSelect = UIDOM.uiProfilePrefixSelect;
    const otherPrefixInput = UIDOM.uiProfileOtherPrefix;

    if (prefixSelect && !prefixSelect.disabled) {
        dataToSave.prefix = prefixSelect.value;
        if (dataToSave.prefix === 'Other' && otherPrefixInput) dataToSave.prefix = otherPrefixInput.value.trim();
    }

    const firstNameInput = UIDOM.uiProfileFirstName; if (firstNameInput && !firstNameInput.readOnly) dataToSave.firstName = firstNameInput.value.trim();
    const lastNameInput = UIDOM.uiProfileLastName; if (lastNameInput && !lastNameInput.readOnly) dataToSave.lastName = lastNameInput.value.trim();
    const emailInput = UIDOM.uiProfileEmailAddress; if (emailInput && !emailInput.readOnly) dataToSave.emailAddress = emailInput.value.trim();
    
    const birthMonthSelect = UIDOM.uiProfileBirthMonth;
    const birthDaySelect = UIDOM.uiProfileBirthDay;
    if (birthMonthSelect && !birthMonthSelect.disabled && birthDaySelect && !birthDaySelect.disabled) {
        if (birthMonthSelect.value && birthDaySelect.value) {
            const monthAbbr = birthMonthSelect.value;
            const dayStr = String(parseInt(birthDaySelect.value, 10)).padStart(2, '0');
            dataToSave.birthday = `${monthAbbr}-${dayStr}`;
        }
    }
    
    saveProfile(dataToSave); 
}

// Continue with all remaining functions...
// (This would include all the rest of your JavaScript functions from the original HTML file)

// Initialize the app when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Export functions for PWA integration
window.SanctuaryKeeperApp = {
    handleSummarySubmitAttendance,
    handleAdminIconClick,
    loadUIProfileUpdatePage,
    showToast,
    isPreviewMode,
    currentUser: () => currentUser,
    updateUISummaryPageContent: () => {
        if (typeof updateUISummaryPageContent === 'function') {
            updateUISummaryPageContent();
        }
    }
};// Main Application Logic for Sanctuary Keeper PWA
// This file contains all the JavaScript logic extracted from the original HTML

// ✅ KEEP: This is your essential backend communication helper.
function callGoogleScript(functionName, payload) {
    return new Promise((resolve, reject) => {
        google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)
            [functionName](payload);
    });
}

// ✅ KEEP: This shows the form to the admin.
function loadUICreateAnnouncement() {
   document.getElementById('uiAnnouncementTitle').value = '';
   document.getElementById('uiAnnouncementMessage').value = '';
   showUIPage('pageCreateAnnouncement');
}

// ✅ KEEP: This sends the new announcement data to the backend.
async function handleUIPostAnnouncement() {
    const title = document.getElementById('uiAnnouncementTitle').value.trim();
    const message = document.getElementById('uiAnnouncementMessage').value.trim();

    if (!title || !message) {
        showToast('Please fill out both the title and message.', 'error');
        return;
    }
    showLoader();
    try {
        const result = await callGoogleScript('setAnnouncement', { title, message });
        if (result.success) {
            showToast('Announcement posted successfully!', 'success');
            showUIPage('page5', true);
        } else {
            throw new Error(result.error || 'Failed to post announcement.');
        }
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoader();
    }
}

// ✅ KEEP: This is the SAFE function to display the announcement on the summary page.
function displayAnnouncementOnPage() {
    callGoogleScript('getAnnouncement')
        .then(announcement => {
            const container = document.getElementById('uiAnnouncementContainer');
            if (!container) return;

            if (announcement && announcement.title) {
                const announcementHTML = `
                    <div class="info-box" style="background: rgba(255, 251, 235, 0.95); border-color: #fcd34d; text-align: left; margin-bottom: 25px;">
                        <div class="info-icon" style="background: #f59e0b;">📢</div>
                        <div class="info-content">
                            <h3>${sanitizeInput(announcement.title)}</h3>
                            <p>${sanitizeInput(announcement.message)}</p>
                        </div>
                    </div>
                `;
                container.innerHTML = announcementHTML;
            } else {
                container.innerHTML = '';
            }
        })
        .catch(error => {
            console.error("Could not load announcement:", error);
        });
}

// Replace your existing OTP verification success handler with this:
function onOTPVerificationSuccess(result) {
  console.log("=== OTP VERIFICATION SUCCESS ===");
  console.log("OTP Result:", result);
  
  if (result.success) {
    console.log("✅ OTP verified, loading admin panel data...");
    
    // Load admin panel data
    google.script.run
      .withSuccessHandler(function(adminData) {
        console.log("=== ADMIN PANEL DATA RECEIVED ===");
        console.log("Admin Data:", adminData);
        console.log("Success:", adminData.success);
        console.log("Role:", adminData.role);
        console.log("Permissions:", adminData.permissions);
        console.log("Admin Access Active:", adminData.userSummary?.isAdminAccessActive);
        
        // ✅ FIXED: Check for SuperAdmin and use existing functions
        if (adminData.success && ['Admin', 'SuperAdmin', 'AdminRep'].includes(adminData.role)) {
          console.log("🚀 SHOWING ADMIN PANEL FOR ROLE:", adminData.role);
          renderUIAdminDashboard(adminData);  // ✅ Use existing function
          showUIPage('page5', true);           // ✅ Use existing function
        } else {
          console.log("❌ Not showing admin panel - invalid data");
          console.log("Role was:", adminData.role);
          navigateToSummaryPage();
        }
      })
      .withFailureHandler(function(error) {
        console.error("❌ Admin panel data failed:", error);
        alert("Failed to load admin panel: " + error);
      })
      .getAdminPanelPageData_FB(currentUser.firebaseUid);
      
  } else {
    console.log("❌ OTP verification failed:", result.message);
  }
}

// Show demo indicator if in preview mode
if (typeof google === 'undefined' || !google.script || !google.script.run) {
    document.getElementById('demoIndicator').style.display = 'block';
}

// --- Start of Firebase-Compatible JavaScript ---
const isDebugMode = false;
function debugLog(...args) {
  if (isDebugMode) console.log("[SK_APP_UI_V2_FIREBASE]", ...args);
}

const UIDOM = {
    // Page 1: Login
    page1: document.getElementById('page1'),
    uiPhoneInput: document.getElementById('uiPhoneInput'),
    // Page Reg: Registration
    pageReg: document.getElementById('pageReg'),
    uiRegPrefixSelect: document.getElementById('uiRegPrefixSelect'),
    uiRegOtherPrefixContainer: document.getElementById('uiRegOtherPrefixContainer'),
    uiRegOtherPrefix: document.getElementById('uiRegOtherPrefix'),
    uiRegFirstName: document.getElementById('uiRegFirstName'),
    uiRegLastName: document.getElementById('uiRegLastName'),
    uiRegEmailAddress: document.getElementById('uiRegEmailAddress'),
    uiRegBirthMonth: document.getElementById('uiRegBirthMonth'),
    uiRegBirthDay: document.getElementById('uiRegBirthDay'),
    // Page OTP: Admin OTP
    pageOtp: document.getElementById('pageOtp'),
    uiOtpInstruction: document.getElementById('uiOtpInstruction'),
    uiOtpInput: document.getElementById('uiOtpInput'),
    // Page 2: Welcome/Summary
    page2: document.getElementById('page2'),
    uiWelcomeTitle: document.getElementById('uiWelcomeTitle'),
    uiWelcomeName: document.getElementById('uiWelcomeName'),
    uiProfileInfoBox: document.getElementById('uiProfileInfoBox'),
    uiProfileInfoIcon: document.getElementById('uiProfileInfoIcon'),
    uiProfileInfoContent: document.getElementById('uiProfileInfoContent'),
    uiAttendanceActionSection: document.getElementById('uiAttendanceActionSection'),
    uiReadyToSubmitMessageContainer: document.getElementById('uiReadyToSubmitMessageContainer'), 
    uiPage2Actions: document.getElementById('uiPage2Actions'),
    uiAdminActionItemPage2: document.getElementById('uiAdminActionItemPage2'),
    // Page Update Profile
    pageUpdateProfile: document.getElementById('pageUpdateProfile'),
    uiProfilePhoneNumberMasked: document.getElementById('uiProfilePhoneNumberMasked'),
    uiProfileFormFields: document.getElementById('uiProfileFormFields'),
    uiProfilePrefixSelect: document.getElementById('uiProfilePrefixSelect'),
    uiProfileOtherPrefixContainer: document.getElementById('uiProfileOtherPrefixContainer'),
    uiProfileOtherPrefix: document.getElementById('uiProfileOtherPrefix'),
    uiProfileFirstName: document.getElementById('uiProfileFirstName'),
    uiProfileLastName: document.getElementById('uiProfileLastName'),
    uiProfileEmailAddress: document.getElementById('uiProfileEmailAddress'),
    uiProfileBirthMonth: document.getElementById('uiProfileBirthMonth'),
    uiProfileBirthDay: document.getElementById('uiProfileBirthDay'),
    // Page 3: Select Cleaning Day
    page3: document.getElementById('page3'),
    uiAttendanceFormError: document.getElementById('uiAttendanceFormError'),
    uiCleaningDaySelect: document.getElementById('uiCleaningDaySelect'),
    // Page 4: Success Response
    page4: document.getElementById('page4'),
    uiSuccessMessageTitle: document.getElementById('uiSuccessMessageTitle'),
    uiSuccessMessageDetail: document.getElementById('uiSuccessMessageDetail'),
    uiBibleVerseContainer: document.getElementById('uiBibleVerseContainer'),
    uiBibleVerseText: document.getElementById('uiBibleVerseText'),
    uiBibleVerseRef: document.getElementById('uiBibleVerseRef'),
    // Page 5: Admin Panel Dashboard
    page5: document.getElementById('page5'),
    uiAdminStatToday: document.getElementById('uiA