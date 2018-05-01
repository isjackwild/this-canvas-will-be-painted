const http = require('http');
const socket = require('socket.io');
const express = require('express');
const randomID = require('random-id');
const _ = require('lodash');

const app = express();
const server = http.createServer(app);
const io = socket.listen(server);

const port = Number(process.env.PORT || 4000);

const allFriends = {};
const MAX_FRIENDS = 100;
const CLEAUP_TIME = 1000 * 60 * 2;

const onFriendUpdated = _.throttle(() => {
	io.emit('friends.update', allFriends);
}, 133.33);

io.sockets.on('connection', (client) => {
	const _id = randomID();

	const onMouseMove = (_data) => {
		const data = typeof _data === 'string' ? JSON.parse(_data) : _data; // for testing, you can only send strings
		if (!allFriends[_id]) {
			client.removeListener('mousemove', onMouseMove); // cleaned up by server for no mouse move for ages, so remove future events
			console.log('inactive user gone');
			return
		}

		allFriends[_id].x = data.x;
		allFriends[_id].y = data.y;
		allFriends[_id].timestamp = new Date().getTime();
		onFriendUpdated();
	}

	const onUpdateColour = (data) => {
		if (!data) return;
		allFriends[_id].colour = data.colour;
		onFriendUpdated();
	}

	const onDisconnect = () => {
		if (!allFriends[_id]) return; // already been cleaned up because inactive
		client.broadcast.emit('friend.leave', _id);
		delete allFriends[_id];
	}

	if (Object.keys(allFriends).length <= MAX_FRIENDS) {
		client.emit('friends.welcome', { allFriends, _id, isPassive: false });

		allFriends[_id] = { _id: _id, x: null, y: null, timestamp: new Date().getTime(), colour: [255, 0, 0, 255] };
		client.broadcast.emit('friend.join', allFriends[_id]);

		console.log('add listener');
		client.on('disconnect', onDisconnect);
		client.on('mousemove', onMouseMove);
		client.on('updatecolour', onUpdateColour)
	} else { // too many users. Be be passive!!
		client.emit('friends.welcome', { allFriends, _id, isPassive: true });
	}

});

// cleanup if not moved for > 5mins
setInterval(() => {
	const now = new Date().getTime();
	console.log('cleanup old users');
	_.forEach(allFriends, f => {
		console.log(now - f.timestamp);
		if ((now - f.timestamp) > CLEAUP_TIME) {
			console.log('leave');
			io.emit('friend.leave', f._id);
			delete allFriends[f._id];
		}
	});
}, CLEAUP_TIME);

server.listen(port, () => {
	console.log('listening on ' + port);
});