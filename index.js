const express = require('express')
const mysql = require('mysql2/promise')
const app = express()
app.use(express.json())

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sofia_api_jogos',
    waitForConnections: true
})

// ======================================================================================================================
// =========== Rotas generos ==============
// ======================================================================================================================

// =========== listar generos ==============
app.get('/generos', async (req, res) =>{
    const[generos]= await pool.execute('SELECT * FROM genero')
    res.json(generos)
})

// =========== criar generos ==============
app.post('/generos' , async (req, res)=>{
    const {nome, descricao} = req.body

    if(!nome || !descricao){
        return res.status(400).json({error:'Nome e descrição são obrigatórios'})
    }
    const [result] = await pool.execute('INSERT INTO genero (nome, descricao) VALUES(?, ?)',[nome, descricao])
    return res.status(201).json({id:result.insertId, nome, descricao})
})

// ======================================================================================================================
// =========== Rotas jogos ==============
// ======================================================================================================================


// =========== listar jogos ==============
app.get('/jogos', async (req, res) =>{
    const[jogos]= await pool.execute('SELECT * FROM jogos')
    res.json(jogos)
})

// =========== listar jogos por id ==============
app.get('/jogos/:id', async (req, res) =>{
    const id = req.params.id

    const[jogo]= await pool.execute('SELECT * FROM jogos WHERE id = ?',[id])
        if (jogo.length === 0) {
            return res.status(404).json({error: "Jogo não encontrado."})
        }
    res.json(jogo[0])
})

// =========== criar jogos ==============
app.post('/jogos' , async (req, res)=>{
    const {nome, desenvolvedora, sinopse, genero} = req.body
    if (!nome || !desenvolvedora || !sinopse || !genero){
        return res.status(400).json({error: 'Nome, desenvolvedora, sinopse e o id do gênero são obrigatórios.'})
    }
    const [result] = await pool.execute('INSERT INTO jogos (nome, desenvolvedora, sinopse, genero) VALUES(?, ?, ?, ?)',[nome, desenvolvedora, sinopse, genero])
    return res.status(201).json({id:result.insertId, nome, desenvolvedora, sinopse, genero})
    
})

// =========== editar jogos ==============
app.put('/jogos/:id', async (req,res) => {
    const idInform = req.params.id
    const {nome, desenvolvedora, sinopse, genero}= req.body
    if (!nome || !desenvolvedora || !sinopse || !genero){
        return res.status(400).json({error: 'Nome, desenvolvedora, sinopse e o id do gênero são obrigatórios.'})
    }
    const[jogosEncontrados] = await pool.execute('SELECT *FROM jogos WHERE id = ?',[idInform])
    if(jogosEncontrados.length === 0){
        return res.status(404).json({error: "Jogo não encontrado."})
    }


    const [result] = await pool.execute('UPDATE jogos SET nome = ?, desenvolvedora = ?, sinopse = ?, genero = ? WHERE id = ?', [nome, desenvolvedora, sinopse, genero, idInform])

    res.status(200).json({id:idInform, nome, desenvolvedora, sinopse, genero})
})


// =========== deletar jogos ==============
app.delete('/jogos/:id', async(req, res) =>{
    const id = req.params.id
    const [result] = await pool.execute('DELETE FROM jogos WHERE id = ?',[id])

    if(result.affectedRows === 0){
        return res.status(404).json({error:'Jogo não encontrado.'})
    }
    res.status(204).json()
})

app.listen(3000,() => console.log('API rodando >:D'))