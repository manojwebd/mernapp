'use strict'

const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()
const path = require('path')
const os = require('os')

const express = require("express")
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
const helmet = require("helmet");
const fs = require('fs'); 
const puppeteer=require('puppeteer');
/* const https = require('https')
const http = require('http')
const fs = require('fs') */
const port = process.env.PORT || 3003
const app = express()
//const upload = multer({ dest: 'uploads/' }) // for parsing multipart/form-data

/* const dbPath = process.env.DATABASE_URL || 'postgres://yyuttopkkkmgsw:1b0bd3704e2354c8f20a144a61eb56ef3efe81ffd1a59b1c9fec4e7453cea279@ec2-54-227-248-71.compute-1.amazonaws.com:5432/ddndgd8jfp888c'
//'postgresql://postgres:manoj123@localhost:5432/jhar_pg' //
const { Client } = require('pg');

const client = new Client({
  connectionString: dbPath,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
}); */

/* 
const db = require('./queries')
//DB
  app.get('/users', db.getUsers)
  app.get('/users/:id', db.getUserById)
  app.post('/users', db.createUser)
  app.put('/users/:id', db.updateUser)
  app.delete('/users/:id', db.deleteUser)
//enD db
 */

app.engine('.html', require('ejs').__express);
app.set("view engine", "html")
app.set("views","./views")
app.set('title', 'My Page Server')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true,}))
app.use(express.static(path.join(__dirname, 'public')))
//app.use('/static', express.static('public'))
app.use((req, res, next) => {
  console.log('Time: %d', Date.now())
  next()
})
//app.use(helmet()); 
//upload files
const rootPathTmp = './public/files/';
const upload1 = multer({dest:rootPathTmp});

