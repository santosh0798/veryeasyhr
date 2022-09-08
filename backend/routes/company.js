const express = require('express');
const { updateCompany, myCompany, companyList } = require('../controllers/companyControllers');
const router = express.Router();
const {isAuthenticatedUser} = require('../middleware/auth')


router.route('/company/update').put(isAuthenticatedUser,updateCompany);
router.route('/company/mylist').get(isAuthenticatedUser,myCompany);
router.route('/company/mylist/:id').get(isAuthenticatedUser,companyList);


module.exports = router;
