import { redirect } from 'next/navigation';

// /profile was a byte-for-byte copy of Checkout Settings. Old links and
// bookmarks still work and land on the single maintained page.
export default function ProfilePage() {
  redirect('/checkout-settings');
}
