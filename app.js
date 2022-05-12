const express = require("express")
const app = express()

const mongoose=require("mongoose")
const bodyParser = require("body-parser")
const ejs = require("ejs");
console.log("app.js")
// middleware
app.use(express.json())

const {check,validationResult}=require("express-validator");
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
const urlencodedparser=bodyParser.urlencoded({ extended: true });
// database connection
mongoose.connect("mongodb+srv://ap4047:4047@cluster0.yhzcb.mongodb.net/assignment3b?retryWrites=true&w=majority", { useNewUrlParser: true });

const studentschema = new mongoose.Schema({
    studentname: {type:String},
   
    roll_no: {type:String},
   WAD:{type:Number,min:0,max:100},
    DSBDA:{type:Number,min:0,max:100},
    CNS:{type:Number,min:0,max:100},
    CC:{type:Number,min:0,max:100},
    AI:{type:Number,min:0,max:100},


});


const student = mongoose.model("student", studentschema);
app.get("/" , (req , res)=>{
    var arr=student.find({},function(err, users) {
        var userMap = {};
    
        users.forEach(function(user) {
          userMap[user._id] = user;
          console.log(userMap);
          console.log(userMap[user._id]["email"])
        //   document.getElementsByClassName("list").innerHTML="<li>"+userMap[user._id]["email"]+"</li>"
        });
    
        res.render("ass1"); } );
    });
    



app.post("/",function(req,res){  
    const errors=validationResult(req);
    
    const newuser=new student({
        studentname:req.body.name,
        roll_no:req.body.Roll_No,
        WAD:req.body.WAD,
        DSBDA:req.body.DSBDA,
        CNS:req.body.CNS,
        CC:req.body.CC,
        AI:req.body.AI,

      
         
    })
   

            
                newuser.save(function(err){
                    if(err){
                        console.log(err);
                    }else
                    {
                        console.log("insertion succeful");
                       res.redirect("/");
                    }
                })
            
           
       
      
    

    
   
   
});

// API
app.post("/delete",function(req,res){
    student.deleteOne({roll_no:req.body.Roll_No},function(err){
        if(err){
            console.log("deletion unsuceesfull")
        }else{
            console.log("Deleted successfully")
            res.redirect("/data")
        }
    })
})
app.get("/data",function(req,res){
    var counts=0
    student.countDocuments({},function(err,count){
        console.log("studnets count="+count)
        counts=count
    });
   
    student.find({},function(err,students){
        // console.log(students)
        res.render("ass1",{studentList:students,count:counts})
    })
})
app.post("/update",function(req,res){
    student.findOne({roll_no:req.body.Roll_No},function(err,foundUser){
        if(err)
        {
            console.log(err);
        }if(foundUser){
         
          student.updateOne({roll_no:req.body.Roll_No},{studentname:req.body.name,
         
            WAD:req.body.WAD,
            DSBDA:req.body.DSBDA,
            CNS:req.body.CNS,
            CC:req.body.CC,
            AI:req.body.AI,
            
          },function(err){
              if(err)
              {
                  console.log("update not successfull");
                  console.log(err);
              }else{
                  console.log("update successfull");
                  res.redirect("/data");
              }
          });
            
        }else
        {
            newuser.save(function(err){
                if(err){
                    console.log(err);
                }else
                {
                    console.log("insertion succeful");
                   res.redirect("/");
                }
            })
        }
       
    });
})
const PORT = 3000 || process.env.PORT
app.listen(PORT ,  ()=>{
    console.log(`Server has started on ${PORT}`)
})