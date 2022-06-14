const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'jhar_pg',
    password: 'manoj123',
    port: 5432,
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUsersArr = async () => {
    const results = await pool.query('SELECT * FROM users ORDER BY id ASC');
    return results.rows;
}


const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const { uname, email } = request.body
    pool.query('INSERT INTO users (uname, email) VALUES ($1, $2)', [uname, email], (error, results) => {
        if (error) {
        throw error
        }
        response.status(201).send(`User added with ID: ${results.insertId}`)
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { uname, email } = request.body
    pool.query(
        'UPDATE users SET uname = $1, email = $2 WHERE id = $3',
        [uname, email, id],
        (error, results) => {
        if (error) {
            console.log('error',error,results)
            throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
        }
    )
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getUsers,
    getUsersArr,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}