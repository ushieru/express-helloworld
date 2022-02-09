import express from 'express'
import NeDB from 'nedb'
import path from 'path'

const app = express()
const db = new NeDB({ filename: path.join(__dirname, 'users.db'), autoload: true })

app.use(express.json());

app.get('/user', (_request, response) => {
    db.find({}, (err, docs) => {
        if (err) return response.status(400).json({})
        response.json(docs)
    })
})

app.post('/user', (request, response) => {
    const { name, lastname, email } = request.body
    if (!name || !lastname || !email) return response.status(400).json({})
    const user = {
        name, lastname, email,
        createAt: Date.now()
    }
    db.insert(user, (err, doc) => {
        if (err) return response.status(400).json({})
        return response.json(doc)
    })
})

app.put('/user/:id', (request, response) => {
    const { id } = request.params;
    const { name, lastname, email } = request.body
    if (!name || !lastname || !email) return response.status(400).json({})
    db.update({ _id: id }, { $set: { name, lastname, email } }, { returnUpdatedDocs: true }, (err, numReplaced) => {
        if (err || !numReplaced) return response.status(400).json({})
        db.findOne({ _id: id }, (err, doc) => {
            if (err) return response.status(400).json({})
            return response.json(doc)
        })
    })
})

app.delete('/user/:id', (request, response) => {
    const { id } = request.params;
    db.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err || !numRemoved) return response.status(400).json({})
        return response.status(200).json({})
    })
})

app.listen(3000, () => console.log('Server run: http://localhost:3000/'))