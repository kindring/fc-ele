import {Request, Response, Router} from "express";
import keyCheck from "../middleware/keyCheck";
const router: Router = Router();
router.get('/test', keyCheck, (req: Request, res: Response) => {
    res.send(`this is a test ${req.query.name}`);
});

export default router;
