var baseURL = "http://api.reimaginebanking.com"
var KEY = "?key=0b61666358ee3724381e2cde8c944de0"

//checks to see if array "set" contains keyword "id"
function contains(set, id){
	for(j = 0; j < set.length; j++)
		if(set[j] == id)
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
	    	var set = [] //set of all customerIds
	    	var id //holds single customerId

	    	//parser: moves through JSON string looking for "customer_id" occurances
	    	//when a match is found, skip 14 characters to reach the starting point for the field
	    	//each id is 24 characters long
	    	//add to set if it isn't in it already
	    	for(i = 0; (position = xhttp.responseText.indexOf("customer_id", i)) != -1;){
	    		id = xhttp.responseText.substring(position + 14, position + 24 + 14)
	    		if(!contains(set, id)){
		    		set.push(id)
		    		element.innerHTML += id + "<br>"	
				}
	    		i = position + 39 //move the cursor 39 characters over to get to new starting point
	    	}
	    }
	};
	xhttp.open("GET", baseURL + "/accounts/" + KEY, true);
	xhttp.send();
}

//parameter customerId is the customer you would like to get the accounts from, parameter element
//is the HTLM element you would like to append the accountId list to.
function getAccountIds(customerId, element) {
	element.innerHTML += " for customer ID " + customerId + "<br>"

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var position
	    	var set = []
	    	var id
	    	for(i = 0; (position = xhttp.responseText.indexOf("\"_id\"", i)) != -1;){
	    		id = xhttp.responseText.substring(position + 7, position + 24 + 7)
	    		if(!contains(set, id)){
		    		set.push(id)
		    		element.innerHTML += id + "<br>"	
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
	element.innerHTML += " for Account ID " + accountId + "<br>"
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       element.innerHTML += JSON.parse(xhttp.responseText).balance
	    }
	};
	xhttp.open("GET", baseURL + "/accounts/" + accountId + KEY, true);
	xhttp.send();
}

var p1 = document.getElementById("p1")
var p2 = document.getElementById("p2")
var p3 = document.getElementById("p3")

//getting the customer ids gets you the accounts, getting the accounts gets you the balance. In this order you must go.
getCustomerIds(p1)
getAccountIds("59380fd0a73e4942cdafd722", p2)
getBalance("59380fd0a73e4942cdafd723", p3)

