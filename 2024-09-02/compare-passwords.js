const bcrypt = require('bcrypt')

async function comparePasswords() {
    const data = 'minhasenha'
    const encrypted = '$2b$10$z1vD/zW2hvyyJ0p0qT.egO4Tf/TPATOTTbg.OdSIfWsDzvHp2nIca'

    const result = await bcrypt.compare(data, encrypted)

    console.log(result)
}

comparePasswords()