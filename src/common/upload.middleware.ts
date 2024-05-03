import { Request, Response, NextFunction } from 'express';

import { IMiddleware } from './middleware.interface';
import multer from 'multer';
import path from 'path';
import { HttpError } from '../errors/http-error.class';
import sharp from 'sharp';
import fs from 'fs';

const storage = multer.memoryStorage();

const uploadMulter = multer({ storage });

export class UploadMiddleware implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {

		// Check if the uploads directory exists, if not, create it
		const uploadsDir = path.join(__dirname, '../../', 'uploads');
		if (!fs.existsSync(uploadsDir)) {
			fs.mkdirSync(uploadsDir, { recursive: true });
		}

		const upload = uploadMulter.single('attachment');

		upload(req, res, async (err) => {
			if (err instanceof multer.MulterError) {
				// A Multer error occurred when uploading
				return next(new HttpError(400, err.message));
			} else if (err) {
				// An unknown error occurred when uploading
				return next(new HttpError(500, err.message));
			}

			// // Check if a file was uploaded
			if (req.file) {


				// Check if the uploaded file size is within the limit
				const maxSize = 102400; // 100 KB
				if (req.file.mimetype.startsWith('text/') && req.file.size > maxSize) {
					return next(new HttpError(400, 'Txt file size too large'));
				}

				// Resize the image if it's too large
				if (req.file.mimetype.startsWith('image/')) {
					const metadata = await sharp(req.file.buffer).metadata();
					if (metadata.width! > 320 || metadata.height! > 240) {
						const resizedBuffer = await sharp(req.file.buffer)
							.resize({
								width: 320,
								height: 240,
								fit: 'inside',
							})
							.toBuffer();
						req.file.buffer = resizedBuffer;
						req.file.size = resizedBuffer.length;
					}
				}


				// Generate a unique filename
				const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
				const extension = path.extname(req.file.originalname);
				const filename = `${req.file.fieldname}-${uniqueSuffix}${extension}`;
				const filePath = path.join('uploads', filename);

				// Write the buffer to the file system
				fs.writeFileSync(filePath, req.file.buffer);


				// Add to req body to validate
				const attachment = req.file
					? {
						name: req.file.originalname,
						type: req.file.mimetype,
						path: `uploads/${filename}`,
						size: req.file.size,
					}
					: undefined;

				req.body.attachment = attachment;

			}


			next();
		});
	}

}
