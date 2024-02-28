import 'dotenv/config';
import readline from 'readline';
import spinner from 'cli-spinners';
import Bot from './src/lib/bot.js';

const COLORS = { reset: '\x1b[0m', negro: '\x1b[30m', rojo: '\x1b[31m', verde: '\x1b[32m', amarillo: '\x1b[33m', azul: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m', blanco: '\x1b[37m' };
const NODE_ENV = process.env.NODE_ENV;
const API_KEY = process.env.GEMINI_API_KEY; // como obtener la API_KEY https://makersuite.google.com/app/apikey
// const BOT_PROMPT = process.env.BOT_PROMPT; //a futuro cargar el prompt por variable de entorno
let intervalo;

consoleInit();
loadingInit();
var bot = new Bot(API_KEY);
setTimeout(init, 5000);

async function init() {
	loadingEnd();

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	loadingEnd();
	console.log(`📒 te dejo algunas indicaciones:\n -"chau" finaliza la charla\n -"log" te muestro la historia de la charla`);

	rl.question('👤 Como te llamás? ', (input) => {
		if (NODE_ENV === 'dev') { eraseLine() };
		askBot(`Hola! Mi nombre es ${input}`)
			.then(response => {
				botResponse(response);
				rl.prompt();
			})
	});

	rl.on('line', (line) => {
		switch (line) {
			case 'chau':
				if (NODE_ENV === 'dev') { eraseLine() }; // en prod no hace falta borrar esa linea extra para
				rl.close();
				break;

			case 'log':
				if (NODE_ENV === 'dev') { eraseLine() }; // en prod no hace falta borrar esa linea extra para
				botResponse(bot.log);
				rl.prompt();
				break;

			default:
				if (NODE_ENV === 'dev') { eraseLine() }; // en prod no hace falta borrar esa linea extra para
				askBot(line)
					.then(response => {
						botResponse(response);
						rl.prompt();
					})
				break;
		}
	});

	rl.on('close', () => {
		botResponse('Nos vemos!');
		process.exit(0);
	});
}

async function askBot(question) {
	try {
		loadingInit();
		return await bot.chat(question || '');
	} catch (error) {
		(NODE_ENV === 'dev') ? console.log(`${COLORS['rojo']}DEBUG:${COLORS['reset']}`, error) : null;
		return 'Ocurrio un error, por favor aguarda un momento y reintenta';
	}
}

function botResponse(text) {
	try {
		loadingEnd();
		if (Array.isArray(text)) {
			console.log('*****LOG*****');
			text.forEach((logPart, logPartIndex) => {
				logPart.parts.forEach((part, partIndex) => {
					console.log(`${COLORS['amarillo']} ${logPartIndex}) ${COLORS['azul']} ${logPart.role}: ${COLORS['reset']} ${part.text}`);
				});
			});
			console.log('*************');
		} else {
			console.log(`${COLORS['azul']}${bot.botName}${COLORS['reset']}`, text.replace(/\n\s*\n/g, '\n').replace(/\*\*/g, ''));
		}
	} catch (error) {
		(NODE_ENV === 'dev')
			? console.log(`${COLORS['rojo']}DEBUG:${COLORS['reset']}`, error)
			: console.log(`${COLORS['rojo']}ERROR:${COLORS['reset']}`, 'Ocurrio un error, por favor aguarda un momento y reintenta');
	}
}

function consoleInit() {
	console.clear();
	console.log('*************************************************************************************');
	console.log(' GOOGLE GENERATIVE IA - TEST');
	console.log('-------------------------------------------------------------------------------------');
	console.log(' API_KEY: ', API_KEY);
	console.log('***********************************************************************************\n');
	console.log(' ');
}

export function eraseLine() {
	process.stdout.moveCursor(0, -1);
	process.stdout.clearLine();
}

export function loadingInit() {
	let i = 0;
	intervalo = setInterval(() => {
		process.stdout.write(`\r${spinner.dots.frames[i]} `);
		i = (i + 1) % spinner.dots.frames.length;
	}, spinner.dots.interval);
}

export function loadingEnd() {
	clearInterval(intervalo);
	process.stdout.moveCursor(-2, 0);
	process.stdout.clearLine();
}