import { db } from './config';

export const saveUser = (data) => {
    let userRef = db.ref('/users/'+data.id);
    delete data.id
    userRef.set({ ...data });
}

export const saveGroup = (data) => {
    let groupRef = db.ref('/groups/'+data.key);
    let memberRef = db.ref('/groups/'+data.key+'/members/'+data.member);
    delete data.key;
    data.member = null;
    groupRef.set({...data});
    memberRef.set({ email: data.admin });
}

export const saveEvent = (data) => {
    let eventRef = db.ref('/events/'+data.key);
    delete data.key;
    eventRef.set({...data});
}
