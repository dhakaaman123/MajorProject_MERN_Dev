const mongoose  = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data");
main()
.then(()=>{
    console.log("Connected to mongodb sucessfully");
})
.catch((err)=>{
    console.log(err);

})
async function  main () {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    
}

const initDb = async()=>{
     await Listing.deleteMany({}),
   initData.data =  initData.data.map((obj)=>({...obj,owner:"680e78f057ab9be3448c339a"}));
     await Listing.insertMany(initData.data);
     console.log("data was initialize");

}
initDb();