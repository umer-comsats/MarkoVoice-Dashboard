const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const CustomizationModel = require('../../models/customization/Customization');
const gravatar = require('gravatar');
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
//let config
//@route    GET api/configuration
//@desc     create as well as Updtate a new configuration (get a token after registration)
//@access   public
router.post(
    '/',
    [
        auth,
        [
            check('businessName', 'business Name is required').not().isEmpty(),
            //check('scriptSequence', 'scriptSequence is required').not().isEmpty(),
        ],
    ],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            //return res.status(400).json({ errors: errors.msg });
        }

        const {
            package,
            domain,
            businessName,
            businessDescription,
            areaOfOperatingBusiness,
            businessEmail,
            phone,
            sellBuyRent,
            propertyType,
            size,
            locationCity,
            locationAddress,
            bedRooms,
            kitchen,
            garage,
            botVoice,
            scriptSequence,
        } = req.body;

        const inputFields = {};
        inputFields.user = req.user.id;
        if (package) inputFields.package = package;
        if (domain) inputFields.domain = domain;
        if (botVoice) inputFields.botVoice = botVoice;
        if (scriptSequence) {
            inputFields.scriptSequence = scriptSequence;
        }
        inputFields.businessInfo = {}; // filling buisnessINfo ...............
        if (businessName) inputFields.businessInfo.businessName = businessName;
        if (businessDescription)
            inputFields.businessInfo.businessDescription = businessDescription;
        if (areaOfOperatingBusiness)
            inputFields.businessInfo.areaOfOperatingBusiness = areaOfOperatingBusiness;
        if (businessEmail) inputFields.businessInfo.businessEmail = businessEmail;
        if (phone) inputFields.businessInfo.phone = phone;
        const newDomainInfo = {
            sellBuyRent,
            propertyType,
            size,
            locationCity,
            locationAddress,
            bedRooms,
            kitchen,
            garage,
        };
        if (sellBuyRent || propertyType || size || locationCity) {
            inputFields.domainInfo = [];
            inputFields.domainInfo.unshift(newDomainInfo);
        } // filling domainInfo ...................

        try {
            //console.log('try starts, config route');
            let customization = await CustomizationModel.findOne({
                user: req.user.id,
            });

            if (customization) {
                //update , if config exist already
                customization = await CustomizationModel.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: inputFields },
                    { new: true }
                );
                //console.log('configuration updates: ' + configuration);
                return res.json(customization);
            }
            //creare new config, if dont exit already
            customization = new CustomizationModel(inputFields);
            await customization.save();
            //console.log('New configuration Created: ' + configuration);
            return res.status(200).json(customization);
        } catch (err) {
            res
                .status(500)
                .send(
                    'server error: inside configuration route: cant save configuration: ' +
                    err.msg
                );
        }
    }
);
//@route    GET api/configurations/all
//@desc     get all configurations of all users
//@access   public
router.get('/all', async (req, res) => {
    try {
        const configurations = await CustomizationModel.find().populate('user', [
            'name',
            'email',
        ]);
        if (!configurations) {
            return res.send('no user in database');
        }

        res.send(configurations);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error: user get route: ' + error.message);
    }
});
//@route    GET api/configurations/me
//@desc     get configurations of logged in user
//@access   private
router.get('/me', auth, async (req, res) => {
    try {
        const configurations = await CustomizationModel.findOne({
            user: req.user.id,
        }).populate('user', ['name', 'email']);

        if (configurations == null) {
            console.log('inside if');
            return res.json(configurations);
        }
        // console.log('outside if');
        res.json(configurations);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error: user get route: ' + error.message);
    }
});
//@route    GET api/configurations/all
//@desc     delete configurations of particular user
//@access   public (used by admins only!)
router.delete('/:user_id', async (req, res) => {
    const uID = req.params.user_id;
    try {
        // let configuration = null;
        const configuration = await CustomizationModel.findOne({
            user: uID,
        });
        //console.log(configuration);
        if (configuration == null) {
            console.log('no configuration found for user id: ' + uID);
            return res.status(404).send('no configration found user id: ' + uID);
        }
        //delete configuration
        await CustomizationModel.deleteOne({ user: uID });
        console.log('configuration deleted successfully! user id: ' + uID);
        return res
            .status(200)
            .json('configuration deleted successfully! user id: ' + uID);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error: user get route: ' + error.message);
    }
});

