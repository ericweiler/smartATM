
var baseURL = "http://api.reimaginebanking.com"
var KEY = "?key=0b61666358ee3724381e2cde8c944de0"


//checks to see if array "set" contains keyword "id"
function contains(sett, id){
	for(j = 0; j < sett.length; j++)
		if(sett[j] == id)
			return true
	return false
}

//customers are the top most identifier. Customers are represented by unique customerId strings.
//each customer may have any number of accounts. Accounts are represented by uniqne accountId strings.

//parameter element is the HTML element that you would like to append the customerId list to.
function getCustomerIds(element) {
	element.innerHTML += ":<br>"
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var position //position of the first occurance of "customer_id"
	    	var set1 = [] //set of all customerIds
	    	var id //holds single customerId

	    	//parser: moves through JSON string looking for "customer_id" occurances
	    	//when a match is found, skip 14 characters to reach the starting point for the field
	    	//each id is 24 characters long
	    	//add to set if it isn't in it already
	    	for(i = 0; (position = xhttp.responseText.indexOf("customer_id", i)) != -1;){
	    		id = xhttp.responseText.substring(position + 14, position + 24 + 14)
	    		if(!contains(set1, id)){
		    		set1.push(id)
		    		element.innerHTML += id + "<br>"	
				}
	    		i = position + 39 //move the cursor 39 characters over to get to new starting point
	    	}
	    }
	};
	xhttp.open("GET", baseURL + "/accounts/" + KEY, true);
	xhttp.send();
}

var set = []

//parameter customerId is the customer you would like to get the accounts from, parameter element
//is the HTLM element you would like to append the accountId list to.
function getAccountIds(customerId) {
	//element.innerHTML += " for customer ID " + customerId + "<br>"

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var position
	    	var id
	    	for(i = 0; (position = xhttp.responseText.indexOf("\"_id\"", i)) != -1;){
	    		id = xhttp.responseText.substring(position + 7, position + 24 + 7)
	    		if(!contains(set, id)){
		    		set.push(id)
		    		//element.innerHTML += id + "<br>"	
				}
	    		i = position + 32
	    	}
	    }
	};
	xhttp.open("GET", baseURL + "/customers/" + customerId + "/accounts" + KEY, true);
	xhttp.send();
}

//fills HTML element, element with the account balance corresponding to accountId
function getBalance(accountId, element) {
	//element.innerHTML += " for Account ID " + accountId + "<br>"
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       element.innerHTML += "$" + JSON.parse(xhttp.responseText).balance.toFixed(2)
	    }
	};
	xhttp.open("GET", baseURL + "/accounts/" + accountId + KEY, true);
	xhttp.send();
}

function getNickname(accountId, element) {
	//element.innerHTML += " for Account ID " + accountId + "<br>"
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       element.innerHTML += JSON.parse(xhttp.responseText).nickname
	    }
	};
	xhttp.open("GET", baseURL + "/accounts/" + accountId + KEY, true);
	xhttp.send();
}

function populateWelcome(){
	var p1 = document.getElementById("cred")
	var p2 = document.getElementById("check")
	var p3 = document.getElementById("save")

	var p1amt = document.getElementById("cred-amt")
	var p2amt = document.getElementById("check-amt")
	var p3amt = document.getElementById("save-amt")

	//getting the customer ids gets you the accounts, getting the accounts gets you the balance. In this order you must go.
	getAccountIds("59380fd0a73e4942cdafd722")

	getNickname("59380fd0a73e4942cdafd723", p1); //Credit
	getNickname("593882e4ceb8abe242517839", p2); //Checking
	getNickname("59389eaeceb8abe24251788e", p3); //Savings

	getBalance("59380fd0a73e4942cdafd723", p1amt);
	getBalance("593882e4ceb8abe242517839", p2amt);
	getBalance("59389eaeceb8abe24251788e", p3amt);
}

var curPage = window.location.pathname.split("/").pop();

if(curPage === "welcome.html"){
	populateWelcome();
}

function getPurchases(accountId, tableElement) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	   
	var position
	   
	var endposition
	   
	var purchaseDate
	   
	var amount
	   
	var description
	   
	tableElement.innerHTML += "<tr><th>Date</th><th>Description</th><th>Amount</th></tr>"
	   
	for(i = 0; (position = xhttp.responseText.indexOf("\"purchase_date\"", i)) != -1;){
	   
	purchaseDate = xhttp.responseText.substring(position + 17, position + 10 + 17)
	   
	   
	position = xhttp.responseText.indexOf("\"amount\"", i)
	   
	endposition = xhttp.responseText.indexOf(",", position)
	   
	amount = xhttp.responseText.substring(position + 9, endposition)

	   
	position = xhttp.responseText.indexOf("\"description\"", i)
	   
	endposition = xhttp.responseText.indexOf(",", position)
	   
	description = xhttp.responseText.substring(position + 15, endposition - 1)

	   
	tableElement.innerHTML += "<tr><td>" + purchaseDate + "</td><td class='desc'>" + 
	   
	description + "</td><td>" + 
	   
	"$" + amount + "</td></tr>"
	   
	i = endposition
	   
	}
	   }
	};
	xhttp.open("GET", "http://api.reimaginebanking.com/merchants/57cf75cea73e494d8675ec49/accounts/59380fd0a73e4942cdafd723/purchases?key=0b61666358ee3724381e2cde8c944de0", true);
	xhttp.send();
}


function deposit(accountId, amount){
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", baseURL + "/accounts/" + accountId + "/deposits" + KEY, true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send("{\"medium\": \"balance\",\"amount\": " + amount + "}");
}


function withdrawal(accountId, amount){
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", baseURL + "/accounts/" + accountId + "/withdrawals" + KEY, true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send("{\"medium\": \"balance\",\"amount\": " + amount + "}");
}