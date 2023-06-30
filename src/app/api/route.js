
import nodemailer from 'nodemailer';


export async function POST(request, res) {
  const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.YANDEX_USERNAME,
      pass: process.env.YANDEX_PASSWORD,
    }
  });
  const data = await request.json()

  console.log(res);

  try {
    await transporter.sendMail({
      from: 'yura22875@yandex.com',
      to: 'litavanchik@gmail.com',
      subject: data.name + ' почта пришла от: ' + data.email,
      text: data.message,
    });;
    return 'Email has been sent'
  } catch (error) {
     console.log("🚀 ~ file: route.js:28 ~ POST ~ error:", error, 'Произошла ошибка')
     
  }
}