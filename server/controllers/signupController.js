'use strict';

var bcrypt = require('bcryptjs');
var User = require('../models/user.js');
var api_key = 'key-ddaf59a80dcdd35a4228f65b2288bc37';
var domain = 'sandboxc252008f3a4b492e898566920347fa35.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

module.exports.create = function(req, res) {
	var newUser = req.body;

	var mail = {
		from: 'Address Book <confirmation@addressbook.com>',
		to: newUser.email,
		subject: 'Registration Successfully Completed',
		text: 'Registration successfully completed! Now you can sign into your account. http://localhost:3000'
	};

	User.UserModel.findOne({'email': newUser.email}, function(err, obj) {

		if (obj == null) {
				bcrypt.genSalt(10, function(err, salt) {
					    bcrypt.hash(newUser.password, salt, function(err, hash) {
					       	newUser.password = hash;
					       
					       	var userEntry = new User.UserModel();
							userEntry.email = newUser.email;
							userEntry.password = newUser.password;

							userEntry.save(function(err) {
								if (err) {
									return res.sendStatus(400);
								}

								mailgun.messages().send(mail, function (error, body) {
									if (error) {
										console.log(error);
									}
								});

								return res.sendStatus(200).send(userEntry);
							});
					    });
				});
			} else if (obj != null){
				var checkEmail = obj.email;

				if (checkEmail != newUser.email) {
					bcrypt.genSalt(10, function(err, salt) {
					    bcrypt.hash(newUser.password, salt, function(err, hash) {
					       	newUser.password = hash;
					       
					       	var userEntry = new User.UserModel();
							userEntry.email = newUser.email;
							userEntry.password = newUser.password;
							userEntry.isLogged = false;

							userEntry.save(function(err) {
								if (err) {
									return res.sendStatus(400);
								}

								mailgun.messages().send(mail, function (error, body) {
									if (error) {
										console.log(error);
									}
								});

								return res.sendStatus(200).send(userEntry);
							});
					    });
				});

				} else {
					return res.send('email');
				}
			}
			
	});

};

