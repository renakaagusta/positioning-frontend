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
    title: 'Dijkstra',
    icon: { name: 'pin-outline' },
    children: [
      {
        title: 'Point',
        link: { href: '/dijkstra/point' },
      },
      {
        title: 'Rute',
        link: { href: '/dijkstra/route' },
      },
    ],
  },
];

export default items;
