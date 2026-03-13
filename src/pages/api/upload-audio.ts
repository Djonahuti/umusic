import type { NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"
import fs from "fs"
import path from "path"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const uploadDir = path.join(process.cwd(), "public", "audio")
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const form = formidable({ uploadDir, keepExtensions: true })

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "Upload failed" })
      return
    }
    const fileData = files.file
    const file = Array.isArray(fileData) ? fileData[0] : fileData
    if (!file) {
      res.status(400).json({ error: "No file uploaded" })
      return
    }
    const fileName = path.basename(file.filepath)
    res.status(200).json({ fileName })
  })
}