// const test = require('dotenv').config()
import dotenv from 'dotenv'
const envVar = dotenv.config()

console.log(envVar.parsed.HCTI_ID, envVar.parsed.HCTI_API_KEY)

// console.log(HCTI_ID, HCTI_API_KEY)
// console.log(process.env.HCTI_ID, process.env.HCTI_API_KEY)

// // Define your HTML/CSS
// const data = {
//   html: "<div class='box'>gooning ✅</div>",
//   css: ".box { border: 4px solid #03B875; padding: 20px; font-family: 'Roboto'; }",
//   google_fonts: "Roboto"
// }

// // Create an image by sending a POST to the API.
// // Retrieve your api_id and api_key from the Dashboard. https://htmlcsstoimage.com/dashboard
// request.post({ url: 'https://hcti.io/v1/image', form: data})
//   .auth(envVar.parsed.HCTI_ID, envVar.parsed.HCTI_API_KEY)
//   .on('data', function(data) {
//     console.log(JSON.parse(data))
//   })