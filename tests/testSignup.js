pass = true;
fail = false;

/*
--------TEST 1-------- Correct email, username and password for successful signup
INPUT REQUEST BODY (json):

{
	"email": "person6@test.com"
	"username": "person6",
	"password": "pass"
}
*/

if (responseCode.code === 201 || responseCode.code === 200) {
    tests["Request Succesfully Sent"] = pass;
} else {
	tests["Request Succesfully Sent"] = fail;
}

if (responseBody.has("User created")) {
    tests["User Created"] = pass;
} else {
	tests["User Created"] = fail;
}


/*
--------TEST 2-------- User used existing email to signup
INPUT REQUEST BODY (json):

{
	"email": "person1@test.com"
	"username": "person6",
	"password": "pass"
}
*/

if (responseCode.code === 409) {
    tests["Error Request"] = pass;
}

if (responseBody.has("Email Already exists")) {
    tests["Email Already exists"] = pass;
} else {
	tests["Email Already exists"] = fail;
}


/*
--------TEST 3-------- Username already exists, usernames have to be unique
INPUT REQUEST BODY (json):

{
	"email": "person6@test.com"
	"username": "person1",
	"password": "pass"
}
*/

if (responseCode.code === 409) {
    tests["Error Request"] = pass;
}

if (responseBody.has("username Already exists")) {
    tests["username Already exists"] = pass;
} else {
	tests["username Already exists"] = fail;
}


/*
--------TEST 4-------- User entered invalid format of email
INPUT REQUEST BODY (json):

{
	"email": "person1test.com"
	"username": "person61",
	"password": "pass"
}
*/

if (responseCode.code === 500) {
    tests["Error Request"] = pass;
}

if (responseBody.has("Path `email` is invalid")) {
    tests["Email is invalid"] = pass;
} else {
	tests["Email is invalid"] = fail;
}