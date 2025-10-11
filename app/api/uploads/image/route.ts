import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "hotel-prince-diamond" }, (err, result) => {
        if (err || !result?.secure_url) return reject(err || new Error("Upload failed"))
        resolve(result.secure_url)
      })
      stream.end(buffer)
    })
console.log("Uploaded to Cloudinary:", url)
    return NextResponse.json({ url })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload error" }, { status: 500 })
  }
}
