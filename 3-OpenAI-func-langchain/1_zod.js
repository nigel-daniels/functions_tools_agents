import { z } from 'zod';


// Let's just remind ourselves of the standard JS class an how it can be abused!
class User {
	constructor(name, age, email) {
		this.name = name;
		this.age = age;
		this.email = email;
	}
}

let foo = new User('Joe', 32, 'joe@gmail.com');

console.log(foo.name);

foo = new User('Joe', 'bar', 'joe@gmail.com');

console.log(foo.age);

// Now let's try this using zod
const zUser = z.object({
	name: z.string(),
	age: z.number(),
	email: z.string()
});

// This next line will fail at runtime as 'bar' is not a number!
// So we get runtime checking for free.
/*
let zFoo = zUser.parse({
	name: 'Jane',
	age: 'bar',
	email: 'jane@gmail.com'
});

console.log(zFoo);
*/

// Here is how we can nest zod types
/*
const Class = z.array(zUser);

let zClass = Class.parse([
	zUser.parse({
		name: 'Jane',
		age: 32,
		email: 'jane@gmail.com'
	});
]);

console.log(zClass);
*/
