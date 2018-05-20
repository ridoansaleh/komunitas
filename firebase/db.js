import { db } from './config';

export const saveUser = (data) => {
    console.log('data : ', data)
    let nameArr = data.name.split(' ')
    let name = ''
    nameArr.length > 1
      ? name = nameArr[0].toLowerCase() + nameArr[1].toLowerCase()
      : name = data.name
    return db.ref('users/' + name).set({ ...data });
}

export const countUser = () => {
    return db.ref('users/').child.length;
}