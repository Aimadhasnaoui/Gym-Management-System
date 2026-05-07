import Membre from '../Members/Members.js';
import CheckIn from '../CheckIn/CheckIn.js';
import { cathFunction } from '../utils/CathFunction.js';
import User from '../User/User.js';

export const getDashbord = cathFunction(async (req, res, next) => {
    const membersCount = await Membre.countDocuments();
    const checkInsCount = await CheckIn.countDocuments();
    const usersCount = await User.countDocuments();
    res.status(200).json({ success: true, data: { membersCount, checkInsCount, usersCount } });
});

