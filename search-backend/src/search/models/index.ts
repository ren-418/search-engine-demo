import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SearchSchema = new Schema({
	url: {
		type: String,
		default: "",
	},
	title: {
		type: String,
		default: "",
	},
	description: {
		type: String,
		default: "",
	},
	
});

const Search = mongoose.model("Searchs", SearchSchema);

const SearchModels = {
	Search
}

export default SearchModels;