//Configuration for Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    console.log('file',file);
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/user-${file.fieldname}-${Date.now()}.${ext}`);
  },
});
// Multer Filter
const multerFilter = (req, file, cb) => {
  //console.log(file.mimetype.split("/"))
  if (file.mimetype.split("/")[1] === "pdf" || file.mimetype.split("/")[1] === "webm") {
    cb(null, true);
   } else {
    cb(new Error("Not a PDF/video File!!"), false);
    console.log('format error: Not a PDF/video File!!')
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});


//video
app.get('/v', function (req, res) {
  res.redirect('vv.html')
})

app.post('/v', multipartMiddleware,  async (req, res) => {
  console.log('files', req.files.data.path)
  let location = await path.join(os.tmpdir(), 'upload.webm')
  //fs.rename(req.files.data.path, location)
  console.log(`upload successful, file written to ${location}`)
  res.send(`upload successful, file written to ${location}`)
})

const users = [
    { name: 'tobi', email: 'tobi@learnboost.com' },
    { name: 'loki', email: 'loki@learnboost.com' },
    { name: 'jane', email: 'jane@learnboost.com' }
];
  
app.get("/home", async (req,res)=>{
    res.render("home", {
        users: users,
        title: "Home Page",
        header: "Some users"
    })
})

app.get('/createImage', async (req, res) => {
    //1. Execute function to get lead_story
    const lead_story = await crawlSite();
    //2. Show lead_story
    res.send(`<html><base href="https://orissahighcourt.nic.in/e-filing/" />${lead_story}</html>`)
})

app.use("/pdf2", async (req, res) => {
  const html = fs.readFileSync(`${__dirname}/public/invoice.html`, 'utf8')
  const pdf = await generatePDF(html);
  res.set("Content-Type", "application/pdf");
  res.send(pdf);
});

app.use("/pdf", async (req, res) => {
  const pdf = await generatePDF(`
    <html>
        <head>
          <title>Test PDF</title>
          <style>
          @page {
            margin:20px;
            margin-bottom:45px;
          }
            body {
              padding: 60px;
              font-family: "Hevletica Neue", "Helvetica", "Arial", sans-serif;
              font-size: 16px;
              line-height: 24px;
            }

            body > h4 {
              font-size: 24px;
              line-height: 24px;
              text-transform: uppercase;
              margin-bottom: 60px;
            }

            body > header {
              display: flex;
            }

            body > header > .address-block:nth-child(2) {
              margin-left: 100px;
            }

            .address-block address {
              font-style: normal;
            }

            .address-block > h5 {
              font-size: 14px;
              line-height: 14px;
              margin: 0px 0px 15px;
              text-transform: uppercase;
              color: #aaa;
            }

            .table {
              width: 100%;
              margin-top: 60px;
            }

            .table table {
              width: 100%;
              border: 1px solid #eee;
              border-collapse: collapse;
            }

            .table table tr th,
            .table table tr td {
              font-size: 15px;
              padding: 10px;
              border: 1px solid #eee;
              border-collapse: collapse;
            }

            .table table tfoot tr td {
              border-top: 3px solid #eee;
            }
          </style>
        </head>
        <body>
          <h4>Invoice</h4>
          <header>
            <div class="address-block">
              <h5>Recipient</h5>
              <address>
                Doug Funnie<br />
                321 Customer St.<br />
                Happy Place, FL 17641<br />
              </address>
            </div>
            <div class="address-block">
              <h5>Sender</h5>
              <address>
                Skeeter Valentine<br />
                123 Business St.<br />
                Fake Town, TN 37189<br />
              </address>
            </div>
          </header>
          <div class="table">
            <table>
              <thead>
                <tr>
                  <th style="text-align:left;">Item Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Swiss Army Cat</td>
                  <td style="text-align:center;">$32.70</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$32.70</td>
                </tr>
                <tr>
                  <td style="text-align:left;">Holeless Strainer</td>
                  <td style="text-align:center;">$9.00</td>
                  <td style="text-align:center;">x2</td>
                  <td style="text-align:center;">$18.00</td>
                </tr>
                <tr>
                  <td style="text-align:left;">"The Government Lies" T-Shirt</td>
                  <td style="text-align:center;">$20.00</td>
                  <td style="text-align:center;">x1</td>
                  <td style="text-align:center;">$20.00</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" />
                  <td style="text-align:right;"><strong>Total</strong></td>
                  <td style="text-align:center;">$70.70</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </body>
      </html>
  `);

  res.set("Content-Type", "application/pdf");
  res.send(pdf);
});

 app.post('/profile', upload1.single('fileToUpload'), function(req, res) {
  console.log(req.file);
  var filename = req.file.filename; 
  var mimetype = req.file.mimetype; 
  mimetype = mimetype.split("/"); 
  var filetype = mimetype[1]; 
  var old_file = rootPathTmp+filename; 
  var new_file = rootPathTmp+'usr_'+Date.now()+'_'+req.file.originalname; 
  fs.rename(old_file,new_file,function name(err) {
    if (err) throw err;
    console.log('File Renamed.');
  });
  res.send("file saved on server");
 });

app.post('/profile1', upload.single("fileToUpload"), function (req,res) {
  /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
  var tmp_path = req.file.path;
  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  var target_path = rootPathTmp + req.file.originalname;
  /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest); fs.unlinkSync(tmp_path);
  src.on('end', function() { res.send('complete'); });
  src.on('error', function(err) { res.send('error',err); });

});

app.post('/profile2', upload.single("fileToUpload"), async (req, res) => {
  // Stuff to be added later
  try {
    const newFile = await File.create({ name: req.file.filename,});
    res.status(200).json({
      status: "success",
      message: "File created successfully!!",
    });
  } catch (error) {
    res.json({ error,});
  }

})

app.get("/getFiles", async (req, res) => {
  try {
    //const files = await File.find();
    const files = fs.readdirSync(rootPathTmp);
    let fileData = [];
    /* files.map(file => {
      if (path.extname(file) == ".md")
        fileData.push({name:file,createdAt:9090});
    }) */
    res.status(200).json({
      status: "success",
      files,
    });
  } catch (error) {
    res.json({
      status: "Fail",
      error,
    });
  }
});

app.get("/admin", (req,res)=>{
    res.send("<h2>Hello! Admin</h2>")
})

app.get('/api', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

/* const options = {
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('privkey.pem')
}; */


/* http.createServer(app).listen(8085)
https.createServer(options, app).listen(8441) */

app.listen(port, ()=>{
    console.log(`app listening on port ${port}`)
}) 


async function crawlSite(){
    console.log('Function Crawl Site executed');

    //1. Set time and date for screenshot
    const time=new Date();
    const timestamp=time.getTime();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    //  await page.goto('https://blog.risingstack.com', {waitUntil: 'networkidle0'});

    await page.goto('https://orissahighcourt.nic.in/e-filing/');

    //2. Take a screenshot
    await page.screenshot({ path: `${timestamp}.png`, fullPage: true })

    //3. Find in <div> <ul class='lead-stories' ...
    const lead_story = await page.$eval('html', el => el.innerHTML)
    
    return lead_story;
}

async function generatePDF(html = "Manoj") {
  const minimal_args = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
  ];
  const browser = await puppeteer.launch({
				args: minimal_args,
				headless: true,
			});
  const page = await browser.newPage();

  await page.setContent(html);
  await page.evaluate(() => {
    const div = document.createElement('div');
    div.innerHTML = 'Watermark Text...';
    div.style.cssText = "position: fixed; top: 15px; left: 15px; z-index: 10000; color:#666";
    document.body.appendChild(div);
  });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground:true,
    displayHeaderFooter: true,
    scale: 1,
    headerTemplate: ``,
    footerTemplate: `
    <div style="border-top: solid 1px #bbb; width: 100%; font-size: 9px;
        padding: 5px 5px 0; color: #bbb; position: relative;">
        <div style="position: absolute; left: 5px; top: 5px;"><span class="date"></span></div>
        <div style="position: absolute; right: 5px; top: 5px;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>
    </div>
  `,
    // this is needed to prevent content from being placed over the footer
    margin: {
      bottom: "10mm",
      left: "10mm",
      right: "10mm",
      top: "10mm",
    },
    path: `${__dirname}/invoice/my-fance-invoice_${Date.now()}.pdf`
  });
    /* headerTemplate: "<div style='z-index: 10003; '><div class='pageNumber'></div> <div>/</div><div class='totalPages'></div></div>",
    footerTemplate: "<div style=\"z-index: 10001;  text-align: right; width: 297mm;font-size: 8px;\"><span style=\"margin-right: 1cm\"><span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></span></div>", */
  await page.close();
  await browser.close();

  return pdfBuffer;
};