import img1 from './images/suggestions/swim_group.jpg';
import img2 from './images/suggestions/js_group.png';
import img3 from './images/suggestions/python_group.png';
import img4 from './images/new/fishing.jpg';
import img5 from './images/new/hunting.jpg';
import img6 from './images/new/dancing.jpg';

export const cards = [
    {
        text: 'Jakarta Berenang',
        name: 'One',
        image: img1
    },
    {
        text: 'JakartaJS',
        name: 'Two',
        image: img2
    },
    {
        text: 'Jakarta Python',
        name: 'Three',
        image: img3
    }
];

export const groups_category = [
    {
        id: 1,
        icon: 'ios-people',
        name: 'Belajar'
    },
    {
        id: 2,
        icon: 'jet',
        name: 'Travelling'
    },
    {
        id: 3,
        icon: 'basketball',
        name: 'Olahraga'
    },
    {
        id: 4,
        icon: 'musical-notes',
        name: 'Musik'
    },
    {
        id: 5,
        icon: 'briefcase',
        name: 'Bisnis'
    }
];

export const new_groups = [
    {
        id: 1,
        image: img4,
        title: "Grup Memancing Jakarta",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et rutrum arcu. Praesent euismod urna vehicula convallis posuere. Aenean auctor nibh id pretium sodales.",
        total_members: 1200
    },
    {
        id: 2,
        image: img5,
        title: "Grup Berburu Bareng",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et rutrum arcu. Praesent euismod urna vehicula convallis posuere. Aenean auctor nibh id pretium sodales.",
        total_members: 190
    },
    {
        id: 3,
        image: img6,
        title: "Grup Ayo Menari",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et rutrum arcu. Praesent euismod urna vehicula convallis posuere. Aenean auctor nibh id pretium sodales.",
        total_members: 400
    }
]

export const avatars = [
    {
        id: 1,
        image: img1,
        actor: 'Jakarta Berenang',
        information: 'Mengumumkan meetup terbaru pada tanggal 12 Mei 20018',
        time: '12.40 WIB'
    },
    {
        id: 2,
        image: img2,
        actor: 'JakartaJS',
        information: " Merubah tanggal Meetup 'Popular JS Framework pada tahun 2018' ",
        time: '04.50 WIB'
    },
    {
        id: 3,
        image: img3,
        actor: 'Jakarta Python',
        information: 'Mengumumkan meetup terbaru pada tanggal 1 Mei 2018',
        time: '09.10 WIB'
    }
]
