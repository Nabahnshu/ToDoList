const express = require('express');
const bodyParser = require('body-parser');
// const date = require(__dirname+"/date.js");
const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.connect('mongodb://127.0.0.1:27017/todolist');

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');


const itemSchema = {name:String};
const Item = mongoose.model("Item", itemSchema);

const listSchema = {name:String,items:[itemSchema]};
const List = mongoose.model("List", listSchema);

// var items=["Buy food","Cook food","Eat"];
// var works = [];

const item1 = new Item({name:"Welcome to todolist!"});
const item2 = new Item({name:"Hit + to add new item to your list"});
const item3 = new Item({name:"<-- Hit this to delete an item"});

const tots = [item1, item2, item3];

app.get('/', function(req,res){
    // let day = date.getDate();
    Item.find({})
        .then((data,err) => {
            if (data.length===0) {
                Item.insertMany(tots)
                    .then((err) => {
                        if (err) {
                        console.log(err);
                    } else {
                        console.log('inserted');
                    }
        });
        res.redirect('/');
            } else {
                res.render("list",{d : "Today", i : data});
            }
        })
      .catch((err) => console.error(err));   
});

app.get('/:use',function(req,res){

    const listName = _.capitalize(req.params.use);

    List.findOne({name:listName})
        .then((data) => {
            if (data) { // check if data is truthy
                res.render("list", {d: data.name, i: data.items});
            } else {
                const list = new List({
                    name: listName,
                    items: tots
                });
                list.save();
                res.redirect('/' + listName);
            }
        })
        .catch((err) => console.error(err));
});

app.post('/', function(req,res){

    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
            name : itemName
        });
    if (listName === "Today") {
        item.save();
        res.redirect('/');
    } else {
        List.findOne({name:listName})
            .then((data)=>{
                data.items.push(item);
                data.save();
                res.redirect('/'+listName);
            })
    }

    
    
});

app.post('/delete', async function(req,res) {
   const deli = req.body.check;
   const listName = req.body.listName;

   if (listName==="Today") {
    const item = new Item({
        _id : deli
    });
    item.deleteOne();
    res.redirect('/');
   }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deli}}})
            .then((result)=>{
            if (result) {
                res.redirect('/'+listName);
            }
            });
    }
});




// app.post('/work',function(req,res){
//     var item=req.body.newItem;
//     works.push(item);
//     res.redirect("/work");
// });


app.listen(3000);