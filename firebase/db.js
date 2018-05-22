import { db } from './config';

export const saveUser = (data) => {
    let nameArr = data.name.split(' ')
    let user_id = data.id
    let name = ''
    nameArr.length > 1
      ? name = nameArr[0].toLowerCase() + nameArr[1].toLowerCase()
      : name = data.name
    delete data.id
    return db.ref('users/' + user_id).set({ ...data });
}

export const countUser = () => {
    return db.ref('users/').child.length;
}