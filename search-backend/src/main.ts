import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from 'express-rate-limit'
import sampleData from './sample-data.json'
// External Modules
import { Routes } from "./Routes";
import config from "../config.json";


// Get router
const router: express.Router = express.Router();
const app: express.Express = express();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(cors()); 
const pageSchema = new mongoose.Schema({
    url: String,
    title: String,
    content: String
});
pageSchema.index({ title: 'text', content: 'text' });
const Page = mongoose.model('Page', pageSchema);


Page.init().then(() => {
    console.log('Text index created');
}).catch(err => {
    console.error('Error creating text index:', err);
});


app.post('/init', async (req, res) => {
    try {
        await Page.deleteMany({});
        await Page.insertMany(sampleData);
        res.send('Database initialized and index created!');
    } catch (error) {
        res.status(500).send('Initialization failed');
    }
});

app.get('/search', async (req, res) => {
	try {
		const query = req.query.q as string;
		if (!query) {
			return res.status(400).send('Query parameter is required');
		}

		console.log('Search query:', query); 

		const results = await Page.find(
			{ $text: { $search: query } },
			{ score: { $meta: 'textScore' } }
		).sort({ score: { $meta: 'textScore' } });

		console.log('Search results:', results); 

		res.json(results);
	} catch (error) {
		console.error('Search error:', error); 
		res.status(500).send('Search error');
	}
});




const connectDatabase = async (mongoUrl: string) => {
	try {
		const options = {
			autoCreate: true,
			keepAlive: true,
			retryReads: true,
		} as mongoose.ConnectOptions;
		mongoose.set("strictQuery", true);
		const result = await mongoose.connect(mongoUrl, options);
		if (result) {
			console.log("MongoDB connected");
		}
	} catch (err) {
		console.log("ConnectDatabase", err);
	}
};

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(limiter)
app.use(express.json());

// Frontend Render
if (!config.debug) {
	app.use(express.static(__dirname + "/build"));
	app.get("/*", function (req, res) {
		res.sendFile(__dirname + "/build/index.html", function (err) {
			if (err) {
				res.status(500).send(err);
			}
		});
	});
}

// API Router
Routes(router);
app.use("/api", router);


connectDatabase(config.DATABASE).then(() => {
	app.listen(config.PORT, () => {
		console.log(`Server listening on ${config.PORT} port`);
	});
}).catch((err: any) => {
	console.log(err);
});

export default app;