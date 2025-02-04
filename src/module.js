console.log('Module!!!');

async function start() {
    return "hey i'm async))))))";
}

// Обёрнутый вызов через другую асинхронную функцию
start().then(console.log);
