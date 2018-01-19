const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {

	var users;

		beforeEach(() => {
			users = new Users();
			users.users = [{
				id: '1',
				name: 'Bilal',
				room: 'Node Course'
			}, {
				id: '2',
				name: 'Ryan',
				room: 'React Course'
			}, {
				id: '3',
				name: 'Armaan',
				room: 'Node Course'
			}]
		})


	it('should add new user', () => {

		var users = new Users();
		var user = {
			id: 123,
			name: 'Bilal',
			room: 'The Office fans'
		}

		var resUser = users.addUser(user.id, user.name, user.room);

		expect(users.users).toEqual([user]);

	})

	it('should remove a user', () => {
		var userId = '1'
		var user = users.removeUser(userId)

		expect(user.id).toBe(userId)
		expect(users.users.length).toBe(2)
	})

	it('should not remove a user', () => {
		var userId = '1548686'
		var user = users.removeUser(userId)

		expect(user).toNotExist(userId)
		expect(users.users.length).toBe(3)

	})

	it('should find a user', () => {
		var findUser = users.getUser('3')
		expect(findUser.id).toEqual('3')
	})

	it('should not find a user', () => {
		var findUser = users.getUser('3')
		expect(findUser.id).toNotEqual('99')
	})

	it('should return names for Node Course', () => {
		var userList = users.getUserList('Node Course');

		expect(userList).toEqual(['Bilal', 'Armaan'])
	})

	it('should return names for React Course', () => {
		var userList = users.getUserList('React Course');

		expect(userList).toEqual(['Ryan'])
	})
})