// Generate tmLanguage.json for DT0
// Usage: ts-node utils/tmlg.ts

import { TmBuilder } from "tmlb";
import { writeFileSync } from "fs";
import { compose } from "@discretetom/r-compose";

const language = new TmBuilder({ scopeName: "source.dt0" })
  // comments
  .append({
    name: "comment.line.dt0",
    match: compose(({ concat, escape, any }) =>
      concat(
        escape("//"),
        any(/./), // in non-multiline mode, the /./ doesn't match the /\n/
        "\n" // we don't need to add /$/ here since `match` will only effect the current line
      )
    ).source,
  })
  .append({
    name: "comment.block.dt0",
    begin: compose(({ escape }) => escape("/*")).source,
    // DON'T add /$/ to the `end` since it represent the end of current line instead of the whole file
    end: compose(({ escape }) => escape("*/")).source,
  })
  // keywords
  .append({
    name: "keyword.control.dt0",
    match: compose(({ concat, select }) =>
      concat(/\b/, select("fn", "return", "if", "else", "do", "while"), /\b/)
    ).source,
  })
  // operators
  .append({
    name: "keyword.operator.assignment.dt0",
    match: compose(({ select, escape }) => select(...["="].map(escape))).source,
  })
  .append({
    name: "keyword.operator.arithmetic.dt0",
    match: compose(({ select, escape }) =>
      select(...["+", "-", "*", "/", "%"].map(escape))
    ).source,
  })
  .append({
    name: "keyword.operator.logical.dt0",
    match: compose(({ select, escape }) => select(...["&&", "||"].map(escape)))
      .source,
  })
  .append({
    name: "keyword.operator.comparison.dt0",
    match: compose(({ select, escape }) =>
      select(...["==", "!=", "<", ">", "<=", ">="].map(escape))
    ).source,
  })
  .append({
    name: "keyword.operator.bitwise.dt0",
    match: compose(({ select, escape }) =>
      select(...["&", "|", "^", "~", "<<", ">>"].map(escape))
    ).source,
  })
  .append({
    name: "punctuation.dt0",
    match: compose(({ select, escape }) =>
      select(...[":", ",", "(", ")", "{", "}", ";"].map(escape))
    ).source,
  })
  // variables
  .append({
    name: "variable.other.dt0",
    match: /[a-zA-Z_]\w*/.source,
  })
  // constants
  .append({
    name: "constant.numeric.dt0",
    match: /\b\d+\b/.source,
  })
  .build({ validate: true });

writeFileSync(
  "./syntaxes/dt0.tmLanguage.json",
  JSON.stringify(language, null, 2),
  "utf-8"
);
