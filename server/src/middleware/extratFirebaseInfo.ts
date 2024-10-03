import logging from '../config/logging'
import firebaseAdmin from 'firebase-admin'
import { Request, Response, NextFunction } from 'express'

const extractFirebaseInfos = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Validating firebase token')

    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

    firebaseAdmin.auth().verifyIdToken(token)
        .then(result => {
            if (result && result.uid) {
                res.locals.firebase = result
                next()
            } else {
                logging.warn('Token invalid');
                return res.status(401).json({ message: 'Unauthorized' })
            }
        })
        .catch(error => {
            logging.error(error)
            return res.status(401).json({
                error,
                message: 'Unauthorized'
            });
        });
};

export default extractFirebaseInfos
