// import express from 'express'
import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { users } from './users'

// const router = express.Router()
const router = Router()

const messages = []

// Rota para criar um recado
router.post("/", (request, response) => {
  const { title, description, userId } = request.body

  const user = users.find(user => user.id === userId)

  if (!user) {
    return response.status(404).json({
      message: "Usuário não encontrado."
    })
  }

  const newMessage = {
    id: uuidv4(),
    title,
    description,
    userId
  }

  messages.push(newMessage)

  response.status(201).json({
    message: "Recado criado com sucesso.",
    newMessage
  })

})

// Rota para listar todos os recados de um usuário específico
// router.get("/:userId", (resquest, response) => {
//   const { userId } = resquest.params

//   const user = users.find(user => user.id === userId)

//   if (!user) {
//     return response.status(404).json({
//       message: "Usuário não encontrado."
//     })
//   }

//   const userMessages = messages.filter(message => message.userId === userId)

//   response.status(200).json(userMessages)
// })

// https://rickandmortyapi.com/api/character/?page=3&perPage=5

router.get("/:userId", (request, response) => {
  const { userId } = request.params

  // page -> página atual ex.: page=2
  // perPage -> quantos recados devem ser exibidos por página
  // perPage=5 (5 recados por página)
  const { page, perPage } = request.query

  const user = users.find(user => user.id === userId)

  if (!user) {
    return response.status(404).json({
      message: "Usuário não encontrado."
    })
  }

  // Converte os valores para números inteiros
  const currentPage = parseInt(page) || 1
  const itemsPerPage = parseInt(perPage) || 10

  const userMessages = messages.filter(message => message.userId === userId)

  // quantidade de recados no array userMessages
  const totalItems = userMessages.length

  // currentPage = 1
  // itemsPerPage = 10
  // significa que, na primeira página, vai exibir os recados de 1 a 10 (índices 0 a 9)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const paginatedMessages = userMessages.slice(startIndex, endIndex)

  const totalPages = Math.ceil(totalItems / itemsPerPage) // Calcula o número total de páginas

  response.status(200).json({
    userMessages: paginatedMessages,
    totalPages,
    currentPage
  })
})

// Rota para listar recado por id
router.get("/list/:messageId", (request, response) => {
  const { messageId } = request.params

  const message = messages.find(message => message.id === messageId)

  if (!message) {
    return response.status(404).json({
      message: "Recado não encontrado."
    })
  }

  response.status(200).json(message)
})

// Rota para atualizar um recado
router.put("/:messageId", (request, response) => {
  const { messageId } = request.params
  const { title, description } = request.body

  const messageIndex = messages.findIndex(message => message.id === messageId)

  if (messageIndex === -1) {
    return response.status(404).json({
      message: "Recado não encontrado."
    })
  }

  messages[messageIndex].title = title
  messages[messageIndex].description = description

  response.status(200).json({
    message: "Recado atualizado com sucesso."
  })
})

// Rota para excluir um recado
router.delete("/:messageId", (request, response) => {
  const { messageId } = request.params

  const messageIndex = messages.findIndex(message => message.id === messageId)

  if (messageIndex === -1) {
    return response.status(404).json({
      message: "Recado não encontrado."
    })
  }

  const deletedMessage = messages.splice(messageIndex, 1)

  response.status(200).json({
    message: "Recado excluído com sucesso.",
    deletedMessage
  })
})

export default router
