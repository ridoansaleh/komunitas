import { db } from './config';

export const saveUser = (data) => {
    let user_id = data.id;
    delete data.id
    return db.ref('users/' + user_id).set({ ...data });
}

export const countUser = () => {
    return db.ref('users/').child.length;
}