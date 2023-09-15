const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const pressAnyKey = require('press-any-key');
const weather = require('weatherjs-promise');
const readlineSync = require('readline-sync');

const SKYMAP = {
  0: 'гроза',
  1: 'гроза',
  2: 'гроза',
  3: 'гроза',
  4: 'гроза',
  17: 'гроза',
  35: 'гроза',
  5: 'снег с дождем',
  6: 'мокрый снег',
  7: 'слякоть',
  8: 'гололед',
  9: 'гололед',
  10: 'мокрый снег с дождем',
  11: 'легкий дождь',
  12: 'дождь',
  13: 'легкий снег',
  14: 'снег',
  16: 'снег',
  42: 'снег',
  43: 'снег',
  15: 'метель',
  18: 'ливни',
  40: 'ливни',
  19: 'пыль',
  20: 'туман',
  21: 'легкий туман',
  22: 'дымка',
  23: 'ветренно',
  24: 'ветренно',
  25: 'холодно',
  26: 'облачно',
  27: 'переменная облачность (ночью)',
  29: 'переменная облачность (ночью)',
  33: 'переменная облачность (ночью)',
  28: 'переменная облачность',
  30: 'переменная облачность',
  34: 'переменная облачность',
  31: 'ясно (ночью)',
  32: 'ясно',
  36: 'жара',
  37: 'разрозненные грозы',
  38: 'разрозненные грозы',
  39: 'рассеянные ливни',
  41: 'рассеяный снегопад',
  44: 'нет данных',
  45: 'рассеянные ливни (ночью)',
  46: 'рассеяный снегопад (ночью)',
  47: 'разрозненные грозы (ночью)',
};

const selectAction = async (actions) => {
  let results = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Action',
      choices: actions,
      pageSize: 50
    }
  ]);
  console.log();

  return results.action;
};

const anyKey = async () => {
  console.log();
  return pressAnyKey('Для продолжения нажмите любую клавишу...');
}

const printHeader = async () => {
  console.log(
    chalk.yellow(
      figlet.textSync("Let's check weather!", { horizontalLayout: 'full' })
    )
  );

  console.log();
};

const main = async () => {
  let running = true;
  while (running) {
    clear();
    await printHeader();

    const selectedAction = await selectAction([
      'Смотреть погоду',
      'Выход',
    ]);

    if (selectedAction === 'Смотреть погоду') {
      const city = readlineSync.question("Please type in your city\n");
      const country = readlineSync.question("Please type in your country\n");

      const request = `${city}, ${country}`;
      const result = await weather({ search: request, degreeType: 'C' }).catch(err => {
        console.log(err);
      });
      if (result) {
        console.log(chalk.green(`Сейчас в ${city} ${result[0].current.temperature}°C.\nОщущается как ${result[0].current.feelslike}°C, ${SKYMAP[result[0].current.skycode]}.\nТемпература завтра от ${result[0].forecast[0].low}°C до ${result[0].forecast[0].high}°C.\nХорошего дня!`));
      }
    }

    if (selectedAction === 'Выход') {
      running = false;
    }

    if (running) {
      await anyKey();
    }
  }
};

main().then();