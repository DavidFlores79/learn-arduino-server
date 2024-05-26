// Función para obtener la fecha y hora actual en formato deseado
const getCurrentDateTime = () => {
    const now = new Date();
    const options = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
    };
    return now.toLocaleString('en-US', options);
};

module.exports = {
    getCurrentDateTime,
}