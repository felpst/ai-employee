import { Request } from "express"
import multer, { FileFilterCallback } from "multer"
import path from "path"

const fileUploader = (destinationPath: string) => {
  // Define storage configuration for multer
  const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: any) => {
      const uploadPath = path.join(__dirname, `../uploads/${destinationPath}`)

      // Create the directory if it doesn't exist
      require("fs").mkdirSync(uploadPath, { recursive: true })

      cb(null, uploadPath)
    },
    filename: (req: Request, file: Express.Multer.File, cb: any) => {
      const uniqueFileName = `${Date.now()}-${file.originalname}`
      cb(null, uniqueFileName)
    },
  })

  // Define the file filter to accept only specific file types if needed
  const acceptFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (acceptFileTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only image files are allowed."))
    }
  }

  // Create the multer instance with the storage and file filter configurations
  const upload = multer({ storage, fileFilter })

  return upload
}

export default fileUploader
