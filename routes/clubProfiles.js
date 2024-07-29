
// routes/clubProfiles.js
import { getClubProfile } from '../controllers/clubProfilesController.js';

// Código do roteador


const router = express.Router();

router.get('/api/clubProfiles/:id', getClubProfile);


export default router;
