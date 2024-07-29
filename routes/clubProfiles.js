
import { getClubProfile, getPlayerProfile } from './controllers/clubProfilesController.js';

const router = express.Router();

router.get('/api/clubProfiles/:id', getClubProfile);


export default router;
