var express			=require('express'),
	request			=require('request'),
	mongoose		=require('mongoose'),
	bodyParser		=require('body-parser'),
	methodOverride	=require('method-override'),
	app	=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/bed_time', {useNewUrlParser:true});

//CONFIG SCHEMA
var storySchema=mongoose.Schema({
	title: String,
	image: String,
	plot: String,
	author: String,
	entered: {type: Date, default:Date.now }
});

var Story=mongoose.model('Story', storySchema);

app.get('/', (req,res)=>{
	res.send('home');
});

app.get('/index', (req,res)=>{
	Story.find({},(err, stories)=>{
		if(err){
			res.send("Something went wrong");
		}else{
			res.render("index", {stories:stories});
		}
	});
});

//NEW
app.get('/index/new', (req, res)=>{
	res.render('new');
});

//CREATE
app.post('/index', (req, res)=>{
	Story.create(req.body.kwento,(err, newStory)=>{
		if(err){
			console.log(err);
		}else{
			res.redirect('/index');
			console.log(newStory);
		}
	});
});

//SHOW
app.get('/index/:id', (req,res)=>{
	Story.findById(req.params.id, (err, story)=>{
		if(err){
			console.log(err);
		}else{
			res.render('show',{story:story});
		}
	});
});

//EDIT
app.get('/index/:id/edit',(req, res)=>{
	Story.findById(req.params.id, (err, story)=>{
		if(err){
			res.render("index");
		}else{
			res.render("edit",{story:story});
		}
	});
});

//UPDATE
app.put('/index/:id',(req, res)=>{
	Story.findByIdAndUpdate(req.params.id, req.body.kwento, (err, foundStory)=>{
		if(err){
			console.log(err);
		}else{
			console.log(req.body.kwento);
			res.redirect('/index/'+req.params.id);
		}
	});
});

//DELETE
app.delete('/index/:id', (req, res)=>{
	Story.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			res.redirect('/index');
		}else{
			res.redirect('/index');
		}
	});
});

// Story.create({
// 	title:'Jack and the Beanstalk',
// 	image:'',
// 	plot:"Jack and the Beanstalk is an English fairy tale. It appeared as The Story of Jack Spriggins and the Enchanted Bean in 1734 and as Benjamin Tabart's moralised The History of Jack and the Bean-Stalk in 1807.",
// 	author:'Benjamin Tabart'
// }, (err, story)=>{
// 	if(err){
// 		console.log('Something went wrong');
// 	}else{
// 		console.log(story+' has been added.');
// 	}
// });

app.listen(80,()=>{
	console.log('The app has started!');
});
