import img1 from '../static/swim_group.jpg';
import img2 from '../static/js_group.png';
import img3 from '../static/python_group.png';
import group1 from './groups/fishing.jpg';
import group2 from './groups/hunting.jpg';
import group3 from './groups/dancing.jpg';

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
        image: group1,
        title: "Grup Memancing Jakarta",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et rutrum arcu. Praesent euismod urna vehicula convallis posuere. Aenean auctor nibh id pretium sodales."
    },
    {
        id: 2,
        image: group2,
        title: "Grup Berburu Bareng",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et rutrum arcu. Praesent euismod urna vehicula convallis posuere. Aenean auctor nibh id pretium sodales."
    },
    {
        id: 3,
        image: group3,
        title: "Grup Ayou Menari",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et rutrum arcu. Praesent euismod urna vehicula convallis posuere. Aenean auctor nibh id pretium sodales."
    }
]
