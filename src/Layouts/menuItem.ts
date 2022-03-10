import { MenuItemType } from '@paljs/ui/types';

const items: MenuItemType[] = [
  {
    title: 'Dashboard',
    icon: { name: 'home' },
    link: { href: '/dashboard' },
  },
  {
    title: 'Menu',
    group: true,
  },
  {
    title: 'User',
    icon: { name: 'people-outline' },
    children: [
      {
        title: 'Admin',
        link: { href: '/users/admin' },
      },
      {
        title: 'Polisi',
        link: { href: '/users/police' },
      },
      {
        title: 'Rumah sakit',
        link: { href: '/users/hospital' },
      },
      {
        title: 'Pengendara',
        link: { href: '/users/rider' },
      },
    ],
  },
  {
    title: 'Laporan',
    icon: { name: 'archive-outline' },
    children: [
      {
        title: 'Kemacetan',
        link: { href: '/reports/traffic-jam' },
      },
      {
        title: 'Kecelakaan',
        link: { href: '/reports/accident' },
      },
    ],
  },
  {
    title: 'Aktivitas',
    icon: { name: 'pin-outline' },
    children: [
      {
        title: 'Simulasi',
        link: { href: '/activity/simulation' },
      },
      {
        title: 'Titik',
        link: { href: '/activity/point-collection' },
      },
      {
        title: 'Rute',
        link: { href: '/activity/route-collection' },
      },
    ],
  },
];

export default items;
