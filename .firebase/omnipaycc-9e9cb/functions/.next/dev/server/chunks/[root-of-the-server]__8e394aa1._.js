module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/onramp-session/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs, [project]/node_modules/firebase-admin)");
;
;
// Initialize Firebase Admin if not already done
if (!__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["apps"].length) {
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["initializeApp"]({
        credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["credential"].applicationDefault()
    });
}
const db = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["firestore"]();
async function POST(request) {
    try {
        const body = await request.json();
        const { walletAddress, sourceAmount, destinationCurrency, destinationNetwork, sourceCurrency, userId } = body;
        console.log('=== ONRAMP SESSION REQUEST ===');
        console.log('Timestamp:', new Date().toISOString());
        console.log('Request body:', {
            walletAddress,
            sourceAmount,
            sourceCurrency,
            destinationCurrency,
            destinationNetwork,
            userId
        });
        // Build the request body for Stripe API
        const formData = new URLSearchParams();
        console.log('Building form data for Stripe API...');
        // Only add wallet address if provided - let user enter it in the widget
        if (walletAddress) {
            formData.append('wallet_addresses[ethereum]', walletAddress);
            console.log('✓ Added wallet address:', walletAddress);
        } else {
            console.log('ℹ No wallet address provided');
        }
        if (sourceAmount) {
            formData.append('source_amount', sourceAmount.toString());
            console.log('✓ Added source amount:', sourceAmount);
        }
        if (sourceCurrency) {
            formData.append('source_currency', sourceCurrency);
            console.log('✓ Added source currency:', sourceCurrency);
        }
        if (destinationCurrency) {
            formData.append('destination_currency', destinationCurrency);
            console.log('✓ Added destination currency:', destinationCurrency);
        }
        if (destinationNetwork) {
            formData.append('destination_network', destinationNetwork);
            console.log('✓ Added destination network:', destinationNetwork);
        }
        // Fetch and add customer information if userId provided
        if (userId) {
            console.log('📋 Fetching user profile for userId:', userId);
            try {
                const userDoc = await db.collection('users').doc(userId).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    console.log('✓ User profile found');
                    console.log('User data fields:', Object.keys(userData || {}));
                    // Add basic customer info
                    if (userData?.email) {
                        formData.append('customer_information[email]', userData.email);
                        console.log('✓ Added email:', userData.email);
                    } else {
                        console.log('ℹ No email in user profile');
                    }
                    if (userData?.first_name) {
                        formData.append('customer_information[first_name]', userData.first_name);
                        console.log('✓ Added first_name:', userData.first_name);
                    } else {
                        console.log('ℹ No first_name in user profile');
                    }
                    if (userData?.last_name) {
                        formData.append('customer_information[last_name]', userData.last_name);
                        console.log('✓ Added last_name:', userData.last_name);
                    } else {
                        console.log('ℹ No last_name in user profile');
                    }
                    // Add date of birth with age validation
                    if (userData?.dob) {
                        console.log('📅 Processing DOB:', userData.dob);
                        // Validate that all DOB fields are present
                        if (userData.dob.year && userData.dob.month && userData.dob.day) {
                            // Calculate age - Stripe requires at least 13 years old
                            const birthDate = new Date(userData.dob.year, userData.dob.month - 1, userData.dob.day);
                            const today = new Date();
                            let age = today.getFullYear() - birthDate.getFullYear();
                            const monthDiff = today.getMonth() - birthDate.getMonth();
                            if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
                                age--;
                            }
                            console.log('🎂 Calculated age:', age);
                            if (age >= 13) {
                                formData.append('customer_information[dob][year]', userData.dob.year.toString());
                                formData.append('customer_information[dob][month]', userData.dob.month.toString());
                                formData.append('customer_information[dob][day]', userData.dob.day.toString());
                                console.log('✓ Added DOB (age verified):', `${userData.dob.year}-${userData.dob.month}-${userData.dob.day}`);
                            } else {
                                console.log('⚠ User is under 13 years old - skipping DOB to avoid Stripe rejection');
                            }
                        } else {
                            console.log('⚠ Incomplete DOB data - skipping:', userData.dob);
                        }
                    } else {
                        console.log('ℹ No DOB in user profile');
                    }
                    // Add address
                    if (userData?.address) {
                        console.log('📍 Processing address:', Object.keys(userData.address));
                        if (userData.address.country) {
                            formData.append('customer_information[address][country]', userData.address.country);
                            console.log('✓ Added address.country:', userData.address.country);
                        }
                        if (userData.address.line1) {
                            formData.append('customer_information[address][line1]', userData.address.line1);
                            console.log('✓ Added address.line1:', userData.address.line1);
                        }
                        if (userData.address.line2) {
                            formData.append('customer_information[address][line2]', userData.address.line2);
                            console.log('✓ Added address.line2:', userData.address.line2);
                        }
                        if (userData.address.city) {
                            formData.append('customer_information[address][city]', userData.address.city);
                            console.log('✓ Added address.city:', userData.address.city);
                        }
                        if (userData.address.state) {
                            formData.append('customer_information[address][state]', userData.address.state);
                            console.log('✓ Added address.state:', userData.address.state);
                        }
                        if (userData.address.postal_code) {
                            formData.append('customer_information[address][postal_code]', userData.address.postal_code);
                            console.log('✓ Added address.postal_code:', userData.address.postal_code);
                        }
                    } else {
                        console.log('ℹ No address in user profile');
                    }
                } else {
                    console.log('⚠ User document not found in Firestore');
                }
            } catch (error) {
                console.error('❌ Error fetching user profile:', error.message);
                console.error('Error details:', error);
            // Continue even if profile fetch fails
            }
        } else {
            console.log('ℹ No userId provided - skipping profile lookup');
        }
        console.log('🔗 Making request to Stripe API...');
        console.log('Stripe endpoint: https://api.stripe.com/v1/crypto/onramp_sessions');
        console.log('Form data keys:', Array.from(formData.entries()).map(([k])=>k));
        // Make direct API call to Stripe
        const response = await fetch('https://api.stripe.com/v1/crypto/onramp_sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Stripe-Version': '2024-11-20.acacia'
            },
            body: formData.toString()
        });
        console.log('📡 Stripe API response status:', response.status, response.statusText);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Stripe API error response:', JSON.stringify(errorData, null, 2));
            // Provide more helpful error messages
            if (errorData.error?.type === 'invalid_request_error') {
                console.error('Invalid request error details:', errorData.error.message);
                throw new Error(`Stripe Crypto Onramp API error: ${errorData.error.message}. ` + `This might mean:\n` + `1. Crypto onramp is not enabled on your Stripe account\n` + `2. Business name and URL need to be set in Stripe Dashboard\n` + `3. Your account needs approval for crypto onramp access\n` + `Request log: ${errorData.error.request_log_url || 'N/A'}`);
            }
            throw new Error(errorData.error?.message || 'Stripe API error');
        }
        const session = await response.json();
        console.log('✅ Session created successfully!');
        console.log('Session ID:', session.id);
        console.log('Session status:', session.status);
        console.log('=== END ONRAMP SESSION REQUEST ===');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            clientSecret: session.client_secret,
            sessionId: session.id
        });
    } catch (error) {
        console.error('');
        console.error('❌ ===== ERROR IN ONRAMP SESSION ===== ❌');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        console.error('=====================================');
        console.error('');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Failed to create onramp session',
            details: 'Check server console for full error details'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8e394aa1._.js.map