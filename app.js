const express = require("express")
const mongoose = require("mongoose")
const ejs = require("ejs")

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("Public"))
app.set("view engine", "ejs")

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",
                {useUnifiedTopology: true,
                useNewUrlParser: true})

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("article", articleSchema)

////////////////////////////////////REQUEST TARGETTING ALL ARTICLES //////////////////Routes

app.route("/articles")

    .get(function( req, res){
        find()
        async function find() {
            const articles = await Article.find()
            res.send(articles)
        }
    })


    .post(function (req, res){
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        })
        article.save()
    })

    .delete(function (req, res){
        del()
        async function del(){
            await Article.deleteMany();
        } 
    });



////////////////////////// REQUEST TARGETTING SPECIFIC ARTICLE //////////////////////////////
app.route("/articles/:articleTitle")


    .get(function( req, res){
        find()
        async function find(){

            const article = await Article.findOne({ title: req.params.articleTitle})

            if (article){
                res.send(article)
            } else {
                res.send("No article matching the title was found.")
            }
        }
    })


    .put(function( req, res){
        put()
        async function put(){
            let article  = await Article.findOneAndReplace(
                {title: req.params.articleTitle},
                {title: req.body.title, content: req.body.content},
                {overwrite: true}
            )
            if (article) {
                res.send("Successfully updated the article")
            } else {
                res.send("Unable to update the artcile")
            }
        }
    })


    .patch(function(req, res){
        patch()
        async function patch(){
            let article = await Article.updateOne(
                {title: req.params.articleTitle},
                {$set : req.body})
            if (article) {
                res.send("Successfully updated article.")
            } else {
                res.send("Unable to update the article.")
            }
            
        }

    })

    .delete(function(req, res){
        del()
        async function del(){
            await Article.deleteOne(
                {title: req.params.articleTitle}
            )
        }
    })


app.listen(3000, () => {
        console.log("Server started on port number 3000")
    })