import chalk from 'chalk'

//CUSTOM LOGGING LOGIC
export default class Logging {
  public static log = (args: any) => this.info(args)

  //Set blue text for info strings
  public static info = (args: any) =>
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}] [INFO]`, typeof args === 'string' ? chalk.blueBright(args) : args),
    )

  //Set yellow text for warning string
  public static warn = (args: any) =>
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === 'string' ? chalk.yellowBright(args) : args,
    )

  //Set red text for error strings
  public static error = (args: any) =>
    console.log(
      chalk.red(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === 'string' ? chalk.redBright(args) : args,
    )
}
