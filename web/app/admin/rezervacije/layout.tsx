import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_token');

  if (adminToken?.value !== 'bemata_admin_secret') {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
