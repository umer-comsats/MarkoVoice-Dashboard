//required fields: scriptSequence, businessName, user.
const mongoose = require('mongoose');
const CustomizationSchema = mongoose.Schema({
    user: {
        //Later...
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',  //(user from masha's database)
    },
    customizationTitle: {
        type: String,
    },
    domain: {
        type: String,
    },
    // business information .......................
    businessInfo: {
        businessName: {
            type: String,
        },
        businessDescription: {
            type: String,
        },
        areaOfOperatingBusiness: {
            type: String,
        },
        businessEmail: {
            type: String,
        },
        phone: {
            type: String,
        },
    },
    //Domain informtaion ................. an array of an object containing further objects

    botVoice: {
        type: String,
    },
    csvFile: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Customization = mongoose.model(
    'configurations',
    CustomizationSchema
);
