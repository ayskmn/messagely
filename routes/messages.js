const Router = require("express").Router;
const Message = require("..models/message");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");
const router = new Router();


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/


router.get("/:id", ensureLoggedIn, async function(req, res, next){
	try {
		let msg = await Message.get(req.params.id);
		return res.json({msg});

	} catch(err) {
		return next(err);
	}
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

 router.post("/register",  async function(req, res, next) {
	try {
		let {from_username} = await Message.create(req.body);
		let token = jwt.sign({from_username}, SECRET_KEY);
		User.updateLoginTimeStamp(from_username);
		return res.json({token})
	} catch (err) {
		return next(err);
	}
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post("/:id/read", ensureCorrectUser, async function(req, res, next) {
	try {
		let msg = await Message.markRead(req.params.id);
		return res.json({msg});
 } catch(err) {
	 return next(err);
 }
	
});
