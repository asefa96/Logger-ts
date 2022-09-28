/* eslint-disable @typescript-eslint/no-this-alias */
import * as fs from "fs";
import * as path from "path";

class Logger {
  public baseDir: string;
  public fileName: string;
  public linePrefix: string;

  public today: Date = new Date();

  constructor() {
    const _dateString = this.today
      .toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split("/")
      .join("-");

    const _timeString = this.today.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    this.baseDir = path.join(__dirname,'../.logs/');

    this.fileName = `${_dateString}.log`;
    this.linePrefix = `[${_dateString} ${_timeString}]`;
  }

  public info(_string: string): void {
    this.addLog("INFO", _string);
  }

  public warn(_string: string): void {
    this.addLog("WARN", _string);
  }

  public error(_string: string): void {
    this.addLog("ERROR", _string);
  }

  public custom(_filename: string, _string: string): void {
    this.addLog(_filename, _string);
  }

  private addLog(_kind: string, _string: string): void {
    const _that = this;
    _kind = _kind.toUpperCase();

    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }

    fs.open(
      `${_that.baseDir}${_that.fileName}`,
      "a",
      (_err, _fileDescriptor) => {
        if (!_err && _fileDescriptor) {
          // Append to file and close it
          fs.appendFile(
            _fileDescriptor,
            `${_that.linePrefix} [${_kind}] ${_string}\n`,
            (_err) => {
              if (!_err) {
                fs.close(_fileDescriptor, (_err) => {
                  if (!_err) {
                    return true;
                  } else {
                    return console.log(
                      "\x1b[31m%s\x1b[0m",
                      "Error closing log file that was being appended"
                    );
                  }
                });
              } else {
                return console.log(
                  "\x1b[31m%s\x1b[0m",
                  "Error appending to the log file"
                );
              }
            }
          );
        } else {
          return console.log(
            "\x1b[31m%s\x1b[0m",
            "Error cloudn't open the log file for appending"
          );
        }
      }
    );
  }

  public clean(): void {
    //
  }
}

export default new Logger();
