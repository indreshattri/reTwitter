pass = true;
fail = false;

/*
--------TEST 1-------- Correct username and password for successful login
INPUT REQUEST BODY (json):

{
	"username": "person1",
	"password": "pass"
}
*/

if (responseCode.code === 201 || responseCode.code === 200) {
    tests["Request Succesfully Sent"] = pass;
} else {
	tests["Request Succesfully Sent"] = fail;
}

if (responseBody.has("Auth Successful")) {
    tests["Auth Successful"] = pass;
} else {
	tests["Auth Successful"] = fail;
}


/*
--------TEST 2-------- incorrect username or password for unsuccessful login
INPUT REQUEST BODY (json):

{
	"username": "person10",
	"password": "pass"
}
*/
if (responseCode.code === 401) {
    tests["Error Request"] = pass;
}

if (responseBody.has("Auth Failed")) {
    tests["Auth Failed"] = pass;
}

