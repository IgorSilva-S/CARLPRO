const express = require('express')

const app = express()
app.use(express.json())

const countries = ["Brazil", "Canada", "Germany", "China", "Japan", "Australia", "England", "Spain", "Korea", "Mexico"];
const animals = ["Dog", "Cat", "Fish", "Cow", "Buffalo", "Owl", "Bird", "Rabbit", "Capybara", "Duck"];
let actualWord = ''
let charsInWord = 0
let divWord = []
let triedLetters = []
let letterPosition = []
let hidedWord = []
let errors = 0
let playerName = 'Player'
const lifes = 7;
let isGameStarted = false

app.get('/hangman/devKeys/words/countries', (req, res) => {
    return res.status(200).json(countries)
})

app.get('/hangman/devKeys/words/animals', (req, res) => {
    return res.status(200).json(animals)
})

app.post('/hangman/new-game', (req, res) => {
    let wordType = undefined
    actualWord = ''
    charsInWord = 0
    divWord = []
    triedLetters = []
    errors = 0

    let filter = req.query.words
    if (filter == "countries") {
        wordType = Math.floor(Math.random() * countries.length)
        actualWord = countries[wordType]
        let LCActualWord = actualWord.toLowerCase()
        charsInWord = actualWord.length
        for (let i = 0; i <= charsInWord; i++) {
            divWord.push(LCActualWord.charAt(i))
            hidedWord.push('*')
        }
    } else if (filter === "animals") {
        wordType = Math.floor(Math.random() * animals.length)
        actualWord = animals[wordType]
        charsInWord = actualWord.length
        let LCActualWord = actualWord.toLowerCase()
        for (let i = 0; i < charsInWord; i++) {
            divWord.push(LCActualWord.charAt(i))
            hidedWord.push('*')
        }
    } else {
        console.log('Insert a Filter')
    }
    console.log(`The game has started with the filter ${filter}! Your word has ${charsInWord} characters. \nNo word has space.\nTo try a letter, use /hangman/insertLetter?letter=(the letter come here)\n\nAcutual Word: ${hidedWord.join('')}`)
    isGameStarted = true
    return res.sendStatus(200)
})

app.post('/hangman/insertLetter', (req, res) => {
   if (isGameStarted) {
    let letter = req.query.letter
    letter = letter.toLowerCase()
    if (letter.length != 1) {
        if (letter.length > 1) {
            return res.status(406).json({ error: 'Insert only one letter!' })
        }
        if (letter.length < 1) {
            return res.status(406).json({ error: 'Insert a letter!' })
        }
    }
    if (triedLetters.indexOf(letter) != -1) {
        return res.status(406).json({ alert: 'You have already entered this letter!' })
    }

    triedLetters.push(letter)
    /*console.log(divWord.indexOf(letter))*/
    if (divWord.indexOf(letter) == -1) {
        console.log(`The word doesn't have the letter ${letter}! You losed one life`)
        errors++
        if (errors >= lifes) {
            console.log(`Game over, you lost!\n\nThe word was ${actualWord}`)
            actualWord = ''
            charsInWord = 0
            divWord = []
            triedLetters = []
            errors = 0
            isGameStarted = false
        }
    } else {
        let letterPosition = []
        for (let i = 0; i < divWord.length; i++ ) {
            let WordLetter = divWord[i]
            if (WordLetter == letter) {
                let positionWord = i
                positionWord++
                letterPosition.push(positionWord)
                hidedWord.splice(i, 0, letter)
                hidedWord.splice(0, -1)
            }
        }
        console.log(`The word contains the letter ${letter} in ${letterPosition} position(s)`)
        console.log('')
        console.log(`Actual Word: ${hidedWord.join('')}`)
    }
    return res.sendStatus(200)
   } else {
    return res.status(404).json({ error: "Can't found any game started" })
   }
})

app.get('/hangman/devKeys/actual', (req, res) => {
    console.log('DevKeys: Getting all Items')
    console.log('')
    console.log(actualWord)
    console.log(charsInWord)
    console.log(divWord)
    return res.sendStatus(200)
})

app.listen(3030, () => {
    console.log('Port: 3030')
})