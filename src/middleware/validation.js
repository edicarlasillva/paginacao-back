export function validateUserResistration(resquest, response, next) {
  const { name, email, password } = resquest.body

  if (!name || !email || !password) {
    return response.status(400).json({
      message: "O preeenchimento dos campos é obrigatório."
    })
  }

  next()
}
