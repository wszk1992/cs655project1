/*
	Before the page loads, we create a bsService object. Do not change the name - that will break stuff :(
		The arguments passed in are a list of strings. Each string is an extensionID. these particular ID's are
		for the released version of the IdeaMACHE plugin and for a secret, special version of the extension
		that I have
	bsService will see if any of the extenions are availabe. If so it will use them. Otherwise, it will rely on the
		web-hosted version of bigsemantics

	 */

var bsService = new BSAutoSwitch(['elkanacmmmdgbnhdjopfdeafchmhecbf', 'gdgmmfgjalcpnakohgcfflgccamjoipd ']);


/*
Called on the data-only page
*/
function onLoadSemantics(url)
{
	/*
	Let's break down the arguments.
		-url: the URL you want metadata for
		-options: If you already have meta-metadata, you can pass it in here so prevent double extraction.
		-callback: your function that will asynchronously recieve metadata
	*/

	var options = {};
	var callback = showProduct;
	bsService.loadMetadata(url, options, callback);
}

// Ignore this. I just use it to make numbers slightly prettier -- visciously copy-pasted from stack overflow:
// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x)
{
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


//Writen by KAN ZHENG
function showProduct(err, metadataAndMetametaData) {
	var imageUnknown = "./public/images/no_0.jpg";
	//To make metadata easier to use via js, first unwrap it (it's initially wrapped for cross-compatibility with C#)
	var unwrappedMetadata = BSUtils.unwrap(metadataAndMetametaData.metadata);
	var table = document.getElementById('table');
	if(!err) {
		//we create a node to hold the linked image
		//never trust metadata! Like file I/O you should wrap it try catch statements
		//product
		var product = document.createElement('li');
		product.className = "list-group-item";
		product.id = "product";
		table.appendChild(product);

		//image
		var product_img = document.createElement('img');
		product_img.id = "product_img";
		try {
			product_img.src = unwrappedMetadata.main_images[0].location;
		} catch(e) {
			product_img.src = imageUnknown;
		}
		product.appendChild(product_img);

		//content
		var product_content = document.createElement('div');
		product_content.id = "product_content";
		product.appendChild(product_content);

		//source
		var product_source = document.createElement('div');
		product_source.id = "product_source";
//		product_source.innerHTML = "FROM:";
		product.appendChild(product_source);

		//source_img
		var product_source_img = document.createElement('img');
		product_source_img.id = "product_source_img";
		try {
			product_source_img.src = sourceImgDetect(unwrappedMetadata.mm_name);
		} catch(e) {
			product_source_img.src = imageUnknown;
		}
		product_source.appendChild(product_source_img);

		//compare
		// <div class="checkbox" id="compare"><label><input type="checkbox"></label>0-500</div>
		var compare = document.createElement("div");
		compare.className = "checkbox";
		compare.id = "compare";
		var label = document.createElement("label");
		var input = document.createElement("input");
		input.setAttribute("type", "checkbox");
		input.setAttribute("onchange", "compare_checkbox(this)");
		//input.id = "compare_checkbox";
		//input.setAttribute("name", "compare_checkbox");
		label.appendChild(input);
		compare.appendChild(label);
		compare.innerHTML += "add to compare";
		product_source.appendChild(compare);

		//title
		var product_title = document.createElement('a');
		product_title.id = "product_title";
		product_title.setAttribute("target", "_blank");
		try {
			product_title.setAttribute("href", unwrappedMetadata.location);
		} catch(e) {
			product_title.setAttribute("href", "#");
		}
		try {
			product_title.innerHTML = unwrappedMetadata.title;
		} catch(e) {
			product_title.innerHTML = "undefined";
		}
		product_content.appendChild(product_title);		

		//price
		var product_price = document.createElement("p");
		product_price.id = "product_price";
		try {
			product_price.innerHTML = unwrappedMetadata.price;
		} catch(e) {
			product_price.innerHTML = "???$";
		}
		product_content.appendChild(product_price);

		//rating
		var product_rating = document.createElement("p");
		product_rating.id = "product_rating";
		try {
			product_rating.innerHTML = unwrappedMetadata.overall_rating;
		} catch(e) {
			product_rating.innerHTML = "rating unknown";
		}
		product_content.appendChild(product_rating);
	}
}

function sourceImgDetect(mm_name) {
	var sources = {
		"amazon": "http://static1.businessinsider.com/image/539f3ffbecad044276726c01-960/amazon-com-logo.jpg",
		"ebay": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2000px-EBay_logo.svg.png"
	};
	for(var source in sources) {
		if(mm_name.includes(source)) {
			return sources[source];
		}
	}
	return null;
}
