const today = new Date();
const day = today.getDate();
const year = today.getUTCFullYear();
const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const getTodayDate = () => {
    let month = today.getMonth();
    if (month < 10) {
        month = '0'+(month+1)
    }
    return year + '-' + (month) + '-' + day;
}

const getFullDate = () => {
    let month = monthNames[today.getMonth()];
    return day+' '+month+' '+year
}

export {
    getTodayDate,
    getFullDate
}