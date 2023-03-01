const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const xlsx = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017',{useNewUrlParser: true});
    console.log("successfully connected");


  const inventoryIn = new mongoose.Schema({
    code:String,
    color: String,
    size_28:Number,
    size_30:Number,
    size_32:Number,
    size_34:Number,
});

  const inventoryOut = new mongoose.Schema({
  code:String,
  color: String,
  size_28:Number,
  size_30:Number,
  size_32:Number,
  size_34:Number,
});
  

const Items = mongoose.model("Items", inventoryIn);
const SoldItems=mongoose.model("SoldItems",inventoryOut);
const storage = multer.memoryStorage();
const upload = multer({ storage });
const PORT = 5000

app.get("/data",async (req,res)=>{
  try {
    const data = await Items.find();
    res.send(data);
  } catch (error) {
    res.status(500).send("Error retrieving data");
  }
})

app.get("/soldData",async (req,res)=>{
  try {
    const data = await SoldItems.find();
    res.send(data);
  } catch (error) {
    res.status(500).send("Error retrieving data");
  }
})

app.post("/api/addData", upload.single("file"), async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  try {
    const oldData=await Items.find();
    const newData=req.body;
    // console.log(oldData);
    // console.log(newData);
    newData.map((product) => {
      oldData.map((item) => {
        if(product.code==item.code&&item.color==product.color)
        {
          product.size_28+=item.size_28;
          product.size_30+=item.size_30;
          product.size_32+=item.size_32;
          product.size_34+=item.size_34;

        }
      })
    })

    console.log(newData);
    await Items.deleteMany({});
    await Items.insertMany(newData);
    // const data=req.body;
    // await SoldItems.deleteMany({});
    // data.forEach( (obj) =>
    // {
    //   obj.size_28=0;
    //   obj.size_30=0;
    //   obj.size_32=0;
    //   obj.size_34=0;
    // });

    // await SoldItems.insertMany(data);

    return res.send("Data imported successfully");
  } catch (error) {
    return res.status(500).send("Error importing data");
  }
});

app.listen(
  PORT,
  console.log(
    `Server running in  mode on port ${PORT}`
  )
)