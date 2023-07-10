import { Router } from 'express';
import * as controller from './controller';

const router: Router = Router();

router.post('/contract/deploy', controller.deployContract);
router.get('/contract/get/all', controller.getAllContract);
router.post('/faucet/get', controller.getFaucet);

export default router;
