// Generate tmLanguage.json for DT0
// Usage: ts-node utils/tmlg.ts

import { TmBuilder } from "tmlb";
import { writeFileSync } from "fs";
import { compose } from "@discretetom/r-compose";

const language = new TmBuilder({ scopeName: "source.dt0" })
  .append({
    name: "comment.line.dt0",
    match: compose(({ concat, select, escape, any }) =>
      concat(
        escape("//"),
        any(/./), // in non-multiline mode, the /./ doesn't match the /\n/
        select("\n", "$")
      )
    ).source,
  })
  .append({
    name: "comment.block.dt0",
    begin: compose(({ escape }) => escape("/*")).source,
    end: compose(({ escape, select }) => select(escape("*/"), /$/)).source,
  })
  .append({
    name: "keyword.control.dt0",
    match: compose(({ concat, select }) =>
      concat(/\b/, select("fn", "return", "if", "else", "do", "while"), /\b/)
    ).source,
  })
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
  .append({
    name: "variable.other.dt0",
    match: /[a-zA-Z_]\w*/.source,
  })
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