const express=require("express");
const bodyparser=require('body-parser');
const ShortUrl=require("./models/shortUrl");
const mongoose=require("mongoose");


const app=express();
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://UdaySangwan:Montimuntu%40123@cluster0.9bc8uvu.mongodb.net/shorturlDB?retryWrites=true&w=majority",{ useNewUrlParser: true })
// mongoose.connect("mongodb://127.0.0.1:27017/shorturlDB", { useNewUrlParser: true });


app.get("/", async (req,res) => {
  const shortUrls= await ShortUrl.find();
  res.render("index",{shortUrls:shortUrls});
});

app.post("/shortUrls", async (req,res) =>{
 await ShortUrl.create({full:req.body.fullUrl});
  res.redirect("/");
});

app.get("/:shortUrl", async(req,res)=>{
  const shortUrl=await ShortUrl.findOne({short: req.params.shortUrl});

 shortUrl.clicks++;
 shortUrl.save();

  res.redirect(shortUrl.full);
});
app.post("/delete",async (req,res)=>{
    const checkedboxId=  req.body.checkbox;
      ShortUrl.findByIdAndRemove(checkedboxId,function(err){
  if(!err){
  console.log("successfully deleted item.")
  res.redirect("/");
}
      });
});

app.listen(process.env.PORT || 3000,function(){
  console.log("server is running");
})
