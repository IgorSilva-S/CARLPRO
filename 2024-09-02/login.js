const { z } = require('zod')

const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password too short")
})

const data = {
    email: 'igor.silva1@aluno.ifsp.edu.br',
    password: '36697-OEM-0074550-54237'
}

try {
    schema.parse(data)
    console.log('Data is valid')
} catch (error) {
    console.log(error.errors)
}