//@route    PUT api/user/domainInfo
//@desc     add domainInfo to  configuration
//@access   public
router.put(
    '/domainInfo',
    [
        auth,
        [
            check('sellBuyRent', 'sellBuyRent is required').not().isEmpty(),
            check('propertyType', 'property type is required').not().isEmpty(),
            check('size', 'size is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            sellBuyRent,
            propertyType,
            size,
            locationCity,
            locationAddress,
            bedRooms,
            kitchen,
            garage,
        } = req.body;

        const newDomainInfo = {
            sellBuyRent,
            propertyType,
            size,
            locationCity,
            locationAddress,
            bedRooms,
            kitchen,
            garage,
        };

        try {
            let configuration = await CustomizationModel.findOne({
                user: req.user.id,
            });
            if (configuration == null) {
                console.log('no configuration for this user. First add config!');
                return res.json('no configuration for this user. First add config!');
            }
            configuration.domainInfo.unshift(newDomainInfo);
            await configuration.save();
            res.json(configuration);
            // console.log('DomainInfo added: \n' + configuration);

        } catch (error) {
            console.error(error.message);
            res
                .status(500)
                .send('server Error: unable to add dominaInfo: ' + error.message);
        }
    }
);
//@route    PUT api/configurations/domainInfo/:dom_id
//@desc     update domain info of user
//@access   private
router.put(
    '/domainInfo/:dom_id',
    [
        auth,
        [
            check('sellBuyRent', 'sellBuyRent is required').not().isEmpty(),
            check('propertyType', 'property type is required').not().isEmpty(),
            check('size', 'size is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            sellBuyRent,
            propertyType,
            size,
            locationCity,
            locationAddress,
            bedRooms,
            kitchen,
            garage,
        } = req.body;

        const newDomainInfo = {
            sellBuyRent,
            propertyType,
            size,
            locationCity,
            locationAddress,
            bedRooms,
            kitchen,
            garage,
        };

        try {
            // console.log('try starts, inside update domainInfo api');


            let configuration = await CustomizationModel.findOne({
                'domainInfo._id': req.params.dom_id,
            });
            if (configuration) {
                const updateIndex = configuration.domainInfo
                    .map((item) => item.id)
                    .indexOf(req.params.dom_id);

                // console.log('inside if domainInfo ')

                configuration = await CustomizationModel.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: { 'domainInfo.0': newDomainInfo } },
                    { new: true }
                );
                return res.json(configuration);
            }
            console.log('domaininfo not found! \n' + configuration);
            return res.status(404).json(configuration);

            //res.json(newDomainInfo);
        } catch (error) {
            console.error(error.message);
            res
                .status(500)
                .send('server Error: unable to update dominaInfo: ' + error.message);
        }
    }
);
// router.get('/yoga', auth, async (req, res) => {
//   try {

//     res.json('Olaa ladies');
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('server error: user get route: ' + error.message);
//   }
// });

//@route    GET api/configurations/domainInfo/me
//@desc     get all domain info of logged in user
//@access   private
router.get('/domainInfo/me', auth, async (req, res) => {
    try {
        const configurations = await CustomizationModel.findOne({
            user: req.user.id,
        }).populate('user', ['name', 'email']);

        if (configurations == null) {
            return res.json(configurations.domainInfo);
        }
        // console.log('outside if');
        res.json(configurations.domainInfo);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error: user get route: ' + error.message);
    }
});
//@route    DELETE api/configurations/domainInfo/:dom_id
//@desc     delete domain info of user from configurations
//@access   private
router.delete('/domainInfo/:dom_id', auth, async (req, res) => {
    try {
        let configuration = await CustomizationModel.findOne({
            user: req.user.id,
        });
        //get remove index
        const removeIndex = configuration.domainInfo
            .map((item) => item.id)
            .indexOf(req.params.dom_id);

        configuration.domainInfo.splice(removeIndex, 1);
        await configuration.save();
        res.json(configuration);
    } catch (error) {
        res
            .status(500)
            .send(
                'error while deleting configuration for specified user: ' +
                error.message
            );
    }
});
//@route    PUT api/configuration/package
//@desc     put package to configuration (Not in use reight now)
//@access   private
router.put(
    '/package',
    [auth, [check('package', 'packge is required').not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const package = req.body;

        try {
            let configuration = await CustomizationModel.findOne({
                user: req.user.id,
            });
            //console.log('confi: ' + configuration);
            if (configuration) {
                //update , if config exist already
                configuration = await CustomizationModel.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: package },
                    { new: true }
                );
                return res.json(configuration);
            }
            //create if config. dont exist
            configuration.package = package;
            await configuration.save();
            console.log('package added! for config: ' + configuration);
            res.json(configuration);
        } catch (error) {
            console.error(error.message);
            res
                .status(500)
                .send('server Error: unable to add package: ' + error.message);
        }
    }
);

module.exports = router;
