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
    memberRef.set({ status: true });
}

export const saveEvent = (data) => {
    let eventRef = db.ref('/events/'+data.eventKey);
    let memberRef = db.ref('/events/'+data.eventKey+'/members/'+data.member);
    delete data.eventKey;
    data.member = null;
    eventRef.set({...data});
    memberRef.set({ status: true });
}

export const addEventToGroup = (data) => {
    let groupRef = db.ref('/groups/'+data.groupKey+'/events/'+data.eventKey);
    delete data.eventKey;
    delete data.groupKey;
    groupRef.set({...data});
}
