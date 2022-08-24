const convertToSlug = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').toLowerCase();

module.exports = {
    convertToSlug:convertToSlug,
}