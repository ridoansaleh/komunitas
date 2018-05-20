import { db } from './config';

export const saveUser = (data) => {
    db.ref('users/'+'user_b').set({
        id: 'Default ID',
        name: data.name,
        email: data.email,
        address: 'Default Address',
        photo: 'Default Photo'
    });
}

export const countUser = () => {
    return db.ref('users/').child.length;
}