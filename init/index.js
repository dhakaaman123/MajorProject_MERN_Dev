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
     await Listing.insertMany(initData.data);
     console.log("data was initialize");

}
initDb();