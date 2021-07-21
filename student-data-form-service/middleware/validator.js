import { check } from 'express-validator';

export const validationRules = [
    check('name')
        .trim()
        .exists().withMessage('required field missing')
        .isLength({min: 5}).withMessage('Field should have atleast 5 characters'),
    check('email')
        .exists().withMessage('required field missing')
        .isEmail().withMessage('invalid email address')
        .trim()
        .normalizeEmail(),
    check('university').default('N.A.'),
    check('cgpa').default('N.A.'),
    check('tech').default('N.A.'),
    check('gender')
        .exists().withMessage('required field missing')
        .isIn(['M', 'F']).withMessage('Gender should be either \'M\' or \'F\''),
    check('age').isNumeric().default('N.A.'),
    check('mobile')
        .exists().withMessage('required field missing')
        .isMobilePhone().withMessage('Please provide valid mobile phone number')
]
