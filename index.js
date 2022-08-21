
const TelegramApi = require('node-telegram-bot-api')
const {gameOption, againOption} = require('./options')
const token = '5695440157:AAEKM7hoG8knEyR9qnSVU-gfFanCvImCcJw'

const bot = new TelegramApi(token, {polling: true})
const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадую цифру от 0 до 9, а ты должен будешь отгадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай, я готов!', gameOption);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное привествие!'},
        {command: '/info', description: 'Выводит информацию о пользователе'},
        {command: '/game', description: 'Игра отгадай число'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/320/625/3206250e-cee1-4819-9061-668f394a9df6/9.webp')
            return bot.sendMessage(chatId, 'Добро пожаловать в моего телеграмм бота!')
        }
        if (text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game'){
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Убедитесь в правильности ввода данных')
    })
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]){
            bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp', againOption)
            return bot.sendMessage(chatId, `Поздравляю, ты угодал цифру ${chats[chatId]}`)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру: ${chats[chatId]}`, againOption)
        }
    })
}

start()
