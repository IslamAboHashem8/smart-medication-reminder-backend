const path = require('path');
const { readCSV } = require('./csvService');

async function matchMedicines(texts) {

    const medicines = await readCSV(
        path.join(__dirname, '../data/medicines_full.csv')
    );

    const found = [];

    texts.forEach(text => {

        const cleanText = text
           .toLowerCase()
           .replace(/_/g, ' ')
           .trim();

        const match = medicines.find(item => {

            const drugName =
                item.drug_name
                    .toLowerCase()
                    .replace(/\s+/g, ' ')
                    .trim();   

            return (
                drugName.includes(cleanText) ||
                cleanText.includes(drugName)
            );

        });

        if (match) {
            found.push(match);
        }

    });

    return found;
}

module.exports = { matchMedicines };