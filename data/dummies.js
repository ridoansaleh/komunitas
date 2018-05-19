import img1 from './images/suggestions/swim_group.jpg';
import img2 from './images/suggestions/js_group.png';
import img3 from './images/suggestions/python.jpg';
import img4 from './images/new/fishing.jpg';
import img5 from './images/new/hunting.jpg';
import img6 from './images/new/dancing.jpg';

const popular_events = [
    {
        id: 1,
        name: 'Berenang di Danau Sunter',
        date: '15 Agustus 2018',
        image: img1,
        group: 'Jakarta Berenang',
        group_image: img4
    },
    {
        id: 2,
        name: 'Optimasi ReactJs',
        date: '20 September 2018',
        image: img2,
        group: 'JakartaJS',
        group_image: img5
    },
    {
        id: 3,
        name: 'Belajar Python Terbaru',
        date: '5 Oktober 2018',
        image: img3,
        group: 'Jakarta Python',
        group_image: img6
    }
];

const new_groups = [
    {
        id: 1,
        image: img4,
        title: "Grup Memancing Jakarta",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et rutrum arcu. Praesent euismod urna vehicula convallis posuere. Aenean auctor nibh id pretium sodales.",
        total_members: 1200,
        category: 'travelling'
    },
    {
        id: 2,
        image: img5,
        title: "Grup Berburu Bareng",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et rutrum arcu. Praesent euismod urna vehicula convallis posuere. Aenean auctor nibh id pretium sodales.",
        total_members: 190,
        category: 'belajar'
    },
    {
        id: 3,
        image: img6,
        title: "Grup Ayo Menari",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et rutrum arcu. Praesent euismod urna vehicula convallis posuere. Aenean auctor nibh id pretium sodales.",
        total_members: 400,
        category: 'musik'
    }
];

const groups_category = [
    {
        id: 1,
        icon: 'ios-people',
        name: 'Belajar',
        groups: new_groups
    },
    {
        id: 2,
        icon: 'jet',
        name: 'Travelling',
        groups: new_groups
    },
    {
        id: 3,
        icon: 'basketball',
        name: 'Olahraga',
        groups: new_groups
    },
    {
        id: 4,
        icon: 'musical-notes',
        name: 'Musik',
        groups: new_groups
    },
    {
        id: 5,
        icon: 'briefcase',
        name: 'Bisnis',
        groups: new_groups
    }
];

const avatars = [
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
];

export { 
    popular_events, 
    groups_category, 
    new_groups, 
    avatars 
}
